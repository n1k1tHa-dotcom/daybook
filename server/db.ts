import { and, asc, count, desc, eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  journalDays,
  memories,
  scrapbookElements,
  tasks,
  tinyMoments,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length ? result[0] : undefined;
}

async function getJournalDay(userId: number, date: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(journalDays).where(and(eq(journalDays.userId, userId), eq(journalDays.date, date))).limit(1);
  return rows[0];
}

export async function getJournalDayBundle(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;
  const day = await getJournalDay(userId, date);
  if (!day) return null;
  const [dayTasks, dayMemories, dayMoments, elements] = await Promise.all([
    db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.journalDayId, day.id))).orderBy(asc(tasks.sortOrder), desc(tasks.createdAt)),
    db.select().from(memories).where(and(eq(memories.userId, userId), eq(memories.journalDayId, day.id))).orderBy(asc(memories.createdAt)),
    db.select().from(tinyMoments).where(and(eq(tinyMoments.userId, userId), eq(tinyMoments.journalDayId, day.id))).orderBy(asc(tinyMoments.sortOrder), asc(tinyMoments.createdAt)),
    db.select().from(scrapbookElements).where(and(eq(scrapbookElements.userId, userId), eq(scrapbookElements.journalDayId, day.id))).orderBy(asc(scrapbookElements.createdAt)),
  ]);
  return { day, tasks: dayTasks, memories: dayMemories, moments: dayMoments, elements };
}

export async function upsertJournalDay(userId: number, input: { date: string; vibe: string; atmospherePrompt?: string; journalText: string; reflection?: string; sealed?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await getJournalDay(userId, input.date);
  const values = { vibe: input.vibe, atmospherePrompt: input.atmospherePrompt ?? null, journalText: input.journalText, reflection: input.reflection ?? null, sealed: input.sealed === undefined ? (existing?.sealed ?? 0) : input.sealed ? 1 : 0 };
  if (existing) {
    await db.update(journalDays).set(values).where(and(eq(journalDays.id, existing.id), eq(journalDays.userId, userId)));
  } else {
    await db.insert(journalDays).values({ userId, date: input.date, ...values });
  }
  return getJournalDayBundle(userId, input.date);
}

export async function insertJournalTask(userId: number, input: { date: string; title: string; completed?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const day = await getJournalDay(userId, input.date);
  if (!day) throw new Error("Create the journal day before adding tasks");
  await db.insert(tasks).values({ userId, journalDayId: day.id, title: input.title, completed: input.completed ? 1 : 0 });
  return getJournalDayBundle(userId, input.date);
}

export async function toggleJournalTask(userId: number, taskId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.select().from(tasks).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId))).limit(1);
  const task = rows[0];
  if (!task) throw new Error("Task not found");
  await db.update(tasks).set({ completed: task.completed ? 0 : 1 }).where(and(eq(tasks.id, task.id), eq(tasks.userId, userId)));
  return getJournalDayBundle(userId, (await db.select({ date: journalDays.date }).from(journalDays).where(eq(journalDays.id, task.journalDayId)).limit(1))[0]?.date ?? "");
}

export async function insertJournalMemory(userId: number, input: { date: string; kind: string; title: string; caption: string; assetUrl?: string; emoji?: string; rotation?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const day = await getJournalDay(userId, input.date);
  if (!day) throw new Error("Create the journal day before adding memories");
  await db.insert(memories).values({ userId, journalDayId: day.id, kind: input.kind, title: input.title, caption: input.caption, assetUrl: input.assetUrl ?? null, emoji: input.emoji ?? null, rotation: input.rotation ?? 0 });
  return getJournalDayBundle(userId, input.date);
}

export async function insertTinyMoment(userId: number, input: { date: string; kind: string; label: string; note: string; mediaUrl?: string; occurredAt: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const day = await getJournalDay(userId, input.date);
  if (!day) throw new Error("Create the journal day before adding moments");
  await db.insert(tinyMoments).values({ userId, journalDayId: day.id, kind: input.kind, label: input.label, note: input.note, mediaUrl: input.mediaUrl ?? null, occurredAt: input.occurredAt });
  return getJournalDayBundle(userId, input.date);
}

export async function listSameDateHistory(userId: number, date: string) {
  const db = await getDb();
  if (!db) return [];
  const suffix = date.slice(4);
  return db.select({ date: journalDays.date, journalText: journalDays.journalText, vibe: journalDays.vibe, photoCount: count(memories.id) })
    .from(journalDays)
    .leftJoin(memories, eq(memories.journalDayId, journalDays.id))
    .where(and(eq(journalDays.userId, userId), like(journalDays.date, `%${suffix}`)))
    .groupBy(journalDays.id, journalDays.date, journalDays.journalText, journalDays.vibe)
    .orderBy(desc(journalDays.date));
}

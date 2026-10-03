import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const journalDays = mysqlTable("journal_days", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  vibe: varchar("vibe", { length: 32 }).default("soft").notNull(),
  atmospherePrompt: text("atmospherePrompt"),
  journalText: text("journalText").notNull(),
  reflection: text("reflection"),
  sealed: int("sealed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const tasks = mysqlTable("journal_tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  journalDayId: int("journalDayId").notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  completed: int("completed").default(0).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const memories = mysqlTable("journal_memories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  journalDayId: int("journalDayId").notNull(),
  kind: varchar("kind", { length: 24 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  caption: text("caption").notNull(),
  assetUrl: text("assetUrl"),
  emoji: varchar("emoji", { length: 16 }),
  x: int("x").default(0).notNull(),
  y: int("y").default(0).notNull(),
  width: int("width").default(0).notNull(),
  height: int("height").default(0).notNull(),
  rotation: int("rotation").default(0).notNull(),
  frame: varchar("frame", { length: 32 }).default("polaroid").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tinyMoments = mysqlTable("tiny_moments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  journalDayId: int("journalDayId").notNull(),
  kind: varchar("kind", { length: 24 }).notNull(),
  label: varchar("label", { length: 120 }).notNull(),
  note: text("note").notNull(),
  mediaUrl: text("mediaUrl"),
  occurredAt: varchar("occurredAt", { length: 32 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const scrapbookElements = mysqlTable("scrapbook_elements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  journalDayId: int("journalDayId").notNull(),
  kind: varchar("kind", { length: 32 }).notNull(),
  data: text("data"),
  x: int("x").default(0).notNull(),
  y: int("y").default(0).notNull(),
  scale: int("scale").default(100).notNull(),
  rotation: int("rotation").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JournalDay = typeof journalDays.$inferSelect;
export type InsertJournalDay = typeof journalDays.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type TinyMoment = typeof tinyMoments.$inferSelect;
export type ScrapbookElement = typeof scrapbookElements.$inferSelect;

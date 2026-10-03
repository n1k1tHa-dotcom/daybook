import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getJournalDayBundle,
  insertJournalMemory,
  insertJournalTask,
  insertTinyMoment,
  listSameDateHistory,
  toggleJournalTask,
  upsertJournalDay,
} from "./db";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD dates");
const vibeSchema = z.enum(["soft", "midnight", "cozy", "academic", "pink", "darkAcademia", "nature", "y2k"]);

function resolveAtmosphere(prompt: string) {
  const text = prompt.toLowerCase();
  if (text.includes("rain") || text.includes("sunday")) return { vibe: "soft", palette: { paper: "ivory", ink: "warm charcoal", accent: "rose" }, paper: "soft grain", decorations: ["raindrops", "pressed petals"], reflectionTone: "gentle and unhurried" };
  if (text.includes("study") || text.includes("library")) return { vibe: "academic", palette: { paper: "faded linen", ink: "deep teal", accent: "slate" }, paper: "lined notebook", decorations: ["paperclips", "margin notes"], reflectionTone: "clear-headed and focused" };
  if (text.includes("night") || text.includes("late")) return { vibe: "midnight", palette: { paper: "ink violet", ink: "moon cream", accent: "lavender" }, paper: "star-flecked", decorations: ["constellations", "silver tape"], reflectionTone: "quiet and reflective" };
  if (text.includes("forest") || text.includes("garden") || text.includes("green")) return { vibe: "nature", palette: { paper: "moss cream", ink: "forest", accent: "sage" }, paper: "botanical", decorations: ["leaves", "field labels"], reflectionTone: "grounded and growing" };
  if (text.includes("retro") || text.includes("2000") || text.includes("y2k")) return { vibe: "y2k", palette: { paper: "lilac", ink: "plum", accent: "violet" }, paper: "shimmer", decorations: ["stars", "gel pen"], reflectionTone: "bright and nostalgic" };
  if (text.includes("book") || text.includes("dark")) return { vibe: "darkAcademia", palette: { paper: "old parchment", ink: "espresso", accent: "walnut" }, paper: "deckled parchment", decorations: ["bookplates", "ink stamps"], reflectionTone: "curious and considered" };
  if (text.includes("pink") || text.includes("sparkle")) return { vibe: "pink", palette: { paper: "blush", ink: "berry", accent: "hot pink" }, paper: "glossy", decorations: ["bows", "sparkles"], reflectionTone: "playful and glowing" };
  if (text.includes("warm") || text.includes("coffee") || text.includes("slow")) return { vibe: "cozy", palette: { paper: "oat", ink: "cocoa", accent: "terracotta" }, paper: "warm fiber", decorations: ["mugs", "knit tape"], reflectionTone: "warm and present" };
  return { vibe: "soft", palette: { paper: "ivory", ink: "warm charcoal", accent: "rose" }, paper: "soft grain", decorations: ["pressed petals"], reflectionTone: "gentle and open" };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  daybook: router({
    getDay: protectedProcedure.input(z.object({ date: dateSchema })).query(({ ctx, input }) => getJournalDayBundle(ctx.user.id, input.date)),
    saveDay: protectedProcedure.input(z.object({ date: dateSchema, vibe: vibeSchema, atmospherePrompt: z.string().max(1000).optional(), journalText: z.string().max(20000), reflection: z.string().max(1000).optional(), sealed: z.boolean().optional() })).mutation(({ ctx, input }) => upsertJournalDay(ctx.user.id, input)),
    addTask: protectedProcedure.input(z.object({ date: dateSchema, title: z.string().min(1).max(240), completed: z.boolean().optional() })).mutation(({ ctx, input }) => insertJournalTask(ctx.user.id, input)),
    toggleTask: protectedProcedure.input(z.object({ taskId: z.number().int().positive() })).mutation(({ ctx, input }) => toggleJournalTask(ctx.user.id, input.taskId)),
    addMemory: protectedProcedure.input(z.object({ date: dateSchema, kind: z.string().max(24), title: z.string().max(180), caption: z.string().max(1000), assetUrl: z.string().max(2000).optional(), emoji: z.string().max(16).optional(), rotation: z.number().int().min(-180).max(180).optional() })).mutation(({ ctx, input }) => insertJournalMemory(ctx.user.id, input)),
    addTinyMoment: protectedProcedure.input(z.object({ date: dateSchema, kind: z.string().max(24), label: z.string().max(120), note: z.string().min(1).max(1000), mediaUrl: z.string().max(2000).optional(), occurredAt: z.string().max(32) })).mutation(({ ctx, input }) => insertTinyMoment(ctx.user.id, input)),
    history: protectedProcedure.input(z.object({ date: dateSchema })).query(({ ctx, input }) => listSameDateHistory(ctx.user.id, input.date)),
    resolveAtmosphere: publicProcedure.input(z.object({ prompt: z.string().min(1).max(1000) })).mutation(({ input }) => resolveAtmosphere(input.prompt)),
  }),
});

export type AppRouter = typeof appRouter;

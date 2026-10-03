export type VibeKey =
  | "soft"
  | "midnight"
  | "cozy"
  | "academic"
  | "pink"
  | "darkAcademia"
  | "nature"
  | "y2k";

export type MemoryKind = "photo" | "note" | "song";

export type Memory = {
  id: string;
  kind: MemoryKind;
  title: string;
  caption: string;
  image?: string;
  emoji?: string;
  rotation: number;
  x: number;
  y: number;
  accent: string;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type TinyMoment = {
  id: string;
  time: string;
  kind: MemoryKind;
  label: string;
  note: string;
  emoji: string;
};

export type PastMemory = {
  year: number;
  photoCount: number;
  snippet: string;
  emoji: string;
};

export type DayData = {
  date: string;
  vibe: VibeKey;
  atmospherePrompt: string;
  journalText: string;
  tasks: Task[];
  memories: Memory[];
  moments: TinyMoment[];
  past: PastMemory[];
  sealed: boolean;
};

export const vibePresets: Record<
  VibeKey,
  {
    label: string;
    emoji: string;
    paper: string;
    ink: string;
    accent: string;
    accentSoft: string;
    wash: string;
    texture: string;
    note: string;
  }
> = {
  soft: {
    label: "Soft",
    emoji: "🌸",
    paper: "#fffaf3",
    ink: "#403c3b",
    accent: "#e992a4",
    accentSoft: "#f5dce2",
    wash: "#f7ece8",
    texture: "soft",
    note: "gentle, unhurried, a little pink",
  },
  midnight: {
    label: "Midnight",
    emoji: "🌙",
    paper: "#292840",
    ink: "#f3e8da",
    accent: "#a69bd4",
    accentSoft: "#454064",
    wash: "#1e1d31",
    texture: "midnight",
    note: "late-night thoughts under a violet sky",
  },
  cozy: {
    label: "Cozy",
    emoji: "☕",
    paper: "#fff7e8",
    ink: "#534233",
    accent: "#c98552",
    accentSoft: "#f1d7b9",
    wash: "#f5ead7",
    texture: "cozy",
    note: "warm mugs, wool socks, soft edges",
  },
  academic: {
    label: "Academic",
    emoji: "📓",
    paper: "#f6f4ed",
    ink: "#293c42",
    accent: "#62828c",
    accentSoft: "#dbe7e4",
    wash: "#e9eee9",
    texture: "academic",
    note: "lined paper and a clear head",
  },
  pink: {
    label: "Pink scrapbook",
    emoji: "🎀",
    paper: "#fff1f5",
    ink: "#5a3042",
    accent: "#ed6f9c",
    accentSoft: "#ffd3e2",
    wash: "#ffe6ee",
    texture: "pink",
    note: "glossy stickers and a little sparkle",
  },
  darkAcademia: {
    label: "Dark academia",
    emoji: "🖤",
    paper: "#e8e0d0",
    ink: "#2f2925",
    accent: "#7d5b42",
    accentSoft: "#d9c5a7",
    wash: "#c5b29b",
    texture: "dark-academia",
    note: "old books, rain on windows, good questions",
  },
  nature: {
    label: "Nature",
    emoji: "🌿",
    paper: "#f5f6e9",
    ink: "#314d3c",
    accent: "#739b68",
    accentSoft: "#d8e6c9",
    wash: "#e3eddb",
    texture: "nature",
    note: "a slow walk through green things",
  },
  y2k: {
    label: "Y2K",
    emoji: "✨",
    paper: "#f5f1ff",
    ink: "#34245b",
    accent: "#9f67e8",
    accentSoft: "#ead7ff",
    wash: "#e7e2ff",
    texture: "y2k",
    note: "shimmery, optimistic, a little nostalgic",
  },
};

export const demoImageUrls = [
  "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=82",
];

export const seedDay: DayData = {
  date: "2026-10-03",
  vibe: "cozy",
  atmospherePrompt: "Make today feel like a slow Saturday with somewhere lovely to go.",
  journalText:
    "A full little day. I got through the assignment, found a sunny corner for coffee, and remembered that making space for the tiny things is still making progress.",
  tasks: [
    { id: "task-1", title: "Finish Java assignment", completed: true },
    { id: "task-2", title: "Study for 2 hours", completed: true },
    { id: "task-3", title: "Go to the gym", completed: true },
    { id: "task-4", title: "Read chapter 4", completed: false },
  ],
  memories: [
    {
      id: "memory-1",
      kind: "photo",
      title: "First coffee",
      caption: "a tiny reset before the day began",
      image: demoImageUrls[1],
      rotation: -3,
      x: 0,
      y: 0,
      accent: "#efc981",
    },
    {
      id: "memory-2",
      kind: "photo",
      title: "Sunny corner",
      caption: "found this cute little spot",
      image: demoImageUrls[2],
      rotation: 4,
      x: 0,
      y: 0,
      accent: "#b8d3a9",
    },
    {
      id: "memory-3",
      kind: "note",
      title: "Note to self",
      caption: "small progress is still progress.",
      emoji: "✦",
      rotation: -2,
      x: 0,
      y: 0,
      accent: "#edb2ba",
    },
  ],
  moments: [
    { id: "moment-1", time: "10:32 AM", kind: "photo", label: "Coffee", note: "Finally survived that 8 AM class.", emoji: "☕" },
    { id: "moment-2", time: "1:47 PM", kind: "photo", label: "Campus", note: "Found this cute little spot.", emoji: "📸" },
    { id: "moment-3", time: "7:21 PM", kind: "song", label: "Today's song", note: "This song is literally today.", emoji: "♫" },
  ],
  past: [
    { year: 2025, photoCount: 3, snippet: "First week of college…", emoji: "🎒" },
    { year: 2024, photoCount: 1, snippet: "a new city, a new little life", emoji: "🗺️" },
  ],
  sealed: false,
};

export function cloneDay(day: DayData): DayData {
  return JSON.parse(JSON.stringify(day)) as DayData;
}

export function formatDateLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function moveDate(date: string, amount: number): string {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + amount);
  return next.toISOString().slice(0, 10);
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function resolvePrompt(prompt: string): VibeKey {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("rain") || normalized.includes("sunday")) return "soft";
  if (normalized.includes("study") || normalized.includes("library")) return "academic";
  if (normalized.includes("night") || normalized.includes("late")) return "midnight";
  if (normalized.includes("forest") || normalized.includes("garden") || normalized.includes("green")) return "nature";
  if (normalized.includes("retro") || normalized.includes("2000") || normalized.includes("y2k")) return "y2k";
  if (normalized.includes("book") || normalized.includes("dark")) return "darkAcademia";
  if (normalized.includes("pink") || normalized.includes("sparkle")) return "pink";
  if (normalized.includes("warm") || normalized.includes("coffee") || normalized.includes("slow")) return "cozy";
  return "soft";
}

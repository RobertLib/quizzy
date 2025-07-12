import type { QuizQuestion } from "@/types/quiz";
import { dailyQuestionBank } from "@/data/fallback-questions";

export const DAILY_QUESTION_COUNT = 8;

function keyFrom(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return keyFrom(new Date());
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return keyFrom(d);
}

/** Whole days since the epoch, in local time. */
export function dayNumber(key: string = todayKey()): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Small deterministic PRNG so every player gets the same daily set. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Fixed seed: the running order of the bank is the same for every player. */
const ORDER_SEED = 20260101;

let cachedOrder: QuizQuestion[] | null = null;

function bankOrder(): QuizQuestion[] {
  cachedOrder ??= seededShuffle(dailyQuestionBank, ORDER_SEED);
  return cachedOrder;
}

/**
 * The daily set is drawn from the bundled bank, so it is identical for everyone
 * and works offline. Each day takes the next slice of one fixed permutation,
 * walked circularly — no question can come back until the whole bank has been
 * used (currently a bit over two weeks). The extra `+cycle` shift means the
 * groupings drift on each pass instead of repeating forever.
 */
export function buildDailyQuiz(key: string = todayKey()): QuizQuestion[] {
  const order = bankOrder();
  const total = order.length;
  if (total === 0) return [];

  const count = Math.min(DAILY_QUESTION_COUNT, total);
  const raw = dayNumber(key) * count;
  const cycle = Math.floor(raw / total);
  const start = ((raw + cycle) % total + total) % total;

  return Array.from({ length: count }, (_, i) => order[(start + i) % total]);
}

/** Local-time milliseconds until the next daily unlocks. */
export function msUntilTomorrow(now: Date = new Date()): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}h ${`${m}`.padStart(2, "0")}m ${`${s}`.padStart(2, "0")}s`;
}

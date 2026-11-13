import { questionBank, type BankQuestion } from "@/data/questions";
import { DAILY_QUESTION_COUNT, dayNumber } from "./daily";

/**
 * Server-side only in practice: importing this pulls the whole question bank
 * into the bundle. Clients fetch a day's set from /api/daily/[date].
 */

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

function seededShuffle<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Fixed seed: the running order of a pool is the same for every player. */
const ORDER_SEED = 20260101;

/**
 * The bank is sorted by release batch, so the pool for any day is a prefix of
 * it and its length identifies it.
 */
const orderCache = new Map<number, BankQuestion[]>();

function poolOrder(key: string): BankQuestion[] {
  const pool = questionBank.filter((q) => q.since <= key);
  let order = orderCache.get(pool.length);
  if (!order) {
    order = seededShuffle(pool, ORDER_SEED);
    orderCache.set(pool.length, order);
  }
  return order;
}

/**
 * Each day takes the next slice of one fixed permutation of the questions
 * released by that day, walked circularly — no question comes back until the
 * whole pool has been used. The extra `+cycle` shift means the groupings
 * drift on each pass instead of repeating forever.
 */
export function buildDailyQuiz(key: string): BankQuestion[] {
  const order = poolOrder(key);
  const total = order.length;
  if (total === 0) return [];

  const count = Math.min(DAILY_QUESTION_COUNT, total);
  const raw = dayNumber(key) * count;
  const cycle = Math.floor(raw / total);
  const start = (((raw + cycle) % total) + total) % total;

  return Array.from({ length: count }, (_, i) => order[(start + i) % total]);
}


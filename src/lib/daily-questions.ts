import { questionBank, questionsInCategory, type BankQuestion } from "@/data/questions";
import { DAILY_QUESTION_COUNT, addDays, dayNumber, utcKey } from "./daily";

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

/** Stable 32-bit hash of a string (FNV-1a with a murmur3 finaliser). */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * Days before this were picked by the original formula and have already been
 * played, so they keep it forever. From this day on, the schedule below.
 */
export const SCHEDULE_START = "2026-11-16";

/** At most this many questions from one category in a day's set. */
export const MAX_PER_CATEGORY = 2;

/** How far back the original formula's days count as "recently used". */
const LEGACY_LOOKBACK_DAYS = 21;

/** Fixed seed: the original formula's running order of a pool. */
const ORDER_SEED = 20260101;

/**
 * Builds the daily schedule for a bank sorted by (since, id).
 *
 * From SCHEDULE_START each day takes the questions that have rested longest
 * (never-used first), at most MAX_PER_CATEGORY per category, with ties broken
 * by a per-day hash. A question only comes back once every other question in
 * the pool has had a turn — including right after a new batch is released.
 *
 * Every day depends only on the questions released by that day, so adding a
 * batch never changes an earlier day. Deleting a question, or changing its
 * `id`, `since` or `category`, would rewrite every day after its release.
 */
export function createDailySchedule(
  bank: readonly BankQuestion[]
): (key: string) => BankQuestion[] {
  /* --------------------------------------------- original formula (frozen) */
  // The bank is sorted by release batch, so the pool for any day is a prefix
  // of it and its length identifies it.
  const orderCache = new Map<number, BankQuestion[]>();

  function poolOrder(key: string): BankQuestion[] {
    const pool = bank.filter((q) => q.since <= key);
    let order = orderCache.get(pool.length);
    if (!order) {
      order = seededShuffle(pool, ORDER_SEED);
      orderCache.set(pool.length, order);
    }
    return order;
  }

  function legacyDay(key: string): BankQuestion[] {
    const order = poolOrder(key);
    const total = order.length;
    if (total === 0) return [];

    const count = Math.min(DAILY_QUESTION_COUNT, total);
    const raw = dayNumber(key) * count;
    const cycle = Math.floor(raw / total);
    const start = (((raw + cycle) % total) + total) % total;

    return Array.from({ length: count }, (_, i) => order[(start + i) % total]);
  }

  /* ---------------------------------------------- least-recently-used days */
  const scheduled: BankQuestion[][] = [];
  const lastUsed = new Map<string, number>();
  let seeded = false;

  function pick(key: string): BankQuestion[] {
    const day = dayNumber(key);
    const pool = bank.filter((q) => q.since <= key);
    const count = Math.min(DAILY_QUESTION_COUNT, pool.length);

    const ranked = pool
      .map((q) => ({
        q,
        last: lastUsed.get(q.id) ?? -Infinity,
        tie: hash(`${q.id}:${day}`),
      }))
      // -Infinity minus -Infinity is NaN, which falls through to the tie.
      .sort((a, b) => a.last - b.last || a.tie - b.tie);

    const picked: BankQuestion[] = [];
    const perCategory = new Map<string, number>();
    for (const { q } of ranked) {
      if (picked.length === count) break;
      const used = perCategory.get(q.category) ?? 0;
      if (used < MAX_PER_CATEGORY) {
        picked.push(q);
        perCategory.set(q.category, used + 1);
      }
    }
    // A pool with too few categories can't honour the cap — fill up anyway.
    for (const { q } of ranked) {
      if (picked.length === count) break;
      if (!picked.includes(q)) picked.push(q);
    }

    for (const q of picked) lastUsed.set(q.id, day);

    // Play order is shuffled per day rather than by how long each had rested.
    const order = new Map(picked.map((q) => [q.id, hash(`order:${q.id}:${day}`)]));
    return picked.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  }

  function scheduledDay(key: string): BankQuestion[] {
    if (!seeded) {
      seeded = true;
      for (
        let key = addDays(SCHEDULE_START, -LEGACY_LOOKBACK_DAYS);
        key < SCHEDULE_START;
        key = addDays(key, 1)
      ) {
        for (const q of legacyDay(key)) lastUsed.set(q.id, dayNumber(key));
      }
    }
    const index = dayNumber(key) - dayNumber(SCHEDULE_START);
    for (let i = scheduled.length; i <= index; i++) {
      scheduled.push(pick(addDays(SCHEDULE_START, i)));
    }
    return [...scheduled[index]];
  }

  return (key) => (key < SCHEDULE_START ? legacyDay(key) : scheduledDay(key));
}

const dailySchedule = createDailySchedule(questionBank);

/** The questions of the daily for a calendar date, in play order. */
export function buildDailyQuiz(key: string): BankQuestion[] {
  return dailySchedule(key);
}

/**
 * Questions in dailies whose answers aren't published yet: every day that is
 * "today" somewhere, plus one day of slack so a page cached for up to an hour
 * never shows a set that has just gone live.
 */
export function unrevealedDailyIds(now: Date = new Date()): Set<string> {
  const today = utcKey(now);
  const ids = new Set<string>();
  for (let offset = -1; offset <= 2; offset++) {
    for (const q of buildDailyQuiz(addDays(today, offset))) ids.add(q.id);
  }
  return ids;
}

/** A topic's questions for its public page, minus any still in a live daily. */
export function topicQuestions(
  category: string,
  now: Date = new Date()
): BankQuestion[] {
  const hidden = unrevealedDailyIds(now);
  return questionsInCategory(category).filter((q) => !hidden.has(q.id));
}

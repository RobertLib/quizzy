/**
 * Calendar helpers for the daily challenge. Client-safe: this file must not
 * import the question bank (see daily-questions.ts for that).
 *
 * A "key" is a calendar date, YYYY-MM-DD. Players get the daily for their
 * own local date, so at any moment up to three keys are "today" somewhere.
 */

export const DAILY_QUESTION_COUNT = 8;

/** First day listed in the public archive. */
export const ARCHIVE_START = "2026-11-01";

/** Day numbers are counted from this epoch day so they stay short (#770). */
const NUMBER_OFFSET = 20000;

const KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function pad(n: number): string {
  return `${n}`.padStart(2, "0");
}

/** Local-time key, used for the player's own "today". */
export function keyFrom(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function utcKey(date: Date = new Date()): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function todayKey(): string {
  return keyFrom(new Date());
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return keyFrom(d);
}

export function isDateKey(value: string): boolean {
  if (!KEY_PATTERN.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return utcKey(date) === value;
}

export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return utcKey(new Date(Date.UTC(y, m - 1, d + days)));
}

/** Whole days since the epoch for a calendar date. */
export function dayNumber(key: string = todayKey()): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** The public number of a daily, e.g. "Daily #770". */
export function dailyNumber(key: string = todayKey()): number {
  return dayNumber(key) - NUMBER_OFFSET;
}

/** "13 November 2026" — rendered in UTC so the server and client agree. */
export function formatDateKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The newest daily whose answers are safe to publish: two days back in UTC is
 * yesterday or earlier in every timezone (UTC−12 … UTC+14).
 */
export function latestRevealedKey(now: Date = new Date()): string {
  return addDays(utcKey(now), -2);
}

export function isRevealed(key: string, now: Date = new Date()): boolean {
  return key <= latestRevealedKey(now);
}

/** A day someone, somewhere, can already have reached — and not before the archive. */
export function isPlayableKey(key: string, now: Date = new Date()): boolean {
  return isDateKey(key) && key >= ARCHIVE_START && key <= addDays(utcKey(now), 1);
}

/** Days whose submissions still count towards live stats. */
export function isLiveKey(key: string, now: Date = new Date()): boolean {
  const today = utcKey(now);
  return isDateKey(key) && key >= addDays(today, -1) && key <= addDays(today, 1);
}

/** Archived days, newest first. */
export function archiveKeys(now: Date = new Date()): string[] {
  const keys: string[] = [];
  for (let key = latestRevealedKey(now); key >= ARCHIVE_START; key = addDays(key, -1)) {
    keys.push(key);
  }
  return keys;
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
  return `${h}h ${pad(m)}m ${pad(s)}s`;
}

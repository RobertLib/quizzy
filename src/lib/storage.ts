import type { GameMode, QuizAnswer } from "@/types/quiz";
import { xpFromPoints } from "./scoring";
import { addDays, keyFrom, todayKey, yesterdayKey } from "./daily";

const PROFILE_KEY = "quizzy:profile:v1";
const SETTINGS_KEY = "quizzy:settings:v1";
export const CONFIG_KEY = "quizzy:config:v1";

export interface CategoryStat {
  answered: number;
  correct: number;
}

export interface HistoryEntry {
  /** When the round finished (ISO timestamp, UTC). */
  date: string;
  mode: GameMode;
  points: number;
  correct: number;
  total: number;
  /** The daily's own date, for daily and archive rounds. */
  dailyKey?: string;
}

export interface Profile {
  xp: number;
  totalPoints: number;
  quizzesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  bestStreak: number;
  bestQuizPoints: number;
  perfectQuizzes: number;
  fastAnswers: number;
  hardCorrect: number;
  categories: Record<string, CategoryStat>;
  achievements: Record<string, string>;
  dailyStreak: number;
  dailyBestStreak: number;
  dailyLastPlayed: string | null;
  /** Days whose daily was started on the day — each counts once. */
  dailyCompleted: string[];
  history: HistoryEntry[];
}

export type ThemePreference = "system" | "light" | "dark";

export interface Settings {
  theme: ThemePreference;
  sound: boolean;
  haptics: boolean;
}

export const emptyProfile: Profile = {
  xp: 0,
  totalPoints: 0,
  quizzesPlayed: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  bestStreak: 0,
  bestQuizPoints: 0,
  perfectQuizzes: 0,
  fastAnswers: 0,
  hardCorrect: 0,
  categories: {},
  achievements: {},
  dailyStreak: 0,
  dailyBestStreak: 0,
  dailyLastPlayed: null,
  dailyCompleted: [],
  history: [],
};

export const defaultSettings: Settings = {
  theme: "system",
  sound: true,
  haptics: true,
};

/** Stored JSON over the defaults; anything that isn't an object is ignored. */
function parseOver<T extends object>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { ...fallback, ...parsed };
    }
  } catch {
    /* corrupt — start over */
  }
  return fallback;
}

/* -------------------------------------------------------------- profile store
 * The profile lives in localStorage and is shared by every open tab: reads go
 * through a cached snapshot (stable for useSyncExternalStore), writes notify
 * this tab's subscribers, and the `storage` event brings in other tabs'.
 * If storage is unavailable, progress is kept in memory for this visit.
 */
const profileListeners = new Set<() => void>();
let snapshotRaw: string | null = null;
let snapshot: Profile = emptyProfile;
let memoryOnly = false;

function notifyProfile() {
  for (const listener of profileListeners) listener();
}

export function loadProfile(): Profile {
  if (typeof window === "undefined" || memoryOnly) return snapshot;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(PROFILE_KEY);
  } catch {
    return snapshot;
  }
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = parseOver(raw, emptyProfile);
  }
  return snapshot;
}

export function saveProfile(profile: Profile) {
  const raw = JSON.stringify(profile);
  snapshot = profile;
  snapshotRaw = raw;
  try {
    window.localStorage.setItem(PROFILE_KEY, raw);
  } catch {
    // Full or blocked: keep playing from memory rather than losing progress.
    memoryOnly = true;
  }
  notifyProfile();
}

export function resetProfile() {
  snapshot = emptyProfile;
  snapshotRaw = null;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    /* blocked — the in-memory reset still applies */
  }
  notifyProfile();
}

export function subscribeProfile(listener: () => void): () => void {
  profileListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === PROFILE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    profileListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/* ------------------------------------------------------------------ settings */
export function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    return parseOver(window.localStorage.getItem(SETTINGS_KEY), defaultSettings);
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings) {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* storage full or blocked — settings just won't be remembered */
  }
}

/* ------------------------------------------------------------------- dailies */

/**
 * Starting today's daily uses it up: the streak counts from here, and a
 * reload or a quit can only replay it as practice.
 */
export function markDailyPlayed(profile: Profile, key: string): Profile {
  if (profile.dailyCompleted.includes(key)) return profile;
  const last = profile.dailyLastPlayed;
  if (last && last > key) return profile;

  const dailyStreak = last === addDays(key, -1) ? profile.dailyStreak + 1 : 1;
  return {
    ...profile,
    dailyStreak,
    dailyLastPlayed: key,
    dailyBestStreak: Math.max(profile.dailyBestStreak, dailyStreak),
    dailyCompleted: [key, ...profile.dailyCompleted].slice(0, 60),
  };
}

/** The player's first finished round of a given day's daily, if any. */
export function dailyResultFor(
  profile: Profile,
  key: string
): HistoryEntry | undefined {
  return profile.history.find(
    (entry) =>
      (entry.dailyKey ??
        // Entries saved before `dailyKey` existed: the local date they were
        // played on is the day of the daily.
        (entry.mode === "daily" ? keyFrom(new Date(entry.date)) : undefined)) === key
  );
}

/** True once a day's daily has been played — replays are practice. */
export function hasPlayedDaily(profile: Profile, key: string): boolean {
  return profile.dailyCompleted.includes(key) || dailyResultFor(profile, key) !== undefined;
}

/* ------------------------------------------------------------------ sessions */

export interface SessionSummary {
  answers: QuizAnswer[];
  points: number;
  bestStreak: number;
  mode: GameMode;
  dailyKey?: string;
}

/** Folds a finished session into the profile. Pure — returns a new object. */
export function applySession(profile: Profile, session: SessionSummary): Profile {
  const { answers, points, bestStreak, mode, dailyKey } = session;
  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const perfect = total > 0 && correct === total;

  const categories: Record<string, CategoryStat> = { ...profile.categories };
  for (const answer of answers) {
    const stat = categories[answer.category] ?? { answered: 0, correct: 0 };
    categories[answer.category] = {
      answered: stat.answered + 1,
      correct: stat.correct + (answer.isCorrect ? 1 : 0),
    };
  }

  const fastAnswers =
    profile.fastAnswers +
    answers.filter((a) => a.isCorrect && !a.skipped && a.timeSpent <= 3).length;
  const hardCorrect =
    profile.hardCorrect +
    answers.filter((a) => a.isCorrect && a.difficulty === "hard").length;

  const entry: HistoryEntry = {
    date: new Date().toISOString(),
    mode,
    points,
    correct,
    total,
    ...(dailyKey ? { dailyKey } : {}),
  };

  return {
    ...profile,
    xp: profile.xp + xpFromPoints(points),
    totalPoints: profile.totalPoints + points,
    quizzesPlayed: profile.quizzesPlayed + 1,
    questionsAnswered: profile.questionsAnswered + total,
    correctAnswers: profile.correctAnswers + correct,
    bestStreak: Math.max(profile.bestStreak, bestStreak),
    bestQuizPoints: Math.max(profile.bestQuizPoints, points),
    perfectQuizzes: profile.perfectQuizzes + (perfect ? 1 : 0),
    fastAnswers,
    hardCorrect,
    categories,
    history: [entry, ...profile.history].slice(0, 30),
  };
}

/** A daily streak lapses once the player misses a whole day. */
export function normalizeDailyStreak(profile: Profile): Profile {
  const { dailyLastPlayed, dailyStreak } = profile;
  if (!dailyLastPlayed || dailyStreak === 0) return profile;
  if (dailyLastPlayed === todayKey() || dailyLastPlayed === yesterdayKey()) {
    return profile;
  }
  return { ...profile, dailyStreak: 0 };
}

export function accuracyOf(profile: Profile): number {
  if (profile.questionsAnswered === 0) return 0;
  return profile.correctAnswers / profile.questionsAnswered;
}

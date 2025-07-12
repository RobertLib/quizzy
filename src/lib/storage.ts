import type { GameMode, QuizAnswer } from "@/types/quiz";
import { xpFromPoints } from "./scoring";
import { todayKey, yesterdayKey } from "./daily";

const PROFILE_KEY = "quizzy:profile:v1";
const SETTINGS_KEY = "quizzy:settings:v1";
export const CONFIG_KEY = "quizzy:config:v1";

export interface CategoryStat {
  answered: number;
  correct: number;
}

export interface HistoryEntry {
  date: string;
  mode: GameMode;
  points: number;
  correct: number;
  total: number;
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

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — stats are a nice-to-have, never fatal */
  }
}

export function loadProfile(): Profile {
  return readJson(PROFILE_KEY, emptyProfile);
}

export function saveProfile(profile: Profile) {
  writeJson(PROFILE_KEY, profile);
}

export function loadSettings(): Settings {
  return readJson(SETTINGS_KEY, defaultSettings);
}

export function saveSettings(settings: Settings) {
  writeJson(SETTINGS_KEY, settings);
}

export function resetProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
}

export interface SessionSummary {
  answers: QuizAnswer[];
  points: number;
  bestStreak: number;
  mode: GameMode;
}

/** Folds a finished session into the profile. Pure — returns a new object. */
export function applySession(profile: Profile, session: SessionSummary): Profile {
  const { answers, points, bestStreak, mode } = session;
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

  const next: Profile = {
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
    history: [
      { date: new Date().toISOString(), mode, points, correct, total },
      ...profile.history,
    ].slice(0, 30),
  };

  if (mode === "daily") {
    const today = todayKey();
    if (next.dailyLastPlayed !== today) {
      const continued = next.dailyLastPlayed === yesterdayKey();
      next.dailyStreak = continued ? next.dailyStreak + 1 : 1;
      next.dailyLastPlayed = today;
      next.dailyBestStreak = Math.max(next.dailyBestStreak, next.dailyStreak);
      next.dailyCompleted = [today, ...next.dailyCompleted].slice(0, 60);
    }
  }

  return next;
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

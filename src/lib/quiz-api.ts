import type { QuizApiResponse, QuizConfig, QuizQuestion } from "@/types/quiz";
import type { DailyStats } from "./daily-stats";

/**
 * Custom quizzes. The route handler always fills the round from our own bank
 * when Open Trivia DB can't help, so a failure here means the player is
 * offline.
 */
export async function fetchQuizQuestions(
  amount: number,
  config: QuizConfig
): Promise<QuizApiResponse> {
  const params = new URLSearchParams({ amount: amount.toString() });
  if (config.difficulty !== "mixed") params.append("difficulty", config.difficulty);
  if (config.categories.length > 0) {
    params.append("categories", config.categories.join(","));
  }

  const response = await fetch(`/api/quiz?${params.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return (await response.json()) as QuizApiResponse;
}

export async function fetchDailyQuiz(key: string): Promise<QuizQuestion[]> {
  const response = await fetch(`/api/daily/${key}`);
  if (!response.ok) throw new Error(`Daily returned ${response.status}`);
  const data = (await response.json()) as { questions: QuizQuestion[] };
  return data.questions;
}

type StatsResponse = ({ enabled: true } & DailyStats) | { enabled: false };

function statsOf(data: StatsResponse): DailyStats | null {
  return data.enabled ? data : null;
}

export async function fetchDailyStats(key: string): Promise<DailyStats | null> {
  try {
    const response = await fetch(`/api/daily-stats?date=${key}`);
    if (!response.ok) return null;
    return statsOf((await response.json()) as StatsResponse);
  } catch {
    return null;
  }
}

const SUBMITTED_KEY = "quizzy:submitted:v1";

/**
 * Sends today's anonymous result once per device, then returns everyone's
 * numbers. Later calls (a remount, a second tab) only read. A failed send is
 * not remembered, so the next call tries again.
 */
export async function submitDailyResult(
  key: string,
  grid: string
): Promise<DailyStats | null> {
  try {
    if (window.localStorage.getItem(SUBMITTED_KEY) === key) {
      return fetchDailyStats(key);
    }
  } catch {
    /* storage blocked — the server de-duplicates as well */
  }

  try {
    const response = await fetch("/api/daily-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: key, grid }),
    });
    if (!response.ok) return null;
    const stats = statsOf((await response.json()) as StatsResponse);
    try {
      window.localStorage.setItem(SUBMITTED_KEY, key);
    } catch {
      /* storage blocked — see above */
    }
    return stats;
  } catch {
    return null;
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

import type { Challenge, QuizAnswer, QuizSession } from "@/types/quiz";
import { DAILY_QUESTION_COUNT } from "./daily";
import { categoryByName } from "@/data/categories";
import { absoluteUrl } from "./site";

/** Best possible score for one question: (100 + 100 speed) × 1.5 hard × 3 streak. */
const MAX_POINTS = DAILY_QUESTION_COUNT * 900;

export function gridOf(answers: QuizAnswer[]): string {
  return answers.map((a) => (a.isCorrect ? "g" : a.skipped ? "y" : "r")).join("");
}

export function correctIn(grid: string): number {
  return [...grid].filter((c) => c === "g").length;
}

/** Parses the "ggyrgggr-1240" segment of a challenge link. */
export function parseChallenge(segment: string): Challenge | null {
  const match = /^([gyr]+)-(\d{1,5})$/.exec(segment);
  if (!match) return null;
  const [, grid, raw] = match;
  const points = Number(raw);
  if (grid.length !== DAILY_QUESTION_COUNT || points > MAX_POINTS) return null;
  return { grid, points };
}

export function challengePath(key: string, challenge: Challenge): string {
  return `/c/${key}/${challenge.grid}-${challenge.points}`;
}

export const GRID_EMOJI: Record<string, string> = { g: "🟩", y: "🟨", r: "🟥" };

/**
 * Where a shared result should send the friend who taps it: the same daily
 * (as a head-to-head challenge), or the topic page the quiz was about.
 */
export function shareUrlFor(session: QuizSession, answers: QuizAnswer[], points: number): string {
  if (session.dailyKey && answers.length === DAILY_QUESTION_COUNT) {
    return absoluteUrl(challengePath(session.dailyKey, { grid: gridOf(answers), points }));
  }
  if (session.config.categories.length === 1) {
    const category = categoryByName(session.config.categories[0]);
    if (category) return absoluteUrl(`/trivia/${category.slug}`);
  }
  return absoluteUrl("/");
}

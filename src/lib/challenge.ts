import type { Challenge, QuizAnswer, QuizSession } from "@/types/quiz";
import { DAILY_QUESTION_COUNT } from "./daily";
import { categoryByName } from "@/data/categories";
import { absoluteUrl } from "./site";
import {
  BASE_POINTS,
  DIFFICULTY_MULTIPLIER,
  MAX_SPEED_BONUS,
  streakMultiplier,
} from "./scoring";

/**
 * Most points `correct` right answers can bank: every one hard, instant and
 * in an unbroken streak (skips and misses never add to a streak).
 */
export function maxPointsFor(correct: number): number {
  let total = 0;
  for (let streak = 1; streak <= correct; streak++) {
    total += Math.round(
      (BASE_POINTS + MAX_SPEED_BONUS) *
        DIFFICULTY_MULTIPLIER.hard *
        streakMultiplier(streak)
    );
  }
  return total;
}

export function gridOf(answers: QuizAnswer[]): string {
  return answers.map((a) => (a.isCorrect ? "g" : a.skipped ? "y" : "r")).join("");
}

export function correctIn(grid: string): number {
  return [...grid].filter((c) => c === "g").length;
}

/**
 * Parses the "ggyrgggr-1240" segment of a challenge link. Scores the grid
 * couldn't have produced (points with no right answers, more than the maximum,
 * leading zeros) are rejected.
 */
export function parseChallenge(segment: string): Challenge | null {
  const match = /^([gyr]+)-(0|[1-9]\d{0,4})$/.exec(segment);
  if (!match) return null;
  const [, grid, raw] = match;
  if (grid.length !== DAILY_QUESTION_COUNT) return null;
  const points = Number(raw);
  const correct = correctIn(grid);
  // Each right answer is worth at least the base points.
  if (points < correct * BASE_POINTS || points > maxPointsFor(correct)) return null;
  return { grid, points };
}

export function challengePath(key: string, challenge: Challenge): string {
  return `/c/${key}/${challenge.grid}-${challenge.points}`;
}

export const GRID_EMOJI: Record<string, string> = { g: "🟩", y: "🟨", r: "🟥" };

/** Whether a finished round can be sent to a friend as a score to beat. */
export function isChallengeable(session: QuizSession, answers: QuizAnswer[]): boolean {
  // A practice replay was played knowing the answers, so its score proves nothing.
  return (
    !!session.dailyKey &&
    session.mode !== "practice" &&
    answers.length === DAILY_QUESTION_COUNT
  );
}

/**
 * Where a shared result should send the friend who taps it: the same daily
 * (as a head-to-head challenge, or just the day after a practice replay), or
 * the topic page the quiz was about.
 */
export function shareUrlFor(session: QuizSession, answers: QuizAnswer[], points: number): string {
  if (session.dailyKey) {
    return absoluteUrl(
      isChallengeable(session, answers)
        ? challengePath(session.dailyKey, { grid: gridOf(answers), points })
        : `/daily/${session.dailyKey}`
    );
  }
  if (session.config.categories.length === 1) {
    const category = categoryByName(session.config.categories[0]);
    if (category) return absoluteUrl(`/trivia/${category.slug}`);
  }
  return absoluteUrl("/");
}

import type { Difficulty } from "@/types/quiz";

export const BASE_POINTS = 100;
export const MAX_SPEED_BONUS = 100;
export const MAX_STREAK_MULTIPLIER = 3;

export const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.25,
  hard: 1.5,
};

/** Seconds allowed per question in timed mode. */
export const TIME_LIMIT: Record<Difficulty, number> = {
  easy: 15,
  medium: 20,
  hard: 25,
};

/** Every 3 correct answers in a row bumps the multiplier by 0.5, capped at 3x. */
export function streakMultiplier(streak: number): number {
  if (streak < 3) return 1;
  return Math.min(MAX_STREAK_MULTIPLIER, 1 + Math.floor(streak / 3) * 0.5);
}

interface ScoreInput {
  difficulty: Difficulty;
  /** Streak length *including* the answer being scored. */
  streak: number;
  timeLeft: number;
  timeLimit: number;
  timed: boolean;
}

export interface ScoreBreakdown {
  base: number;
  speedBonus: number;
  difficultyMultiplier: number;
  streakMultiplier: number;
  total: number;
}

export function scoreAnswer({
  difficulty,
  streak,
  timeLeft,
  timeLimit,
  timed,
}: ScoreInput): ScoreBreakdown {
  const speedBonus =
    timed && timeLimit > 0
      ? Math.round(MAX_SPEED_BONUS * Math.max(0, Math.min(1, timeLeft / timeLimit)))
      : 0;
  const difficultyMultiplier = DIFFICULTY_MULTIPLIER[difficulty];
  const streakMult = streakMultiplier(streak);
  const total = Math.round(
    (BASE_POINTS + speedBonus) * difficultyMultiplier * streakMult
  );

  return {
    base: BASE_POINTS,
    speedBonus,
    difficultyMultiplier,
    streakMultiplier: streakMult,
    total,
  };
}

/** XP is a tenth of the points earned, so levels advance across many sessions. */
export function xpFromPoints(points: number): number {
  return Math.round(points / 10);
}

/** Cumulative XP required to reach a given level. Level 1 starts at 0. */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(125 * (level - 1) * level);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp && level < 200) level++;
  return level;
}

export interface LevelProgress {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  percent: number;
}

export function levelProgress(xp: number): LevelProgress {
  const level = levelFromXp(xp);
  const floorXp = xpForLevel(level);
  const nextXp = xpForLevel(level + 1);
  const span = nextXp - floorXp;
  const into = xp - floorXp;
  return {
    level,
    xpIntoLevel: into,
    xpForNextLevel: span,
    percent: span > 0 ? Math.min(100, (into / span) * 100) : 100,
  };
}

export interface Grade {
  label: string;
  blurb: string;
  emoji: string;
  /** Tailwind text colour class. */
  tone: string;
}

export function gradeFor(accuracy: number, perfect: boolean): Grade {
  if (perfect)
    return {
      label: "Flawless",
      blurb: "Every single one. Untouchable.",
      emoji: "👑",
      tone: "text-gold",
    };
  if (accuracy >= 0.9)
    return {
      label: "Brilliant",
      blurb: "Almost perfect — one more run?",
      emoji: "🌟",
      tone: "text-gold",
    };
  if (accuracy >= 0.75)
    return {
      label: "Sharp",
      blurb: "Strong round. The hard ones are calling.",
      emoji: "🎯",
      tone: "text-brand",
    };
  if (accuracy >= 0.5)
    return {
      label: "Solid",
      blurb: "Halfway to mastery. Keep going.",
      emoji: "💪",
      tone: "text-brand",
    };
  if (accuracy >= 0.25)
    return {
      label: "Warming up",
      blurb: "Every miss is a fact you now own.",
      emoji: "🌱",
      tone: "text-muted",
    };
  return {
    label: "Rough round",
    blurb: "Shake it off — replay the misses.",
    emoji: "🎲",
    tone: "text-muted",
  };
}

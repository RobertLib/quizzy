export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  /** Present on questions from our own bank. */
  id?: string;
  type: "multiple" | "boolean";
  difficulty: Difficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  /** Shown after answering; only our own questions have one. */
  explanation?: string;
}

export interface QuizApiResponse {
  response_code: number;
  results: QuizQuestion[];
  isOffline?: boolean;
}

export interface QuizAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  category: string;
  difficulty: Difficulty;
  /** Seconds spent on the question. */
  timeSpent: number;
  /** Points earned for this question. */
  points: number;
  /** Streak length after this answer was submitted. */
  streak: number;
  /** True when the player ran out of time or used a skip. */
  skipped: boolean;
  explanation?: string;
}

export interface QuizConfig {
  categories: string[];
  difficulty: Difficulty | "mixed";
  amount: number;
  /** Timed mode adds a per-question countdown and a speed bonus. */
  timed: boolean;
}

/**
 * - custom: a quiz the player configured
 * - daily: today's daily challenge (counts towards the daily streak)
 * - archive: any other day's daily, played for practice
 */
export type GameMode = "custom" | "daily" | "archive";

/** A friend's daily result the player is trying to beat. */
export interface Challenge {
  /** One letter per question: g = correct, y = skipped, r = wrong. */
  grid: string;
  points: number;
}

export interface QuizSession {
  questions: QuizQuestion[];
  config: QuizConfig;
  mode: GameMode;
  isOffline: boolean;
  /** The daily's date for daily and archive sessions. */
  dailyKey?: string;
  challenge?: Challenge;
}

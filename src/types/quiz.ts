export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  type: "multiple" | "boolean";
  difficulty: Difficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
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
}

export interface QuizConfig {
  categories: string[];
  difficulty: Difficulty | "mixed";
  amount: number;
  /** Timed mode adds a per-question countdown and a speed bonus. */
  timed: boolean;
}

export type GameMode = "custom" | "daily";

export interface QuizSession {
  questions: QuizQuestion[];
  config: QuizConfig;
  mode: GameMode;
  isOffline: boolean;
}

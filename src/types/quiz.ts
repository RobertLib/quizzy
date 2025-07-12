export interface QuizQuestion {
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
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
}

export interface QuizConfig {
  categories: string[];
  difficulty: "easy" | "medium" | "hard" | "mixed";
  amount: number;
}

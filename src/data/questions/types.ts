import type { QuizQuestion } from "@/types/quiz";

/** A question from our own bank — stable id, explanation, and release date. */
export interface BankQuestion extends QuizQuestion {
  id: string;
  /**
   * Local date (YYYY-MM-DD) from which the daily challenge may draw this
   * question. Past dailies only ever see questions released before them, so
   * growing the bank never rewrites an archived day.
   */
  since: string;
  explanation?: string;
}

/**
 * One bank question in another language. The English question stays the
 * source of truth for id, category, difficulty and release date; only the
 * text is replaced.
 *
 * - Multiple choice: `correct_answer` and `incorrect_answers` are required,
 *   with the wrong answers in the same order as in English.
 * - True/false: leave both out — the answers stay "True"/"False" and are
 *   labelled in the player's language by the UI.
 */
export interface QuestionTranslation {
  question: string;
  correct_answer?: string;
  incorrect_answers?: string[];
  explanation?: string;
}

/** Translations of one category's questions, keyed by question id. */
export type QuestionTranslations = Record<string, QuestionTranslation>;

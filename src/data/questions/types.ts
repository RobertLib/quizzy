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

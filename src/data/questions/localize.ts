import type { Locale } from "@/i18n/config";
import type { BankQuestion, QuestionTranslations } from "./types";
import { cs } from "./cs";

/**
 * Bank questions in the player's language. Ids, categories, difficulties and
 * release dates never change between languages, so the daily schedule, the
 * shared stats and challenge links are the same everywhere — only the text
 * differs. A question without a translation falls back to English (the test
 * suite makes sure there are none).
 */
const TRANSLATIONS: Partial<Record<Locale, QuestionTranslations>> = { cs };

export function localizeQuestion<Q extends BankQuestion>(question: Q, locale: Locale): Q {
  const t = TRANSLATIONS[locale]?.[question.id];
  if (!t) return question;
  const answers =
    question.type === "multiple" &&
    t.correct_answer !== undefined &&
    t.incorrect_answers?.length === question.incorrect_answers.length
      ? { correct_answer: t.correct_answer, incorrect_answers: t.incorrect_answers }
      : {};
  return {
    ...question,
    question: t.question,
    ...answers,
    ...(question.explanation !== undefined && t.explanation !== undefined
      ? { explanation: t.explanation }
      : {}),
  };
}

export function localizeQuestions<Q extends BankQuestion>(questions: Q[], locale: Locale): Q[] {
  return locale === "en" ? questions : questions.map((q) => localizeQuestion(q, locale));
}

export function translationsFor(locale: Locale): QuestionTranslations | undefined {
  return TRANSLATIONS[locale];
}

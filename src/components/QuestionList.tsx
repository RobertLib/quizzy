import type { QuizQuestion } from "@/types/quiz";
import { categoryLabel } from "@/data/categories";
import type { Locale } from "@/i18n/config";
import { PAGES } from "@/i18n/pages";
import { UI, answerLabel } from "@/i18n/ui";

const DIFFICULTY_STYLE = {
  easy: "bg-ok-soft text-ok-text",
  medium: "bg-warn-soft text-warn-text",
  hard: "bg-bad-soft text-bad-text",
} as const;

/** Stable per-question option order, so the answer isn't always listed first. */
function optionsFor(question: QuizQuestion): string[] {
  if (question.type === "boolean") return ["True", "False"];
  const all = [question.correct_answer, ...question.incorrect_answers];
  let hash = 0;
  for (const ch of question.id ?? question.question) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  const shift = hash % all.length;
  return [...all.slice(shift), ...all.slice(0, shift)];
}

/**
 * Questions with their answers. Answers sit in <details> so readers can test
 * themselves, while the text stays in the HTML for search engines.
 */
export default function QuestionList({
  locale,
  questions,
  showCategory = false,
  start = 1,
  headingLevel = 3,
}: {
  locale: Locale;
  questions: QuizQuestion[];
  showCategory?: boolean;
  start?: number;
  /** Level of each question's heading: one below the list's own heading. */
  headingLevel?: 3 | 4;
}) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  const t = PAGES[locale].questionList;
  const ui = UI[locale];
  return (
    <ol className="space-y-2.5" start={start}>
      {questions.map((question, index) => (
        <li key={question.id ?? question.question} className="card p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold">
            <span className="tnum text-subtle">#{start + index}</span>
            {showCategory && (
              <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-brand">
                {categoryLabel(question.category, locale)}
              </span>
            )}
            <span
              className={`rounded-md px-1.5 py-0.5 ${DIFFICULTY_STYLE[question.difficulty]}`}
            >
              {ui.difficulty[question.difficulty]}
            </span>
          </div>
          <Heading className="text-[0.95rem] font-semibold leading-snug text-ink">
            {question.question}
          </Heading>
          <ul className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted">
            {optionsFor(question).map((option, i) => (
              <li key={option} className="rounded-lg border border-line bg-surface-2 px-2 py-1">
                <span className="font-bold text-subtle">{String.fromCharCode(65 + i)}</span>{" "}
                {answerLabel(option, question.type, ui)}
              </li>
            ))}
          </ul>
          <details className="mt-3">
            <summary className="w-fit cursor-pointer list-none text-xs font-bold text-brand hover:underline">
              {t.showAnswer}
            </summary>
            <p className="mt-2 text-sm text-ink">
              {t.answer}{" "}
              <strong className="text-ok-text">
                {answerLabel(question.correct_answer, question.type, ui)}
              </strong>
            </p>
            {question.explanation && (
              <p className="mt-1 text-sm leading-relaxed text-muted">{question.explanation}</p>
            )}
          </details>
        </li>
      ))}
    </ol>
  );
}

import type { QuizQuestion } from "@/types/quiz";

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
  questions,
  showCategory = false,
  start = 1,
  headingLevel = 3,
}: {
  questions: QuizQuestion[];
  showCategory?: boolean;
  start?: number;
  /** Level of each question's heading: one below the list's own heading. */
  headingLevel?: 3 | 4;
}) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  return (
    <ol className="space-y-2.5" start={start}>
      {questions.map((question, index) => (
        <li key={question.id ?? question.question} className="card p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold">
            <span className="tnum text-subtle">#{start + index}</span>
            {showCategory && (
              <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-brand">
                {question.category}
              </span>
            )}
            <span
              className={`rounded-md px-1.5 py-0.5 capitalize ${DIFFICULTY_STYLE[question.difficulty]}`}
            >
              {question.difficulty}
            </span>
          </div>
          <Heading className="text-[0.95rem] font-semibold leading-snug text-ink">
            {question.question}
          </Heading>
          <ul className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted">
            {optionsFor(question).map((option, i) => (
              <li key={option} className="rounded-lg border border-line bg-surface-2 px-2 py-1">
                <span className="font-bold text-subtle">{String.fromCharCode(65 + i)}</span>{" "}
                {option}
              </li>
            ))}
          </ul>
          <details className="mt-3">
            <summary className="w-fit cursor-pointer list-none text-xs font-bold text-brand hover:underline">
              Show answer
            </summary>
            <p className="mt-2 text-sm text-ink">
              Answer: <strong className="text-ok-text">{question.correct_answer}</strong>
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

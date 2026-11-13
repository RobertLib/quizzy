import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuestionList from "@/components/QuestionList";
import ArchiveStats from "@/components/ArchiveStats";
import { DailyDayPlay } from "@/components/PlayButtons";
import {
  ARCHIVE_START,
  DAILY_QUESTION_COUNT,
  addDays,
  archiveKeys,
  dailyNumber,
  formatDateKey,
  isPlayableKey,
  isRevealed,
} from "@/lib/daily";
import { buildDailyQuiz } from "@/lib/daily-questions";
import { pageMetadata } from "@/lib/site";

// A day flips from "live" to "answers published" without a deploy.
export const revalidate = 3600;

export function generateStaticParams() {
  return archiveKeys().map((date) => ({ date }));
}

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  if (!isPlayableKey(date)) return {};
  const number = dailyNumber(date);
  const day = formatDateKey(date);
  return isRevealed(date)
    ? pageMetadata({
        title: `Daily Trivia #${number} (${day}) — Questions & Answers`,
        description: `The ${DAILY_QUESTION_COUNT} questions from Quizzy's daily trivia challenge on ${day}, with answers and explanations. Play the set yourself or check how you'd have done.`,
        path: `/daily/${date}`,
      })
    : pageMetadata({
        title: `Daily Trivia #${number} — ${day}`,
        description: `Quizzy's daily trivia challenge for ${day}: ${DAILY_QUESTION_COUNT} questions, the same for everyone.`,
        path: `/daily/${date}`,
        // Thin until the answers go up; it's listed in the sitemap after that.
        noindex: true,
      });
}

export default async function DailyDayPage({ params }: Props) {
  const { date } = await params;
  if (!isPlayableKey(date)) notFound();

  const revealed = isRevealed(date);
  const number = dailyNumber(date);
  const day = formatDateKey(date);
  const previous = addDays(date, -1);
  const next = addDays(date, 1);

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[
          { name: "Daily challenge", path: "/daily" },
          { name: `#${number}`, path: `/daily/${date}` },
        ]}
      />

      <header className="card mb-6 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">{day}</p>
        <h1 className="mt-1 text-balance text-3xl font-extrabold tracking-tight text-ink">
          Daily trivia #{number}
        </h1>
        <p className="mb-5 mt-2 text-sm leading-relaxed text-muted sm:text-base">
          {revealed
            ? `The ${DAILY_QUESTION_COUNT} questions everyone played on ${day}. Play them yourself first — the answers are below.`
            : `${DAILY_QUESTION_COUNT} questions, the same for everyone. The answers go up here once the day is over everywhere.`}
        </p>
        <DailyDayPlay dateKey={date} />
      </header>

      {revealed ? (
        <section aria-labelledby="answers-heading">
          <h2 id="answers-heading" className="mb-3 px-1 text-xl font-extrabold text-ink">
            Questions and answers
          </h2>
          <ArchiveStats dateKey={date} />
          <QuestionList questions={buildDailyQuiz(date)} showCategory />
        </section>
      ) : (
        <p className="card p-5 text-sm text-muted">
          🔒 Answers for this day are published on {formatDateKey(addDays(date, 2))}.
        </p>
      )}

      <nav aria-label="Other days" className="mt-6 flex items-center justify-between gap-3 text-sm font-semibold">
        {previous >= ARCHIVE_START ? (
          <Link href={`/daily/${previous}`} className="text-brand hover:underline">
            ← #{dailyNumber(previous)}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/daily#archive" className="text-muted hover:text-ink">
          All dailies
        </Link>
        {isRevealed(next) ? (
          <Link href={`/daily/${next}`} className="text-brand hover:underline">
            #{dailyNumber(next)} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

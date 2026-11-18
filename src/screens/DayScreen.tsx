import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuestionList from "@/components/QuestionList";
import ArchiveStats from "@/components/ArchiveStats";
import { DailyDayPlay } from "@/components/PlayButtons";
import { localizeQuestions } from "@/data/questions/localize";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
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
import { pageMetadata } from "@/lib/metadata";

export function dayStaticParams() {
  return archiveKeys().map((date) => ({ date }));
}

export function dayMetadata(locale: Locale, date: string): Metadata {
  if (!isPlayableKey(date)) return {};
  const { meta } = PAGES[locale];
  const number = dailyNumber(date);
  const day = formatDateKey(date, locale);
  const route = { page: "day", date } as const;
  return isRevealed(date)
    ? pageMetadata({
        locale,
        route,
        title: meta.dayTitleRevealed(number, day),
        description: meta.dayDescriptionRevealed(DAILY_QUESTION_COUNT, day),
      })
    : pageMetadata({
        locale,
        route,
        title: meta.dayTitle(number, day),
        description: meta.dayDescription(DAILY_QUESTION_COUNT, day),
        // Thin until the answers go up; it's listed in the sitemap after that.
        noindex: true,
      });
}

export default function DayScreen({ locale, date }: { locale: Locale; date: string }) {
  if (!isPlayableKey(date)) notFound();

  const { daily, day: t } = PAGES[locale];
  const revealed = isRevealed(date);
  const number = dailyNumber(date);
  const day = formatDateKey(date, locale);
  const previous = addDays(date, -1);
  const next = addDays(date, 1);

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: daily.crumb, route: { page: "daily" } },
          { name: `#${number}`, route: { page: "day", date } },
        ]}
      />

      <header className="card mb-6 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">{day}</p>
        <h1 className="mt-1 text-balance text-3xl font-extrabold tracking-tight text-ink">
          {t.title(number)}
        </h1>
        <p className="mb-5 mt-2 text-sm leading-relaxed text-muted sm:text-base">
          {revealed ? t.leadRevealed(DAILY_QUESTION_COUNT, day) : t.lead(DAILY_QUESTION_COUNT)}
        </p>
        <DailyDayPlay dateKey={date} />
      </header>

      {revealed ? (
        <section aria-labelledby="answers-heading">
          <h2 id="answers-heading" className="mb-3 px-1 text-xl font-extrabold text-ink">
            {t.answersHeading}
          </h2>
          <ArchiveStats dateKey={date} />
          <QuestionList
            locale={locale}
            questions={localizeQuestions(buildDailyQuiz(date), locale)}
            showCategory
          />
        </section>
      ) : (
        <p className="card p-5 text-sm text-muted">
          {t.locked(formatDateKey(addDays(date, 2), locale))}
        </p>
      )}

      <nav aria-label={t.otherDays} className="mt-6 flex items-center justify-between gap-3 text-sm font-semibold">
        {previous >= ARCHIVE_START ? (
          <Link href={pathFor({ page: "day", date: previous }, locale)} className="text-brand hover:underline">
            ← #{dailyNumber(previous)}
          </Link>
        ) : (
          <span />
        )}
        <Link href={`${pathFor({ page: "daily" }, locale)}#archive`} className="text-muted hover:text-ink">
          {t.allDailies}
        </Link>
        {isRevealed(next) ? (
          <Link href={pathFor({ page: "day", date: next }, locale)} className="text-brand hover:underline">
            #{dailyNumber(next)} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

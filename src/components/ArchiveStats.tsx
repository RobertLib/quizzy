"use client";

import { useEffect, useState } from "react";
import { fetchDailyStats } from "@/lib/quiz-api";
import {
  MIN_PLAYS_FOR_STATS,
  averageCorrect,
  percentRight,
  type DailyStats,
} from "@/lib/daily-stats";
import { DAILY_QUESTION_COUNT } from "@/lib/daily";
import { useLocale, useUi } from "./LocaleProvider";
import { INTL_LOCALE } from "@/i18n/config";

/** How everyone did on the day — shown only once enough people played. */
export default function ArchiveStats({ dateKey }: { dateKey: string }) {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const locale = useLocale();
  const t = useUi().archiveStats;

  useEffect(() => {
    let cancelled = false;
    void fetchDailyStats(dateKey).then((result) => {
      if (!cancelled) setStats(result);
    });
    return () => {
      cancelled = true;
    };
  }, [dateKey]);

  if (!stats || stats.plays < MIN_PLAYS_FOR_STATS) return null;

  const percents = Array.from({ length: DAILY_QUESTION_COUNT }, (_, i) =>
    percentRight(stats, i)
  );
  const hardest = percents.indexOf(Math.min(...percents));

  return (
    <p className="animate-rise mb-4 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted">
      {t.before(stats.plays)}
      <strong className="text-ink">
        {averageCorrect(stats).toLocaleString(INTL_LOCALE[locale], {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
        /{DAILY_QUESTION_COUNT}
      </strong>
      {t.after(hardest + 1, percents[hardest])}
    </p>
  );
}

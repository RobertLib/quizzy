"use client";

import type { Challenge, Difficulty } from "@/types/quiz";
import { DAILY_QUESTION_COUNT, todayKey } from "@/lib/daily";
import { correctIn } from "@/lib/challenge";
import { dailyResultFor, hasPlayedDaily } from "@/lib/storage";
import { useSettings } from "./SettingsProvider";
import { useQuizHost } from "./QuizHost";
import { useLocale, useUi } from "./LocaleProvider";
import { categoryLabel } from "@/data/categories";

const primary =
  "sheen rounded-2xl bg-linear-to-r from-brand to-brand-strong px-6 py-3.5 text-sm font-extrabold text-brand-contrast shadow-lift transition hover:brightness-110 active:scale-[0.98] disabled:opacity-70";
const secondary =
  "rounded-2xl border border-line bg-surface px-5 py-3 text-sm font-bold text-ink transition hover:border-brand/40 hover:bg-brand-soft active:scale-[0.98] disabled:opacity-60";

const ROUNDS = [
  { key: "easyRound", difficulty: "easy" },
  { key: "hardRound", difficulty: "hard" },
] as const;

/** Starts a 10-question timed round in one category. */
export function CategoryPlayButtons({ category }: { category: string }) {
  const { fx } = useSettings();
  const { startCustom, isLoading } = useQuizHost();
  const locale = useLocale();
  const ui = useUi();

  const play = (difficulty: Difficulty | "mixed") => {
    fx("click");
    void startCustom(
      { categories: [category], difficulty, amount: 10, timed: true },
      "topic"
    );
  };

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <button disabled={isLoading} onClick={() => play("mixed")} className={`${primary} sm:flex-1`}>
        {isLoading ? ui.common.dealing : ui.play.categoryRound(categoryLabel(category, locale))}
      </button>
      {ROUNDS.map((round) => (
        <button
          key={round.difficulty}
          disabled={isLoading}
          onClick={() => play(round.difficulty)}
          className={secondary}
        >
          {ui.play[round.key]}
        </button>
      ))}
    </div>
  );
}

/**
 * Play button for one day's daily. What it offers depends on the player's own
 * date, so it renders a neutral button until hydration.
 */
export function DailyDayPlay({ dateKey }: { dateKey: string }) {
  const { fx } = useSettings();
  const { profile, ready, isLoading, startDaily } = useQuizHost();
  const t = useUi().play;
  const loading = useUi().common.loading;

  const today = ready ? todayKey() : null;
  const play = () => {
    fx("click");
    void startDaily(dateKey);
  };

  if (today && dateKey > today) {
    return (
      <p className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted">
        {t.notStartedYet}
      </p>
    );
  }

  const isToday = dateKey === today;
  const played = hasPlayedDaily(profile, dateKey);
  const result = dailyResultFor(profile, dateKey);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button disabled={isLoading} onClick={play} className={primary}>
        {isLoading ? loading : played ? t.replay : isToday ? t.playToday : t.playDay}
      </button>
      <p className="text-xs text-muted">
        {result
          ? t.yourScore(result.correct, result.total, isToday)
          : played
            ? t.alreadyStarted
            : isToday
              ? t.countsToStreak(DAILY_QUESTION_COUNT)
              : t.earnsXp(DAILY_QUESTION_COUNT)}
      </p>
    </div>
  );
}

/** Accepts a friend's challenge — or settles it if today's daily is already done. */
export function ChallengePlay({
  dateKey,
  challenge,
}: {
  dateKey: string;
  challenge: Challenge;
}) {
  const { fx } = useSettings();
  const { profile, ready, isLoading, startDaily } = useQuizHost();
  const t = useUi().play;
  const loading = useUi().common.loading;

  const theirs = correctIn(challenge.grid);
  const today = ready ? todayKey() : null;
  const mine = ready ? dailyResultFor(profile, dateKey) : undefined;
  const played = ready && hasPlayedDaily(profile, dateKey);

  const play = () => {
    fx("click");
    void startDaily(dateKey, challenge);
  };

  if (today && dateKey > today) {
    return (
      <p className="text-sm text-muted">{t.friendAhead}</p>
    );
  }

  if (mine) {
    const won =
      mine.correct > theirs || (mine.correct === theirs && mine.points > challenge.points);
    const tied = mine.correct === theirs && mine.points === challenge.points;
    return (
      <div className="space-y-3">
        <p className="text-base font-bold text-ink">
          {t.alreadyPlayed(mine.correct, mine.total, mine.points)}
          {tied ? t.deadHeat : won ? t.youWin : t.theyWin}
        </p>
        <button disabled={isLoading} onClick={play} className={secondary}>
          {t.replay}
        </button>
      </div>
    );
  }

  return (
    <button disabled={isLoading} onClick={play} className={`${primary} w-full sm:w-auto`}>
      {isLoading ? loading : played ? t.practice : t.accept}
    </button>
  );
}

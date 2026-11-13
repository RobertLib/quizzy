"use client";

import type { Challenge, Difficulty } from "@/types/quiz";
import { DAILY_QUESTION_COUNT, todayKey } from "@/lib/daily";
import { correctIn } from "@/lib/challenge";
import { useSettings } from "./SettingsProvider";
import { useQuizHost } from "./QuizHost";

const primary =
  "sheen rounded-2xl bg-linear-to-r from-brand to-brand-strong px-6 py-3.5 text-sm font-extrabold text-brand-contrast shadow-lift transition hover:brightness-110 active:scale-[0.98] disabled:opacity-70";
const secondary =
  "rounded-2xl border border-line bg-surface px-5 py-3 text-sm font-bold text-ink transition hover:border-brand/40 hover:bg-brand-soft active:scale-[0.98] disabled:opacity-60";

const ROUNDS: { label: string; difficulty: Difficulty | "mixed" }[] = [
  { label: "Easy round", difficulty: "easy" },
  { label: "Hard round", difficulty: "hard" },
];

/** Starts a 10-question timed round in one category. */
export function CategoryPlayButtons({ category }: { category: string }) {
  const { fx } = useSettings();
  const { startCustom, isLoading } = useQuizHost();

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
        {isLoading ? "Dealing questions…" : `Play 10 ${category} questions →`}
      </button>
      {ROUNDS.map((round) => (
        <button
          key={round.difficulty}
          disabled={isLoading}
          onClick={() => play(round.difficulty)}
          className={secondary}
        >
          {round.label}
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

  const today = ready ? todayKey() : null;
  const play = () => {
    fx("click");
    void startDaily(dateKey);
  };

  if (today && dateKey > today) {
    return (
      <p className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted">
        ⏳ This daily hasn&apos;t started in your timezone yet — come back
        tomorrow.
      </p>
    );
  }

  const isToday = dateKey === today;
  const played = profile.dailyCompleted.includes(dateKey);
  const todaysResult = isToday
    ? profile.history.find((h) => h.mode === "daily" && h.date.slice(0, 10) === dateKey)
    : undefined;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button disabled={isLoading} onClick={play} className={primary}>
        {isLoading
          ? "Loading…"
          : isToday && !played
            ? "Play today's daily →"
            : played
              ? "Replay for practice ↻"
              : "Play this day →"}
      </button>
      <p className="text-xs text-muted">
        {isToday && !played
          ? `${DAILY_QUESTION_COUNT} questions · counts towards your daily streak`
          : todaysResult
            ? `You scored ${todaysResult.correct}/${todaysResult.total} today.`
            : played
              ? "You played this one on the day."
              : `${DAILY_QUESTION_COUNT} questions · practice round, earns XP`}
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

  const theirs = correctIn(challenge.grid);
  const today = ready ? todayKey() : null;
  const mine =
    dateKey === today
      ? profile.history.find((h) => h.mode === "daily" && h.date.slice(0, 10) === dateKey)
      : undefined;

  const play = () => {
    fx("click");
    void startDaily(dateKey, challenge);
  };

  if (today && dateKey > today) {
    return (
      <p className="text-sm text-muted">
        ⏳ Your friend is a day ahead of you — this daily unlocks at midnight
        your time.
      </p>
    );
  }

  if (mine) {
    const won =
      mine.correct > theirs || (mine.correct === theirs && mine.points > challenge.points);
    const tied = mine.correct === theirs && mine.points === challenge.points;
    return (
      <div className="space-y-3">
        <p className="text-base font-bold text-ink">
          You already played today: {mine.correct}/{mine.total} ·{" "}
          {mine.points.toLocaleString()} pts —{" "}
          {tied ? "a dead heat 🤝" : won ? "you win 🏆" : "they win 😤"}
        </p>
        <button disabled={isLoading} onClick={play} className={secondary}>
          Replay for practice ↻
        </button>
      </div>
    );
  }

  return (
    <button disabled={isLoading} onClick={play} className={`${primary} w-full sm:w-auto`}>
      {isLoading ? "Loading…" : "Accept the challenge →"}
    </button>
  );
}

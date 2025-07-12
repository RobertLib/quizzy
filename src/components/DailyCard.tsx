"use client";

import { useEffect, useState } from "react";
import {
  DAILY_QUESTION_COUNT,
  dayNumber,
  formatCountdown,
  msUntilTomorrow,
  todayKey,
} from "@/lib/daily";
import type { Profile } from "@/lib/storage";
import { useSettings } from "./SettingsProvider";

interface DailyCardProps {
  profile: Profile;
  ready: boolean;
  onPlay: () => void;
}

export default function DailyCard({ profile, ready, onPlay }: DailyCardProps) {
  const { fx } = useSettings();
  const [, tick] = useState(0);

  const done = ready && profile.dailyLastPlayed === todayKey();

  // Re-render once a second so the "next daily" countdown stays live.
  useEffect(() => {
    if (!done) return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [done]);

  const remaining = done ? msUntilTomorrow() : null;

  const todaysResult = profile.history.find(
    (entry) => entry.mode === "daily" && entry.date.slice(0, 10) === todayKey()
  );

  // A compact 7-day strip so the streak is something you can see slipping.
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
      2,
      "0"
    )}-${`${date.getDate()}`.padStart(2, "0")}`;
    return {
      key,
      label: date.toLocaleDateString(undefined, { weekday: "narrow" }),
      played: profile.dailyCompleted.includes(key),
      isToday: i === 6,
    };
  });

  return (
    <div className="card relative mb-3 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(20rem 12rem at 85% 0%, var(--streak), transparent 70%), radial-gradient(18rem 12rem at 0% 100%, var(--brand), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <h2 className="text-base font-extrabold text-ink">
              Daily Challenge
            </h2>
            <span className="tnum rounded-lg bg-surface-3 px-1.5 py-0.5 text-[0.65rem] font-bold text-subtle">
              #{dayNumber() - 20000}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {done
              ? todaysResult
                ? `Done — ${todaysResult.correct}/${todaysResult.total} for ${todaysResult.points.toLocaleString()} points.`
                : "Done for today. Nicely held."
              : `${DAILY_QUESTION_COUNT} questions, the same for everyone, once a day.`}
          </p>

          {ready && (
            <div className="mt-3 flex items-center gap-1.5">
              {last7.map((day) => (
                <div
                  key={day.key}
                  title={day.key}
                  className={`grid size-6 place-items-center rounded-lg text-[0.6rem] font-bold transition ${
                    day.played
                      ? "bg-streak text-white"
                      : day.isToday
                      ? "bg-surface-3 text-subtle ring-2 ring-brand/40"
                      : "bg-surface-3 text-subtle"
                  }`}
                >
                  {day.played ? "✓" : day.label}
                </div>
              ))}
              {profile.dailyStreak > 0 && (
                <span className="ml-1 text-xs font-bold text-streak">
                  {profile.dailyStreak}-day streak
                </span>
              )}
            </div>
          )}
        </div>

        {done ? (
          <div className="shrink-0 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-center">
            <div className="text-[0.65rem] font-bold uppercase tracking-wider text-subtle">
              Next in
            </div>
            <div className="tnum text-sm font-bold text-ink">
              {remaining === null ? "—" : formatCountdown(remaining)}
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              fx("click");
              onPlay();
            }}
            className="sheen shrink-0 rounded-2xl bg-linear-to-r from-brand to-brand-strong px-6 py-3.5 text-sm font-extrabold text-brand-contrast shadow-lift transition hover:brightness-110 active:scale-[0.98]"
          >
            Play today&apos;s →
          </button>
        )}
      </div>
    </div>
  );
}

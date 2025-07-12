"use client";

import { useMemo, useState } from "react";
import { ACHIEVEMENTS, TIER_STYLES } from "@/lib/achievements";
import { accuracyOf, type Profile } from "@/lib/storage";
import { levelProgress } from "@/lib/scoring";
import { CATEGORIES } from "./QuizConfig";
import { useSettings } from "./SettingsProvider";

const CATEGORY_EMOJI = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.emoji])
);

export default function StatsPanel({
  profile,
  ready,
}: {
  profile: Profile;
  ready: boolean;
}) {
  const { fx } = useSettings();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"stats" | "badges">("stats");

  const unlockedCount = Object.keys(profile.achievements).length;
  const progress = levelProgress(profile.xp);
  const accuracy = accuracyOf(profile);

  const categoryRows = useMemo(
    () =>
      Object.entries(profile.categories)
        .filter(([, stat]) => stat.answered > 0)
        .map(([name, stat]) => ({
          name,
          ...stat,
          accuracy: stat.correct / stat.answered,
        }))
        .sort((a, b) => b.accuracy - a.accuracy || b.answered - a.answered),
    [profile.categories]
  );

  if (!ready) return null;

  const fresh = profile.quizzesPlayed === 0;

  return (
    <div className="card mt-3 overflow-hidden">
      <button
        onClick={() => {
          fx("click");
          setOpen((v) => !v);
        }}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-surface-2"
        aria-expanded={open}
      >
        <span className="text-lg">📊</span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-ink">Your progress</div>
          <div className="truncate text-xs text-subtle">
            {fresh
              ? "Play a quiz to start tracking stats and badges"
              : `Level ${progress.level} · ${profile.quizzesPlayed} quizzes · ${Math.round(
                  accuracy * 100
                )}% accuracy · ${unlockedCount}/${ACHIEVEMENTS.length} badges`}
          </div>
        </div>
        <span
          className={`shrink-0 text-subtle transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="animate-rise border-t border-line p-5">
          <div className="mb-5 inline-flex rounded-xl bg-surface-2 p-1">
            {(["stats", "badges"] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  fx("select");
                  setTab(option);
                }}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold capitalize transition ${
                  tab === option
                    ? "bg-surface text-brand shadow-card"
                    : "text-muted hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {tab === "stats" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                <Metric
                  label="Level"
                  value={`${progress.level}`}
                  sub={`${progress.xpIntoLevel}/${progress.xpForNextLevel} XP`}
                />
                <Metric
                  label="Quizzes"
                  value={profile.quizzesPlayed.toLocaleString()}
                />
                <Metric
                  label="Accuracy"
                  value={`${Math.round(accuracy * 100)}%`}
                  sub={`${profile.correctAnswers}/${profile.questionsAnswered}`}
                />
                <Metric
                  label="Best streak"
                  value={`${profile.bestStreak}`}
                  sub="in a row"
                />
                <Metric
                  label="Total points"
                  value={profile.totalPoints.toLocaleString()}
                />
                <Metric
                  label="Perfect runs"
                  value={`${profile.perfectQuizzes}`}
                />
              </div>

              {categoryRows.length > 0 && (
                <section>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-subtle">
                    Category mastery
                  </h4>
                  <div className="space-y-2.5">
                    {categoryRows.map((row) => (
                      <div key={row.name}>
                        <div className="mb-1 flex items-baseline justify-between text-xs">
                          <span className="font-semibold text-ink">
                            <span className="mr-1" aria-hidden="true">
                              {CATEGORY_EMOJI[row.name] ?? "•"}
                            </span>
                            {row.name}
                          </span>
                          <span className="tnum text-subtle">
                            {row.correct}/{row.answered} ·{" "}
                            {Math.round(row.accuracy * 100)}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                          <div
                            className={`h-full rounded-full transition-[width] duration-700 ${
                              row.accuracy >= 0.8
                                ? "bg-ok"
                                : row.accuracy >= 0.5
                                ? "bg-brand"
                                : "bg-warn"
                            }`}
                            style={{ width: `${row.accuracy * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {profile.history.length > 0 && (
                <section>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-subtle">
                    Recent runs
                  </h4>
                  <div className="flex items-end gap-1.5">
                    {[...profile.history]
                      .slice(0, 14)
                      .reverse()
                      .map((entry, i) => {
                        const ratio =
                          entry.total > 0 ? entry.correct / entry.total : 0;
                        return (
                          <div
                            key={`${entry.date}-${i}`}
                            title={`${entry.correct}/${entry.total} · ${entry.points} pts${
                              entry.mode === "daily" ? " · daily" : ""
                            }`}
                            className="group flex-1"
                          >
                            <div
                              className={`w-full rounded-t-md transition-all ${
                                ratio >= 0.8
                                  ? "bg-ok"
                                  : ratio >= 0.5
                                  ? "bg-brand"
                                  : "bg-warn"
                              } group-hover:opacity-80`}
                              style={{
                                height: `${Math.max(6, ratio * 56)}px`,
                              }}
                            />
                          </div>
                        );
                      })}
                  </div>
                  <p className="mt-1.5 text-[0.7rem] text-subtle">
                    Accuracy of your last {Math.min(14, profile.history.length)}{" "}
                    runs
                  </p>
                </section>
              )}
            </div>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {ACHIEVEMENTS.map((achievement) => {
                const unlockedAt = profile.achievements[achievement.id];
                const progressInfo = achievement.progress?.(profile);
                const percent = progressInfo
                  ? Math.min(
                      100,
                      (progressInfo.current / progressInfo.target) * 100
                    )
                  : 0;

                return (
                  <div
                    key={achievement.id}
                    className={`rounded-2xl border p-3 transition ${
                      unlockedAt
                        ? `border-line bg-linear-to-br ${TIER_STYLES[achievement.tier]}`
                        : "border-line bg-surface-2"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`text-xl ${unlockedAt ? "" : "opacity-30 grayscale"}`}
                      >
                        {achievement.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-bold text-ink">
                            {achievement.name}
                          </span>
                          {unlockedAt && (
                            <span className="text-xs text-ok">✓</span>
                          )}
                        </div>
                        <p className="text-xs text-muted">
                          {achievement.description}
                        </p>
                        {!unlockedAt && progressInfo && (
                          <div className="mt-2">
                            <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                              <div
                                className="h-full rounded-full bg-brand/60"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="tnum mt-1 block text-[0.65rem] text-subtle">
                              {Math.min(progressInfo.current, progressInfo.target)}{" "}
                              / {progressInfo.target}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 px-3.5 py-3">
      <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-subtle">
        {label}
      </div>
      <div className="tnum mt-0.5 text-xl font-extrabold text-ink">{value}</div>
      {sub && <div className="tnum text-[0.7rem] text-subtle">{sub}</div>}
    </div>
  );
}

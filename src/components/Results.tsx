"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuizSession } from "@/types/quiz";
import type { FinishedSession } from "./QuizGame";
import type { Achievement } from "@/lib/achievements";
import { TIER_STYLES } from "@/lib/achievements";
import { gradeFor, xpFromPoints, type LevelProgress } from "@/lib/scoring";
import { dayNumber } from "@/lib/daily";
import { useSettings } from "./SettingsProvider";
import Confetti from "./Confetti";
import Ring from "./ui/Ring";

interface ResultsProps {
  result: FinishedSession;
  session: QuizSession;
  levelBefore: LevelProgress;
  levelAfter: LevelProgress;
  unlocked: Achievement[];
  onPlayAgain: () => void;
  onPracticeMisses: () => void;
  onNewQuiz: () => void;
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(reduceMotion ? () => setValue(target) : tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export default function Results({
  result,
  session,
  levelBefore,
  levelAfter,
  unlocked,
  onPlayAgain,
  onPracticeMisses,
  onNewQuiz,
}: ResultsProps) {
  const { fx } = useSettings();
  const { answers, points, bestStreak } = result;
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const accuracy = total > 0 ? correct / total : 0;
  const perfect = total > 0 && correct === total;
  const grade = gradeFor(accuracy, perfect);
  const leveledUp = levelAfter.level > levelBefore.level;

  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);

  const shownPoints = useCountUp(points);
  const shownRing = useCountUp(Math.round(accuracy * 100), 1100);

  const avgTime = useMemo(() => {
    if (total === 0) return 0;
    const sum = answers.reduce((acc, a) => acc + a.timeSpent, 0);
    return Math.round((sum / total) * 10) / 10;
  }, [answers, total]);

  const misses = answers.filter((a) => !a.isCorrect).length;

  useEffect(() => {
    fx("finish");
    if (accuracy >= 0.7) setBurst((b) => b + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (unlocked.length === 0) return;
    const id = setTimeout(() => fx("achievement"), 700);
    return () => clearTimeout(id);
  }, [unlocked, fx]);

  const shareText = useMemo(() => {
    const grid = answers
      .map((a) => (a.isCorrect ? "🟩" : a.skipped ? "🟨" : "🟥"))
      .join("");
    const title =
      session.mode === "daily"
        ? `Quizzy Daily #${dayNumber() - 20000}`
        : "Quizzy";
    const streakPart = bestStreak >= 3 ? ` · 🔥${bestStreak}` : "";
    return `${title}\n${grid}\n${correct}/${total} · ${points.toLocaleString()} pts${streakPart}\nhttps://quizzy-eight-khaki.vercel.app`;
  }, [answers, session.mode, correct, total, points, bestStreak]);

  const share = async () => {
    fx("click");
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* dismissed or blocked — nothing to do */
    }
  };

  const ringTone =
    accuracy >= 0.9 ? "text-gold" : accuracy >= 0.6 ? "text-brand" : "text-warn";
  // The daily can only be played once, so "play again" sends them elsewhere.
  const replayable = session.mode !== "daily";

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* --------------------------------------------------------- scorecard */}
      <div className="card relative mb-4 overflow-hidden">
        <Confetti trigger={burst} intensity={perfect ? 1 : accuracy} />

        <div className="relative px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="animate-pop mb-1 text-5xl">{grade.emoji}</div>
          <h2 className={`text-2xl font-extrabold sm:text-3xl ${grade.tone}`}>
            {grade.label}
          </h2>
          <p className="mt-1 text-sm text-muted">{grade.blurb}</p>

          <div className="mt-7 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            <Ring progress={accuracy} size={148} stroke={11} className={ringTone}>
              <div className="text-center">
                <div className="tnum text-4xl font-extrabold text-ink">
                  {shownRing}
                  <span className="text-xl text-subtle">%</span>
                </div>
                <div className="tnum text-xs font-semibold text-subtle">
                  {correct} / {total}
                </div>
              </div>
            </Ring>

            <div className="grid w-full grid-cols-2 gap-2.5 sm:w-auto sm:min-w-68">
              <StatTile
                label="Points"
                value={shownPoints.toLocaleString()}
                emoji="💰"
                accent
              />
              <StatTile
                label="XP earned"
                value={`+${xpFromPoints(points)}`}
                emoji="⭐"
              />
              <StatTile
                label="Best streak"
                value={`${bestStreak}`}
                emoji="🔥"
              />
              <StatTile label="Avg. time" value={`${avgTime}s`} emoji="⚡" />
            </div>
          </div>

          {/* -------------------------------------------------- level progress */}
          <div className="mt-8 text-left">
            <div className="mb-1.5 flex items-baseline justify-between text-xs font-semibold">
              <span className={leveledUp ? "text-gold" : "text-muted"}>
                {leveledUp ? "🎉 Level up! " : ""}Level {levelAfter.level}
              </span>
              <span className="tnum text-subtle">
                {levelAfter.xpIntoLevel} / {levelAfter.xpForNextLevel} XP
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-linear-to-r from-brand to-streak transition-[width] duration-1000 ease-out"
                style={{ width: `${levelAfter.percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ achievements */}
      {unlocked.length > 0 && (
        <div className="card animate-rise mb-4 p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-subtle">
            {unlocked.length === 1 ? "Badge unlocked" : "Badges unlocked"}
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {unlocked.map((achievement, i) => (
              <div
                key={achievement.id}
                className={`stagger-in flex items-center gap-3 rounded-2xl bg-linear-to-br p-3 ring-1 ring-line ${
                  TIER_STYLES[achievement.tier]
                }`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="text-2xl">{achievement.emoji}</span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-ink">
                    {achievement.name}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ actions */}
      <div className="mb-4 grid gap-2.5 sm:grid-cols-2">
        <button
          onClick={() => {
            fx("click");
            onPlayAgain();
          }}
          className="sheen rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-brand-contrast shadow-lift transition hover:bg-brand-strong active:scale-[0.99]"
        >
          {replayable ? "Play again ↻" : "Pick another quiz →"}
        </button>
        <button
          onClick={share}
          className="rounded-2xl border border-line bg-surface px-6 py-3.5 text-sm font-bold text-ink transition hover:border-brand/40 hover:bg-brand-soft active:scale-[0.99]"
        >
          {copied ? "Copied to clipboard ✓" : "Share result 📋"}
        </button>
        {misses > 0 && (
          <button
            onClick={() => {
              fx("click");
              onPracticeMisses();
            }}
            className="rounded-2xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-muted transition hover:border-brand/40 hover:text-ink active:scale-[0.99]"
          >
            Practise the {misses} you missed 🎯
          </button>
        )}
        {replayable && (
          <button
            onClick={() => {
              fx("click");
              onNewQuiz();
            }}
            className={`rounded-2xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-muted transition hover:border-brand/40 hover:text-ink active:scale-[0.99] ${
              misses > 0 ? "" : "sm:col-span-2"
            }`}
          >
            Change the setup →
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- review */}
      <div className="card overflow-hidden">
        <button
          onClick={() => setShowReview((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-surface-2"
        >
          <span className="text-sm font-bold text-ink">
            Review all {total} questions
          </span>
          <span
            className={`text-subtle transition-transform duration-300 ${
              showReview ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {showReview && (
          <div className="space-y-2.5 border-t border-line p-4">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`stagger-in rounded-2xl border p-3.5 ${
                  answer.isCorrect
                    ? "border-ok/30 bg-ok-soft"
                    : answer.skipped
                    ? "border-line bg-surface-2"
                    : "border-bad/30 bg-bad-soft"
                }`}
                style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
              >
                <div className="flex gap-3">
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-lg text-xs font-bold text-white ${
                      answer.isCorrect
                        ? "bg-ok"
                        : answer.skipped
                        ? "bg-subtle"
                        : "bg-bad"
                    }`}
                  >
                    {answer.isCorrect ? "✓" : answer.skipped ? "–" : "✕"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {answer.question}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      {!answer.isCorrect && (
                        <span className="text-muted">
                          You:{" "}
                          <strong className="text-bad-text">
                            {answer.userAnswer || "—"}
                          </strong>
                        </span>
                      )}
                      <span className="text-muted">
                        Answer:{" "}
                        <strong className="text-ok-text">
                          {answer.correctAnswer}
                        </strong>
                      </span>
                      <span className="tnum ml-auto text-subtle">
                        {answer.timeSpent}s
                        {answer.points > 0 && ` · +${answer.points}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  emoji,
  accent = false,
}: {
  label: string;
  value: string;
  emoji: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-3.5 py-3 text-left ${
        accent
          ? "border-brand/25 bg-brand-soft"
          : "border-line bg-surface-2"
      }`}
    >
      <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-subtle">
        {emoji} {label}
      </div>
      <div
        className={`tnum mt-0.5 text-lg font-extrabold ${
          accent ? "text-brand" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

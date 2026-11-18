"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import type { Challenge, QuizSession } from "@/types/quiz";
import type { FinishedSession } from "./QuizGame";
import type { Achievement } from "@/lib/achievements";
import { TIER_STYLES } from "@/lib/achievements";
import { gradeFor, xpFromPoints, type LevelProgress } from "@/lib/scoring";
import { dailyNumber } from "@/lib/daily";
import {
  GRID_EMOJI,
  correctIn,
  gridOf,
  isChallengeable,
  shareUrlFor,
} from "@/lib/challenge";
import {
  MIN_PLAYS_FOR_STATS,
  betterThan,
  percentRight,
  type DailyStats,
} from "@/lib/daily-stats";
import { fetchDailyStats, submitDailyResult } from "@/lib/quiz-api";
import { absoluteUrl } from "@/lib/site";
import { useSettings } from "./SettingsProvider";
import { useLocale, useUi } from "./LocaleProvider";
import { formatNumber } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import type { UiMessages } from "@/i18n/ui";
import Confetti from "./Confetti";
import Ring from "./ui/Ring";
import GridSquares from "./ui/GridSquares";

interface ResultsProps {
  result: FinishedSession;
  session: QuizSession;
  levelBefore: LevelProgress;
  levelAfter: LevelProgress;
  unlocked: Achievement[];
  /** Rendered inside another site's iframe. */
  embed?: boolean;
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
  embed = false,
  onPlayAgain,
  onPracticeMisses,
  onNewQuiz,
}: ResultsProps) {
  const { fx } = useSettings();
  const locale = useLocale();
  const ui = useUi();
  const t = ui.results;
  const { answers, points, bestStreak } = result;
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const accuracy = total > 0 ? correct / total : 0;
  const perfect = total > 0 && correct === total;
  const grade = gradeFor(accuracy, perfect);
  const leveledUp = levelAfter.level > levelBefore.level;

  const [showReview, setShowReview] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied" | "manual">(
    "idle"
  );
  // Fire one confetti burst on mount for a strong round.
  const [burst] = useState(() => (accuracy >= 0.7 ? 1 : 0));

  const shownPoints = useCountUp(points);
  const shownRing = useCountUp(Math.round(accuracy * 100), 1100);

  const avgTime = useMemo(() => {
    if (total === 0) return 0;
    const sum = answers.reduce((acc, a) => acc + a.timeSpent, 0);
    return Math.round((sum / total) * 10) / 10;
  }, [answers, total]);

  const misses = answers.filter((a) => !a.isCorrect).length;
  const grid = useMemo(() => gridOf(answers), [answers]);
  const stats = useDailyStats(session, grid);
  const showStats = stats !== null && stats.plays >= MIN_PLAYS_FOR_STATS;

  useEffect(() => {
    fx("finish");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (unlocked.length === 0) return;
    const id = setTimeout(() => fx("achievement"), 700);
    return () => clearTimeout(id);
  }, [unlocked, fx]);

  const shareText = useMemo(() => {
    const squares = [...grid].map((c) => GRID_EMOJI[c]).join("");
    const title = session.dailyKey ? t.shareDaily(dailyNumber(session.dailyKey)) : "Quizzy";
    const streakPart = bestStreak >= 3 ? ` · 🔥${bestStreak}` : "";
    const dare = isChallengeable(session, answers) ? `\n${t.shareDare}` : "";
    return `${title}\n${squares}\n${correct}/${total} · ${ui.common.pts(points)}${streakPart}${dare}\n${shareUrlFor(session, answers, points, locale)}`;
  }, [grid, session, answers, correct, total, points, bestStreak, t, ui, locale]);

  // Inside another site's iframe both the share sheet and the clipboard can be
  // blocked, so each step falls through to the next — ending with the text
  // shown for copying by hand.
  const share = async () => {
    fx("click");
    track("share", { mode: session.mode });
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setShareState("copied");
      setTimeout(
        () => setShareState((state) => (state === "copied" ? "idle" : state)),
        2200
      );
    } catch {
      setShareState("manual");
    }
  };

  const ringTone =
    accuracy >= 0.9 ? "text-gold" : accuracy >= 0.6 ? "text-brand" : "text-warn";
  // A daily can only be played once, so "play again" sends them elsewhere.
  const replayable = session.mode === "custom";
  const practice = session.mode === "practice";

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* --------------------------------------------------------- scorecard */}
      <div className="card relative mb-4 overflow-hidden">
        <Confetti trigger={burst} intensity={perfect ? 1 : accuracy} />

        <div className="relative px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="animate-pop mb-1 text-5xl">{grade.emoji}</div>
          <h2 className={`text-2xl font-extrabold sm:text-3xl ${grade.tone}`}>
            {ui.grades[grade.id].label}
          </h2>
          <p className="mt-1 text-sm text-muted">{ui.grades[grade.id].blurb}</p>
          {practice && (
            <p className="mt-2 text-xs font-semibold text-subtle">{t.practiceNote}</p>
          )}

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
                label={t.points}
                value={formatNumber(shownPoints, locale)}
                emoji="💰"
                accent
              />
              <StatTile
                label={t.xpEarned}
                value={practice ? "—" : `+${xpFromPoints(points)}`}
                emoji="⭐"
              />
              <StatTile label={t.bestStreak} value={`${bestStreak}`} emoji="🔥" />
              <StatTile
                label={t.avgTime}
                value={ui.common.seconds(avgTime.toLocaleString(locale))}
                emoji="⚡"
              />
            </div>
          </div>

          {showStats && session.mode === "daily" && (
            <p className="animate-rise mt-6 rounded-2xl bg-surface-2 px-4 py-3 text-sm font-semibold text-ink">
              {t.betterThan}{" "}
              <span className="text-brand">
                {ui.common.percent(betterThan(stats, correct))}
              </span>{" "}
              {t.ofPlayersToday(stats.plays)}
            </p>
          )}

          {/* -------------------------------------------------- level progress */}
          <div className="mt-8 text-left">
            <div className="mb-1.5 flex items-baseline justify-between text-xs font-semibold">
              <span className={leveledUp ? "text-gold-text" : "text-muted"}>
                {leveledUp ? t.levelUp : ""}
                {t.level(levelAfter.level)}
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

      {session.challenge && (
        <ChallengeVerdict
          ui={ui}
          challenge={session.challenge}
          correct={correct}
          points={points}
          grid={grid}
        />
      )}

      {/* ------------------------------------------------------ achievements */}
      {unlocked.length > 0 && (
        <div className="card animate-rise mb-4 p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-subtle">
            {t.badgesUnlocked(unlocked.length)}
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
                    {ui.achievements[achievement.id].name}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {ui.achievements[achievement.id].description}
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
          {replayable ? t.playAgain : embed ? t.back : t.pickAnother}
        </button>
        <button
          onClick={share}
          className="rounded-2xl border border-line bg-surface px-6 py-3.5 text-sm font-bold text-ink transition hover:border-brand/40 hover:bg-brand-soft active:scale-[0.99]"
        >
          {shareState === "copied" ? t.copied : t.share}
        </button>
        {shareState === "manual" && (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-muted">
              {t.shareBlocked}
            </span>
            <textarea
              readOnly
              autoFocus
              value={shareText}
              rows={5}
              onFocus={(event) => event.currentTarget.select()}
              className="w-full resize-none rounded-xl border border-line bg-surface-2 p-3 font-mono text-xs text-ink"
            />
          </label>
        )}
        {misses > 0 && (
          <button
            onClick={() => {
              fx("click");
              onPracticeMisses();
            }}
            className="rounded-2xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-muted transition hover:border-brand/40 hover:text-ink active:scale-[0.99]"
          >
            {t.practiseMisses(misses)}
          </button>
        )}
        {embed ? (
          <a
            href={absoluteUrl(pathFor({ page: "home" }, locale))}
            target="_blank"
            rel="noopener"
            className={`rounded-2xl border border-line bg-surface px-6 py-3 text-center text-sm font-semibold text-muted transition hover:border-brand/40 hover:text-ink ${
              misses > 0 ? "" : "sm:col-span-2"
            }`}
          >
            {t.moreOnQuizzy}
          </a>
        ) : replayable && (
          <button
            onClick={() => {
              fx("click");
              onNewQuiz();
            }}
            className={`rounded-2xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-muted transition hover:border-brand/40 hover:text-ink active:scale-[0.99] ${
              misses > 0 ? "" : "sm:col-span-2"
            }`}
          >
            {t.changeSetup}
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
            {t.review(total)}
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
                          {t.you}{" "}
                          <strong className="text-bad-text">
                            {answer.userAnswer || "—"}
                          </strong>
                        </span>
                      )}
                      <span className="text-muted">
                        {t.answer}{" "}
                        <strong className="text-ok-text">
                          {answer.correctAnswer}
                        </strong>
                      </span>
                      <span className="tnum ml-auto text-subtle">
                        {showStats && t.gotIt(percentRight(stats, index))}
                        {ui.common.seconds(answer.timeSpent.toLocaleString(locale))}
                        {answer.points > 0 && ` · +${answer.points}`}
                      </span>
                    </div>
                    {answer.explanation && (
                      <p className="mt-2 text-xs leading-relaxed text-muted">
                        💡 {answer.explanation}
                      </p>
                    )}
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

/**
 * Today's daily posts its anonymous result and gets everyone's numbers back;
 * an archived day only reads them.
 */
function useDailyStats(session: QuizSession, grid: string): DailyStats | null {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const { mode, dailyKey } = session;

  useEffect(() => {
    if (!dailyKey || mode === "custom") return;
    let cancelled = false;
    const request =
      mode === "daily" ? submitDailyResult(dailyKey, grid) : fetchDailyStats(dailyKey);
    void request.then((result) => {
      if (!cancelled) setStats(result);
    });
    return () => {
      cancelled = true;
    };
  }, [mode, dailyKey, grid]);

  return stats;
}

function ChallengeVerdict({
  ui,
  challenge,
  correct,
  points,
  grid,
}: {
  ui: UiMessages;
  challenge: Challenge;
  correct: number;
  points: number;
  grid: string;
}) {
  const theirs = correctIn(challenge.grid);
  const won = correct > theirs || (correct === theirs && points > challenge.points);
  const tied = correct === theirs && points === challenge.points;
  const t = ui.results;
  const verdict = tied ? t.deadHeat : won ? t.youWin : t.theyWin;

  return (
    <div className="card animate-rise mb-4 p-5">
      <h3 className="mb-3 text-center text-lg font-extrabold text-ink">{verdict}</h3>
      <div className="grid grid-cols-2 gap-3 text-center">
        <ScoreColumn
          ui={ui}
          label={t.youLabel}
          grid={grid}
          correct={correct}
          points={points}
          highlight={won || tied}
        />
        <ScoreColumn
          ui={ui}
          label={t.friendLabel}
          grid={challenge.grid}
          correct={theirs}
          points={challenge.points}
          highlight={!won || tied}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        {t.sendBack}
      </p>
    </div>
  );
}

function ScoreColumn({
  ui,
  label,
  grid,
  correct,
  points,
  highlight,
}: {
  ui: UiMessages;
  label: string;
  grid: string;
  correct: number;
  points: number;
  highlight: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-3 py-3 ${
        highlight ? "border-brand/30 bg-brand-soft" : "border-line bg-surface-2"
      }`}
    >
      <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-subtle">
        {label}
      </div>
      <div className="mt-2">
        <GridSquares grid={grid} label={ui.common.gridLabel(correct, grid.length)} />
      </div>
      <div className="tnum mt-1 text-base font-extrabold text-ink">
        {correct}/{grid.length}
        <span className="ml-1.5 text-xs font-semibold text-subtle">
          {ui.common.pts(points)}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { QuizAnswer, QuizSession } from "@/types/quiz";
import { decodeHtmlEntities, shuffleArray } from "@/lib/quiz-api";
import {
  DIFFICULTY_MULTIPLIER,
  TIME_LIMIT,
  scoreAnswer,
  streakMultiplier,
  type ScoreBreakdown,
} from "@/lib/scoring";
import { useSettings } from "./SettingsProvider";
import Ring from "./ui/Ring";

export interface FinishedSession {
  answers: QuizAnswer[];
  points: number;
  bestStreak: number;
  powerUpsUsed: number;
}

interface QuizGameProps {
  session: QuizSession;
  onFinish: (result: FinishedSession) => void;
  onQuit: () => void;
}

type PowerUp = "fifty" | "time" | "skip";

const AUTO_ADVANCE_MS = 1250;
const KEYS = ["1", "2", "3", "4", "5", "6"];

const DIFFICULTY_STYLE = {
  easy: "bg-ok-soft text-ok-text ring-1 ring-ok/25",
  medium: "bg-warn-soft text-warn ring-1 ring-warn/25",
  hard: "bg-bad-soft text-bad-text ring-1 ring-bad/25",
} as const;

export default function QuizGame({ session, onFinish, onQuit }: QuizGameProps) {
  const { questions, config, mode, isOffline } = session;
  const { fx } = useSettings();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [wasSkipped, setWasSkipped] = useState(false);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gain, setGain] = useState<ScoreBreakdown | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [used, setUsed] = useState<Record<PowerUp, boolean>>({
    fifty: false,
    time: false,
    skip: false,
  });
  const [bonusTime, setBonusTime] = useState(0);
  const [confirmQuit, setConfirmQuit] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const timed = config.timed;

  const baseLimit = question ? TIME_LIMIT[question.difficulty] : 20;
  const timeLimit = baseLimit + bonusTime;

  // Tagging the clock with its question index means a new question shows a full
  // timer on its very first frame, with no leftover value from the last one.
  const [clock, setClock] = useState({ forIndex: 0, left: baseLimit });
  const timeLeft = clock.forIndex === index ? clock.left : timeLimit;

  const deadlineRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickRef = useRef<number>(99);

  const options = useMemo(() => {
    if (!question) return [];
    const all = [...question.incorrect_answers, question.correct_answer];
    if (question.type === "boolean") {
      return all.sort((a, b) => (a === "True" ? -1 : b === "True" ? 1 : 0));
    }
    return shuffleArray(all);
  }, [question]);

  /* ---------------------------------------------------------------- timing */
  useEffect(() => {
    startedAtRef.current = Date.now();
    lastTickRef.current = 99;
    if (!timed) return;
    deadlineRef.current = Date.now() + baseLimit * 1000;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, timed]);

  const commitAnswer = useCallback(
    (choice: string | null, kind: "answer" | "timeout" | "skip") => {
      if (!question || revealed) return;

      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      const remaining = timed
        ? Math.max(0, (deadlineRef.current - Date.now()) / 1000)
        : 0;
      const isCorrect = kind === "answer" && choice === question.correct_answer;
      const skipped = kind !== "answer";

      // A skip is a free pass: no points, but the streak survives.
      const nextStreak = isCorrect ? streak + 1 : kind === "skip" ? streak : 0;
      const breakdown = isCorrect
        ? scoreAnswer({
            difficulty: question.difficulty,
            streak: nextStreak,
            timeLeft: remaining,
            timeLimit,
            timed,
          })
        : null;

      setSelected(choice);
      setRevealed(true);
      setTimedOut(kind === "timeout");
      setWasSkipped(kind === "skip");
      setStreak(nextStreak);
      setBestStreak((best) => Math.max(best, nextStreak));
      setGain(breakdown);
      if (breakdown) setPoints((p) => p + breakdown.total);

      setAnswers((prev) => [
        ...prev,
        {
          question: decodeHtmlEntities(question.question),
          userAnswer: choice ? decodeHtmlEntities(choice) : "",
          correctAnswer: decodeHtmlEntities(question.correct_answer),
          isCorrect,
          category: question.category,
          difficulty: question.difficulty,
          timeSpent: Math.round(elapsed * 10) / 10,
          points: breakdown?.total ?? 0,
          streak: nextStreak,
          skipped,
        },
      ]);

      if (kind === "timeout") fx("timeout");
      else if (isCorrect) fx(nextStreak >= 3 ? "streak" : "correct");
      else if (kind === "skip") fx("powerup");
      else fx("wrong");
    },
    [question, revealed, streak, timeLimit, timed, fx]
  );

  useEffect(() => {
    if (!timed || revealed || !question) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
      setClock({ forIndex: index, left: remaining });

      const whole = Math.ceil(remaining);
      if (remaining > 0 && whole <= 5 && whole < lastTickRef.current) {
        lastTickRef.current = whole;
        fx("tick");
      }
      if (remaining <= 0) commitAnswer(null, "timeout");
    }, 100);
    return () => clearInterval(id);
  }, [timed, revealed, question, index, commitAnswer, fx]);

  /* --------------------------------------------------------------- advance */
  const finish = useCallback(
    (finalAnswers: QuizAnswer[], finalPoints: number, finalBest: number) => {
      onFinish({
        answers: finalAnswers,
        points: finalPoints,
        bestStreak: finalBest,
        powerUpsUsed: Object.values(used).filter(Boolean).length,
      });
    },
    [onFinish, used]
  );

  const advance = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (!revealed) return;

    if (isLast) {
      finish(answers, points, bestStreak);
      return;
    }

    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
    setTimedOut(false);
    setWasSkipped(false);
    setGain(null);
    setHidden([]);
    setBonusTime(0);
  }, [revealed, isLast, answers, points, bestStreak, finish]);

  // Correct answers roll on by themselves; misses wait so they can be read.
  useEffect(() => {
    if (!revealed) return;
    const lastAnswer = answers[answers.length - 1];
    if (!lastAnswer?.isCorrect) return;
    autoAdvanceRef.current = setTimeout(advance, AUTO_ADVANCE_MS);
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [revealed, answers, advance]);

  /* -------------------------------------------------------------- powerups */
  const activatePowerUp = useCallback(
    (power: PowerUp) => {
      if (used[power] || revealed || !question) return;

      if (power === "fifty") {
        const wrong = shuffleArray(question.incorrect_answers).slice(
          0,
          Math.max(0, question.incorrect_answers.length - 1)
        );
        setHidden(wrong);
      } else if (power === "time") {
        deadlineRef.current += 10_000;
        setBonusTime((b) => b + 10);
        setClock((c) => ({
          forIndex: index,
          left: (c.forIndex === index ? c.left : baseLimit) + 10,
        }));
      }

      setUsed((u) => ({ ...u, [power]: true }));
      fx("powerup");

      if (power === "skip") commitAnswer(null, "skip");
    },
    [used, revealed, question, index, baseLimit, fx, commitAnswer]
  );

  /* -------------------------------------------------------------- keyboard */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (confirmQuit || !question) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (revealed) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          advance();
        }
        return;
      }

      // Letters and numbers both map to the on-screen option labels.
      const letter = event.key.toLowerCase();
      const byLetter =
        letter.length === 1 ? letter.charCodeAt(0) - 97 : -1;
      const byNumber = KEYS.indexOf(event.key);
      const pick =
        byLetter >= 0 && byLetter < options.length
          ? byLetter
          : byNumber >= 0 && byNumber < options.length
          ? byNumber
          : -1;

      if (pick >= 0 && !hidden.includes(options[pick])) {
        event.preventDefault();
        commitAnswer(options[pick], "answer");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmQuit, question, revealed, options, hidden, commitAnswer, advance]);

  if (!question) {
    return (
      <div className="card mx-auto max-w-3xl p-10 text-center">
        <p className="text-muted">No questions available.</p>
      </div>
    );
  }

  const answeredCount = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const timeFraction = timed ? Math.max(0, timeLeft / timeLimit) : 1;
  const urgent = timed && timeLeft <= 5;
  const multiplier = streakMultiplier(streak);

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* ------------------------------------------------------------- HUD */}
      <div className="card mb-4 flex flex-wrap items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <button
          onClick={() => setConfirmQuit(true)}
          className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-surface-3 hover:text-ink"
          aria-label="Quit quiz"
          title="Quit quiz"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" strokeWidth={2}>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0">
            <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-subtle">
              {mode === "daily" ? "Daily Challenge" : "Question"}
            </div>
            <div className="tnum text-sm font-bold text-ink">
              {index + 1}
              <span className="text-subtle"> / {questions.length}</span>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-line sm:block" />

          <div className="hidden sm:block">
            <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-subtle">
              Score
            </div>
            <div className="tnum text-sm font-bold text-brand">
              {points.toLocaleString()}
            </div>
          </div>
        </div>

        {streak >= 2 && (
          <div
            key={streak}
            className="animate-pop flex items-center gap-1.5 rounded-xl bg-linear-to-r from-streak/20 to-warn/10 px-2.5 py-1.5 ring-1 ring-streak/30"
          >
            <span className="text-base leading-none">🔥</span>
            <span className="tnum text-sm font-bold text-streak">
              {streak}
              {multiplier > 1 && (
                <span className="ml-1 text-[0.7rem] font-extrabold">
                  ×{multiplier}
                </span>
              )}
            </span>
          </div>
        )}

        {timed && (
          <Ring
            progress={timeFraction}
            size={44}
            stroke={4}
            className={
              urgent ? "text-bad" : timeFraction < 0.5 ? "text-warn" : "text-brand"
            }
          >
            <span
              className={`tnum text-xs font-bold ${
                urgent ? "animate-pulse text-bad" : "text-ink"
              }`}
            >
              {Math.ceil(timeLeft)}
            </span>
          </Ring>
        )}
      </div>

      {/* ------------------------------------------------------- progress dots */}
      <div className="mb-5 flex items-center gap-1.5 px-1">
        {questions.map((_, i) => {
          const record = answers[i];
          const state = record
            ? record.isCorrect
              ? "bg-ok"
              : record.skipped
              ? "bg-subtle"
              : "bg-bad"
            : i === index
            ? "bg-brand"
            : "bg-line-strong";
          return (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${state} ${
                i === index && !record ? "animate-pulse" : ""
              }`}
            />
          );
        })}
      </div>

      {/* ----------------------------------------------------------- question */}
      <div key={index} className="card animate-rise overflow-hidden">
        {isOffline && (
          <div className="flex items-center gap-2 border-b border-line bg-warn-soft px-5 py-2.5 text-xs font-medium text-warn">
            <span>⚡</span>
            Offline pack — playing from the built-in question bank.
          </div>
        )}

        <div className="p-5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
              {decodeHtmlEntities(question.category)}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${
                DIFFICULTY_STYLE[question.difficulty]
              }`}
            >
              {question.difficulty} · ×{DIFFICULTY_MULTIPLIER[question.difficulty]}
            </span>
            {answeredCount > 0 && (
              <span className="ml-auto tnum text-xs font-medium text-subtle">
                {correctCount}/{answeredCount} correct
              </span>
            )}
          </div>

          <h2 className="text-balance text-xl font-bold leading-snug text-ink sm:text-2xl">
            {decodeHtmlEntities(question.question)}
          </h2>

          {/* --------------------------------------------------------- options */}
          <div className="relative mt-6 space-y-2.5">
            {gain && (
              <div className="score-fly pointer-events-none absolute -top-2 right-0 z-10 text-right">
                <div className="tnum text-xl font-extrabold text-ok">
                  +{gain.total}
                </div>
                {(gain.speedBonus > 0 || gain.streakMultiplier > 1) && (
                  <div className="text-[0.7rem] font-semibold text-ok-text">
                    {gain.speedBonus > 0 && `speed +${gain.speedBonus}`}
                    {gain.speedBonus > 0 && gain.streakMultiplier > 1 && " · "}
                    {gain.streakMultiplier > 1 && `×${gain.streakMultiplier}`}
                  </div>
                )}
              </div>
            )}

            {options.map((option, i) => {
              const isHidden = hidden.includes(option);
              const isCorrectOption = option === question.correct_answer;
              const isPicked = selected === option;

              let tone =
                "border-line bg-surface-2 text-ink hover:border-brand/50 hover:bg-brand-soft";
              if (revealed) {
                if (isCorrectOption) {
                  tone = "border-ok bg-ok-soft text-ok-text";
                } else if (isPicked) {
                  tone = "animate-shake border-bad bg-bad-soft text-bad-text";
                } else {
                  tone = "border-line bg-surface-2 text-subtle opacity-55";
                }
              } else if (isHidden) {
                tone =
                  "border-line bg-surface-2 text-subtle opacity-30 line-through";
              }

              return (
                <button
                  key={option}
                  onClick={() => commitAnswer(option, "answer")}
                  disabled={revealed || isHidden}
                  className={`group flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 sm:p-4 ${tone} ${
                    !revealed && !isHidden
                      ? "cursor-pointer active:scale-[0.99]"
                      : "cursor-default"
                  }`}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-xl border text-xs font-bold transition ${
                      revealed && isCorrectOption
                        ? "border-ok bg-ok text-white"
                        : revealed && isPicked
                        ? "border-bad bg-bad text-white"
                        : "border-line-strong bg-surface text-subtle group-hover:border-brand group-hover:text-brand"
                    }`}
                  >
                    {revealed && isCorrectOption
                      ? "✓"
                      : revealed && isPicked
                      ? "✕"
                      : String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-[0.95rem] font-medium sm:text-base">
                    {decodeHtmlEntities(option)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* -------------------------------------------------------- feedback */}
          {revealed ? (
            <div className="animate-rise mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold" role="status" aria-live="polite">
                {answers[answers.length - 1]?.isCorrect ? (
                  <span className="text-ok-text">
                    Correct! {streak >= 3 && `${streak} in a row 🔥`}
                  </span>
                ) : timedOut ? (
                  <span className="text-bad-text">
                    Time&apos;s up — the answer was{" "}
                    {decodeHtmlEntities(question.correct_answer)}
                  </span>
                ) : wasSkipped ? (
                  <span className="text-muted">
                    Skipped — streak kept. Answer:{" "}
                    {decodeHtmlEntities(question.correct_answer)}
                  </span>
                ) : (
                  <span className="text-bad-text">
                    Not quite — it was{" "}
                    {decodeHtmlEntities(question.correct_answer)}
                  </span>
                )}
              </p>
              <button
                onClick={advance}
                autoFocus
                className="sheen relative overflow-hidden rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-brand-contrast shadow-lift transition hover:bg-brand-strong active:scale-[0.98]"
              >
                {isLast ? "See results" : "Next question"}
                <span className="ml-1.5">→</span>
                {answers[answers.length - 1]?.isCorrect && (
                  <span className="autoadv absolute inset-x-0 bottom-0 h-0.5 bg-white/70" />
                )}
              </button>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <PowerUpButton
                  label="50:50"
                  hint="Remove wrong answers"
                  emoji="✂️"
                  disabled={used.fifty || question.type === "boolean"}
                  onClick={() => activatePowerUp("fifty")}
                />
                {timed && (
                  <PowerUpButton
                    label="+10s"
                    hint="Buy more time"
                    emoji="⏳"
                    disabled={used.time}
                    onClick={() => activatePowerUp("time")}
                  />
                )}
                <PowerUpButton
                  label="Skip"
                  hint="Pass without losing your streak"
                  emoji="⏭️"
                  disabled={used.skip}
                  onClick={() => activatePowerUp("skip")}
                />
              </div>
              <p className="hidden text-xs text-subtle sm:block">
                Press{" "}
                <kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 font-sans text-[0.7rem] font-semibold">
                  A
                </kbd>
                –
                <kbd className="rounded border border-line-strong bg-surface-2 px-1.5 py-0.5 font-sans text-[0.7rem] font-semibold">
                  {String.fromCharCode(64 + options.length)}
                </kbd>{" "}
                to answer
              </p>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------- quit dialog */}
      {confirmQuit && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="card animate-pop w-full max-w-sm p-6 text-center">
            <div className="mb-3 text-4xl">🚪</div>
            <h3 className="mb-2 text-lg font-bold text-ink">Leave this quiz?</h3>
            <p className="mb-6 text-sm text-muted">
              Your progress in this round won&apos;t be saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmQuit(false)}
                className="flex-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-contrast transition hover:bg-brand-strong"
              >
                Keep playing
              </button>
              <button
                onClick={onQuit}
                className="flex-1 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface-3 hover:text-ink"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PowerUpButton({
  label,
  hint,
  emoji,
  disabled,
  onClick,
}: {
  label: string;
  hint: string;
  emoji: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled ? `${label} — already used` : hint}
      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
        disabled
          ? "cursor-not-allowed border-line bg-surface-2 text-subtle opacity-45"
          : "border-brand/30 bg-brand-soft text-brand hover:border-brand hover:shadow-card active:scale-95"
      }`}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}

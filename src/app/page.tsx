"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchQuizQuestions } from "@/lib/quiz-api";
import { buildDailyQuiz, DAILY_QUESTION_COUNT } from "@/lib/daily";
import {
  applySession,
  emptyProfile,
  loadProfile,
  normalizeDailyStreak,
  resetProfile,
  saveProfile,
  type Profile,
} from "@/lib/storage";
import { grantAchievements, type Achievement } from "@/lib/achievements";
import { levelProgress, type LevelProgress } from "@/lib/scoring";
import type { QuizConfig, QuizSession } from "@/types/quiz";
import QuizGame, { type FinishedSession } from "@/components/QuizGame";
import QuizConfigPanel from "@/components/QuizConfig";
import Results from "@/components/Results";
import DailyCard from "@/components/DailyCard";
import StatsPanel from "@/components/StatsPanel";
import HeaderBar from "@/components/HeaderBar";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

type View = "home" | "playing" | "results";

interface ResultState {
  result: FinishedSession;
  session: QuizSession;
  levelBefore: LevelProgress;
  levelAfter: LevelProgress;
  unlocked: Achievement[];
}

export default function Home() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [session, setSession] = useState<QuizSession | null>(null);
  const [resultState, setResultState] = useState<ResultState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = normalizeDailyStreak(loadProfile());
    setProfile(stored);
    saveProfile(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  const startCustom = useCallback(async (config: QuizConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchQuizQuestions(config.amount, config);
      if (!data.results.length) {
        setError("No questions matched that combination. Try widening it.");
        return;
      }
      setSession({
        questions: data.results,
        config: { ...config, amount: data.results.length },
        mode: "custom",
        isOffline: !!data.isOffline,
      });
      setView("playing");
    } catch {
      setError("Couldn't load questions. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startDaily = useCallback(() => {
    const questions = buildDailyQuiz();
    setSession({
      questions,
      config: {
        categories: [],
        difficulty: "mixed",
        amount: Math.min(DAILY_QUESTION_COUNT, questions.length),
        timed: true,
      },
      mode: "daily",
      isOffline: false,
    });
    setView("playing");
  }, []);

  const handleFinish = useCallback(
    (result: FinishedSession) => {
      if (!session) return;

      const levelBefore = levelProgress(profile.xp);
      const folded = applySession(profile, {
        answers: result.answers,
        points: result.points,
        bestStreak: result.bestStreak,
        mode: session.mode,
      });
      const { profile: withBadges, unlocked } = grantAchievements(folded, {
        correct: result.answers.filter((a) => a.isCorrect).length,
        total: result.answers.length,
        points: result.points,
        bestStreak: result.bestStreak,
        powerUpsUsed: result.powerUpsUsed,
        timed: session.config.timed,
        mode: session.mode,
      });

      setProfile(withBadges);
      saveProfile(withBadges);
      setResultState({
        result,
        session,
        levelBefore,
        levelAfter: levelProgress(withBadges.xp),
        unlocked,
      });
      setView("results");
    },
    [profile, session]
  );

  const playAgain = useCallback(() => {
    if (!resultState) return;
    const { session: previous } = resultState;
    if (previous.mode === "daily") {
      // The daily is once a day — send them back to a fresh custom round.
      setView("home");
      return;
    }
    void startCustom(previous.config);
  }, [resultState, startCustom]);

  const practiceMisses = useCallback(() => {
    if (!resultState) return;
    const { session: previous, result } = resultState;
    const missed = previous.questions.filter(
      (_, index) => result.answers[index] && !result.answers[index].isCorrect
    );
    if (missed.length === 0) return;
    setSession({
      questions: missed,
      config: { ...previous.config, amount: missed.length, timed: false },
      mode: "custom",
      isOffline: previous.isOffline,
    });
    setResultState(null);
    setView("playing");
  }, [resultState]);

  const goHome = useCallback(() => {
    setSession(null);
    setResultState(null);
    setView("home");
  }, []);

  const handleReset = useCallback(() => {
    resetProfile();
    setProfile(emptyProfile);
  }, []);

  return (
    <div className="app-shell relative min-h-screen">
      <HeaderBar
        profile={profile}
        ready={ready}
        onResetProgress={handleReset}
      />

      <div className="relative z-10 px-4 pb-8 pt-6">
        {view === "home" && (
          <>
            <div className="mx-auto mb-7 max-w-3xl text-center">
              <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
                How much do you{" "}
                <span className="brand-gradient-text">actually</span> know?
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted sm:text-base">
                Beat the clock, build a streak, climb the levels. One quick round
                is never quite enough.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <DailyCard profile={profile} ready={ready} onPlay={startDaily} />
            </div>

            {error && (
              <div className="mx-auto mb-3 max-w-3xl rounded-2xl border border-bad/30 bg-bad-soft px-4 py-3 text-sm font-medium text-bad-text">
                {error}
              </div>
            )}

            <QuizConfigPanel onStartQuiz={startCustom} isLoading={isLoading} />

            <div className="mx-auto max-w-3xl">
              <StatsPanel profile={profile} ready={ready} />
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <div className="grid gap-3 sm:grid-cols-3">
                <FeatureCard
                  emoji="🔥"
                  title="Streaks that pay"
                  text="Three right in a row starts a multiplier — up to ×3 on every point you bank."
                />
                <FeatureCard
                  emoji="⚡"
                  title="Answer fast, score big"
                  text="The clock doubles as a bonus. Hesitate and you still score, just less."
                />
                <FeatureCard
                  emoji="🎖️"
                  title="20 badges to chase"
                  text="Levels, perfect runs, speed records and daily streaks all tracked on your device."
                />
              </div>
            </div>

            <FAQ />
            <Footer />
          </>
        )}

        {view === "playing" && session && (
          <QuizGame
            session={session}
            onFinish={handleFinish}
            onQuit={goHome}
          />
        )}

        {view === "results" && resultState && (
          <Results
            result={resultState.result}
            session={resultState.session}
            levelBefore={resultState.levelBefore}
            levelAfter={resultState.levelAfter}
            unlocked={resultState.unlocked}
            onPlayAgain={playAgain}
            onPracticeMisses={practiceMisses}
            onNewQuiz={goHome}
          />
        )}
      </div>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-5">
      <div className="mb-2 text-2xl">{emoji}</div>
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
    </div>
  );
}

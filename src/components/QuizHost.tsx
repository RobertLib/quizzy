"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { useHydrated } from "@/lib/client-state";
import { fetchDailyQuiz, fetchQuizQuestions } from "@/lib/quiz-api";
import { DAILY_QUESTION_COUNT, todayKey } from "@/lib/daily";
import {
  applySession,
  emptyProfile,
  hasPlayedDaily,
  loadProfile,
  markDailyPlayed,
  markDailyStarted,
  normalizeDailyStreak,
  resetProfile,
  saveProfile,
  subscribeProfile,
  type Profile,
} from "@/lib/storage";
import { grantAchievements, type Achievement } from "@/lib/achievements";
import { levelProgress, type LevelProgress } from "@/lib/scoring";
import type { Challenge, GameMode, QuizConfig, QuizSession } from "@/types/quiz";
import QuizGame, { type FinishedSession } from "./QuizGame";
import Results from "./Results";
import HeaderBar from "./HeaderBar";
import { useSettings } from "./SettingsProvider";

interface ResultState {
  result: FinishedSession;
  levelBefore: LevelProgress;
  levelAfter: LevelProgress;
  unlocked: Achievement[];
}

/** A round in progress, pinned to the page it was started on. */
interface Play {
  path: string;
  view: "playing" | "results";
  session: QuizSession;
  outcome?: ResultState;
}

interface QuizHostValue {
  profile: Profile;
  /** True once localStorage has been read. */
  ready: boolean;
  isLoading: boolean;
  /** Embedded on another site: no header, links open in a new tab. */
  embed: boolean;
  startCustom: (config: QuizConfig, source?: string) => Promise<void>;
  /** Plays the daily for `key` — counted as the daily only if it's today's. */
  startDaily: (key: string, challenge?: Challenge) => Promise<void>;
}

const QuizHostContext = createContext<QuizHostValue | null>(null);

export function useQuizHost(): QuizHostValue {
  const ctx = useContext(QuizHostContext);
  if (!ctx) throw new Error("useQuizHost must be used inside QuizHost");
  return ctx;
}

const serverProfile = () => emptyProfile;

/** The profile as stored right now, with a lapsed daily streak reset. */
function currentProfile(): Profile {
  return normalizeDailyStreak(loadProfile());
}

/**
 * Owns the player's profile and the round being played. Page content is
 * passed as children and shown while no round is running; any page can start
 * a round through `useQuizHost()`.
 */
export default function QuizHost({
  children,
  embed = false,
}: {
  children: React.ReactNode;
  embed?: boolean;
}) {
  const ready = useHydrated();
  const pathname = usePathname();
  const router = useRouter();
  const { settings, toggleSound } = useSettings();

  // Shared with other tabs: a round finished elsewhere shows up here too.
  const stored = useSyncExternalStore(subscribeProfile, loadProfile, serverProfile);
  const profile = useMemo(() => normalizeDailyStreak(stored), [stored]);

  const [play, setPlay] = useState<Play | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ path: string; message: string } | null>(
    null
  );
  /** A header link tapped mid-round, waiting for the player to confirm. */
  const [leaveTo, setLeaveTo] = useState<string | null>(null);

  // Leaving the page a round belongs to abandons it — links, back and forward
  // alike — so coming back never restarts it from the first question.
  if (play && play.path !== pathname) {
    setPlay(null);
    setLeaveTo(null);
  }
  const active = play && play.path === pathname ? play : null;
  const view = active?.view ?? "home";

  // Where the player is now, for requests that resolve after they've moved on.
  const pathRef = useRef(pathname);
  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  const previousView = useRef(view);
  useEffect(() => {
    if (previousView.current !== view) {
      window.scrollTo({ top: 0, behavior: "instant" });
      previousView.current = view;
    }
  }, [view]);

  const startCustom = useCallback(
    async (config: QuizConfig, source = "custom") => {
      const from = pathname;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchQuizQuestions(config.amount, config);
        if (pathRef.current !== from) return;
        if (!data.results.length) {
          setError({
            path: from,
            message: "No questions matched that combination. Try widening it.",
          });
          return;
        }
        track("quiz_start", { mode: "custom", source });
        setPlay({
          path: from,
          view: "playing",
          session: {
            questions: data.results,
            config: { ...config, amount: data.results.length },
            mode: "custom",
          },
        });
      } catch {
        setError({
          path: from,
          message: "Couldn't load questions. Check your connection and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pathname]
  );

  const startDaily = useCallback(
    async (key: string, challenge?: Challenge) => {
      const from = pathname;
      setIsLoading(true);
      setError(null);
      try {
        const questions = await fetchDailyQuiz(key);
        if (pathRef.current !== from) return;

        // Read storage afresh: another tab may have played it meanwhile.
        const latest = currentProfile();
        // Counted the moment it starts, so a reload can't buy a retry.
        let mode: GameMode;
        if (hasPlayedDaily(latest, key)) {
          mode = "practice";
        } else if (key === todayKey()) {
          mode = "daily";
          saveProfile(markDailyPlayed(latest, key));
        } else {
          mode = "archive";
          saveProfile(markDailyStarted(latest, key));
        }

        track("quiz_start", {
          mode,
          source: challenge ? "challenge" : embed ? "embed" : "daily",
        });
        setPlay({
          path: from,
          view: "playing",
          session: {
            questions,
            config: {
              categories: [],
              difficulty: "mixed",
              amount: Math.min(DAILY_QUESTION_COUNT, questions.length),
              timed: true,
            },
            mode,
            dailyKey: key,
            // A practice replay knows the answers — no head-to-head verdict.
            challenge: mode === "practice" ? undefined : challenge,
          },
        });
      } catch {
        setError({
          path: from,
          message: "Couldn't load the daily. Check your connection and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [embed, pathname]
  );

  const handleFinish = useCallback(
    (result: FinishedSession) => {
      if (!active) return;
      const { session } = active;
      const correct = result.answers.filter((a) => a.isCorrect).length;

      // Fold into what's stored now, not what this tab loaded earlier.
      const base = currentProfile();
      const levelBefore = levelProgress(base.xp);
      let outcome: ResultState = {
        result,
        levelBefore,
        levelAfter: levelBefore,
        unlocked: [],
      };

      // Practice rounds replay answers the player has already seen.
      if (session.mode !== "practice") {
        const folded = applySession(base, {
          answers: result.answers,
          points: result.points,
          bestStreak: result.bestStreak,
          mode: session.mode,
          dailyKey: session.dailyKey,
        });
        const { profile: withBadges, unlocked } = grantAchievements(folded, {
          correct,
          total: result.answers.length,
          points: result.points,
          bestStreak: result.bestStreak,
          powerUpsUsed: result.powerUpsUsed,
          timed: session.config.timed,
          mode: session.mode,
        });
        saveProfile(withBadges);
        outcome = { ...outcome, levelAfter: levelProgress(withBadges.xp), unlocked };
      }

      track("quiz_finish", {
        mode: session.mode,
        correct,
        total: result.answers.length,
      });
      setPlay({ ...active, view: "results", outcome });
    },
    [active]
  );

  const goHome = useCallback(() => {
    setPlay(null);
    setLeaveTo(null);
  }, []);

  /**
   * Header links: a round in progress asks before it's thrown away (the same
   * dialog as the quit button); otherwise any results view is closed, so a
   * link to the current page shows the page again.
   */
  const navigate = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Opening the link in a new tab leaves this one's round alone.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }
      if (view === "playing") {
        event.preventDefault();
        setLeaveTo(href);
        return;
      }
      setPlay(null);
    },
    [view]
  );

  const quit = useCallback(() => {
    const href = leaveTo;
    setPlay(null);
    setLeaveTo(null);
    if (href && href !== pathname) router.push(href);
  }, [leaveTo, pathname, router]);

  const cancelLeave = useCallback(() => setLeaveTo(null), []);

  const playAgain = useCallback(() => {
    if (!active) return;
    // Dailies and practice can't be dealt again — send them back to pick.
    if (active.session.mode !== "custom") {
      setPlay(null);
      return;
    }
    void startCustom(active.session.config, "replay");
  }, [active, startCustom]);

  const practiceMisses = useCallback(() => {
    if (!active?.outcome) return;
    const { session, outcome } = active;
    const missed = session.questions.filter(
      (_, index) =>
        outcome.result.answers[index] && !outcome.result.answers[index].isCorrect
    );
    if (missed.length === 0) return;
    setPlay({
      path: active.path,
      view: "playing",
      session: {
        questions: missed,
        config: { ...session.config, amount: missed.length, timed: false },
        mode: "practice",
      },
    });
  }, [active]);

  const value = useMemo<QuizHostValue>(
    () => ({ profile, ready, isLoading, embed, startCustom, startDaily }),
    [profile, ready, isLoading, embed, startCustom, startDaily]
  );

  return (
    <QuizHostContext.Provider value={value}>
      <div className="app-shell relative min-h-screen">
        {embed ? (
          // No header (and so no settings menu) inside another site's page,
          // but the sound has to be switchable there too.
          <div className="relative z-10 mx-auto flex max-w-3xl justify-end px-4 pt-2">
            <button
              onClick={toggleSound}
              role="switch"
              aria-checked={settings.sound}
              aria-label="Sound effects"
              title={settings.sound ? "Mute sound effects" : "Turn sound effects on"}
              className="grid size-8 place-items-center rounded-lg text-sm text-muted ring-1 ring-line transition hover:bg-surface hover:text-ink"
            >
              <span aria-hidden="true">{settings.sound ? "🔊" : "🔇"}</span>
            </button>
          </div>
        ) : (
          <HeaderBar
            profile={profile}
            ready={ready}
            onResetProgress={resetProfile}
            onNavigate={navigate}
          />
        )}

        <main className={`relative z-10 px-4 ${embed ? "pb-4 pt-2" : "pb-8 pt-6"}`}>
          {view === "home" && (
            <>
              {error && error.path === pathname && (
                <div
                  role="alert"
                  className="mx-auto mb-3 max-w-3xl rounded-2xl border border-bad/30 bg-bad-soft px-4 py-3 text-sm font-medium text-bad-text"
                >
                  {error.message}
                </div>
              )}
              {children}
            </>
          )}

          {view === "playing" && active && (
            <QuizGame
              session={active.session}
              onFinish={handleFinish}
              onQuit={quit}
              leaveRequested={leaveTo !== null}
              onCancelLeave={cancelLeave}
            />
          )}

          {view === "results" && active?.outcome && (
            <Results
              result={active.outcome.result}
              session={active.session}
              levelBefore={active.outcome.levelBefore}
              levelAfter={active.outcome.levelAfter}
              unlocked={active.outcome.unlocked}
              embed={embed}
              onPlayAgain={playAgain}
              onPracticeMisses={practiceMisses}
              onNewQuiz={goHome}
            />
          )}
        </main>
      </div>
    </QuizHostContext.Provider>
  );
}

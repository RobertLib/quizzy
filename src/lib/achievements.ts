import type { GameMode } from "@/types/quiz";
import type { Profile } from "./storage";
import { levelFromXp } from "./scoring";

export type AchievementTier = "bronze" | "silver" | "gold";

export interface SessionContext {
  correct: number;
  total: number;
  points: number;
  bestStreak: number;
  powerUpsUsed: number;
  timed: boolean;
  mode: GameMode;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tier: AchievementTier;
  /** Optional progress read-out for locked badges. */
  progress?: (profile: Profile) => { current: number; target: number };
  unlocked: (profile: Profile, session: SessionContext | null) => boolean;
}

const countedCategories = (profile: Profile) =>
  Object.values(profile.categories).filter((c) => c.answered >= 10).length;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Finish your first quiz",
    emoji: "🎒",
    tier: "bronze",
    progress: (p) => ({ current: Math.min(p.quizzesPlayed, 1), target: 1 }),
    unlocked: (p) => p.quizzesPlayed >= 1,
  },
  {
    id: "regular",
    name: "Regular",
    description: "Finish 10 quizzes",
    emoji: "🔥",
    tier: "bronze",
    progress: (p) => ({ current: p.quizzesPlayed, target: 10 }),
    unlocked: (p) => p.quizzesPlayed >= 10,
  },
  {
    id: "devoted",
    name: "Devoted",
    description: "Finish 50 quizzes",
    emoji: "🏅",
    tier: "gold",
    progress: (p) => ({ current: p.quizzesPlayed, target: 50 }),
    unlocked: (p) => p.quizzesPlayed >= 50,
  },
  {
    id: "century",
    name: "Century",
    description: "Answer 100 questions",
    emoji: "💯",
    tier: "bronze",
    progress: (p) => ({ current: p.questionsAnswered, target: 100 }),
    unlocked: (p) => p.questionsAnswered >= 100,
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Answer 500 questions",
    emoji: "📚",
    tier: "silver",
    progress: (p) => ({ current: p.questionsAnswered, target: 500 }),
    unlocked: (p) => p.questionsAnswered >= 500,
  },
  {
    id: "flawless",
    name: "Flawless",
    description: "Score 100% in a quiz",
    emoji: "✨",
    tier: "silver",
    progress: (p) => ({ current: Math.min(p.perfectQuizzes, 1), target: 1 }),
    unlocked: (p) => p.perfectQuizzes >= 1,
  },
  {
    id: "untouchable",
    name: "Untouchable",
    description: "Score 100% five times",
    emoji: "👑",
    tier: "gold",
    progress: (p) => ({ current: p.perfectQuizzes, target: 5 }),
    unlocked: (p) => p.perfectQuizzes >= 5,
  },
  {
    id: "streak-5",
    name: "On a Roll",
    description: "Get 5 correct answers in a row",
    emoji: "🔗",
    tier: "bronze",
    progress: (p) => ({ current: p.bestStreak, target: 5 }),
    unlocked: (p) => p.bestStreak >= 5,
  },
  {
    id: "streak-10",
    name: "Unstoppable",
    description: "Get 10 correct answers in a row",
    emoji: "⚡",
    tier: "silver",
    progress: (p) => ({ current: p.bestStreak, target: 10 }),
    unlocked: (p) => p.bestStreak >= 10,
  },
  {
    id: "streak-20",
    name: "Whirlwind",
    description: "Get 20 correct answers in a row",
    emoji: "🌪️",
    tier: "gold",
    progress: (p) => ({ current: p.bestStreak, target: 20 }),
    unlocked: (p) => p.bestStreak >= 20,
  },
  {
    id: "quickfire",
    name: "Quickfire",
    description: "Answer 10 questions correctly in under 3 seconds",
    emoji: "⏱️",
    tier: "bronze",
    progress: (p) => ({ current: p.fastAnswers, target: 10 }),
    unlocked: (p) => p.fastAnswers >= 10,
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Answer 50 questions correctly in under 3 seconds",
    emoji: "🚀",
    tier: "silver",
    progress: (p) => ({ current: p.fastAnswers, target: 50 }),
    unlocked: (p) => p.fastAnswers >= 50,
  },
  {
    id: "brainiac",
    name: "Brainiac",
    description: "Answer 50 hard questions correctly",
    emoji: "🧠",
    tier: "silver",
    progress: (p) => ({ current: p.hardCorrect, target: 50 }),
    unlocked: (p) => p.hardCorrect >= 50,
  },
  {
    id: "high-roller",
    name: "High Roller",
    description: "Bank 3,000 points in a single quiz",
    emoji: "💎",
    tier: "gold",
    progress: (p) => ({ current: p.bestQuizPoints, target: 3000 }),
    unlocked: (p) => p.bestQuizPoints >= 3000,
  },
  {
    id: "purist",
    name: "Purist",
    description: "Score 90%+ in a timed quiz without using a power-up",
    emoji: "🎯",
    tier: "silver",
    unlocked: (_p, s) =>
      !!s &&
      s.timed &&
      s.powerUpsUsed === 0 &&
      s.total >= 5 &&
      s.correct / s.total >= 0.9,
  },
  {
    id: "daily-3",
    name: "Habit Forming",
    description: "Keep a 3-day daily streak",
    emoji: "📅",
    tier: "bronze",
    progress: (p) => ({ current: p.dailyStreak, target: 3 }),
    unlocked: (p) => p.dailyStreak >= 3,
  },
  {
    id: "daily-7",
    name: "Week Strong",
    description: "Keep a 7-day daily streak",
    emoji: "🗓️",
    tier: "silver",
    progress: (p) => ({ current: p.dailyStreak, target: 7 }),
    unlocked: (p) => p.dailyStreak >= 7,
  },
  {
    id: "daily-30",
    name: "Iron Will",
    description: "Keep a 30-day daily streak",
    emoji: "🏆",
    tier: "gold",
    progress: (p) => ({ current: p.dailyStreak, target: 30 }),
    unlocked: (p) => p.dailyStreak >= 30,
  },
  {
    id: "polymath",
    name: "Polymath",
    description: "Answer 10+ questions in 6 different categories",
    emoji: "🌍",
    tier: "gold",
    progress: (p) => ({ current: countedCategories(p), target: 6 }),
    unlocked: (p) => countedCategories(p) >= 6,
  },
  {
    id: "level-10",
    name: "Veteran",
    description: "Reach level 10",
    emoji: "🎖️",
    tier: "gold",
    progress: (p) => ({ current: levelFromXp(p.xp), target: 10 }),
    unlocked: (p) => levelFromXp(p.xp) >= 10,
  },
];

export const TIER_STYLES: Record<AchievementTier, string> = {
  bronze: "from-amber-500/25 to-amber-700/10 text-amber-600 dark:text-amber-400",
  silver: "from-slate-400/25 to-slate-500/10 text-slate-500 dark:text-slate-300",
  gold: "from-yellow-400/30 to-amber-600/10 text-yellow-600 dark:text-yellow-400",
};

/**
 * Returns achievements newly satisfied by the updated profile, and a profile
 * with their unlock timestamps recorded.
 */
export function grantAchievements(
  profile: Profile,
  session: SessionContext | null
): { profile: Profile; unlocked: Achievement[] } {
  const unlocked: Achievement[] = [];
  const achievements = { ...profile.achievements };

  for (const achievement of ACHIEVEMENTS) {
    if (achievements[achievement.id]) continue;
    if (achievement.unlocked(profile, session)) {
      achievements[achievement.id] = new Date().toISOString();
      unlocked.push(achievement);
    }
  }

  if (unlocked.length === 0) return { profile, unlocked };
  return { profile: { ...profile, achievements }, unlocked };
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { Difficulty, QuizConfig } from "@/types/quiz";
import { CONFIG_KEY } from "@/lib/storage";
import { useHydrated } from "@/lib/client-state";
import { useSettings } from "./SettingsProvider";

export interface QuizConfigProps {
  onStartQuiz: (config: QuizConfig) => void;
  isLoading: boolean;
}

export const CATEGORIES: { name: string; emoji: string }[] = [
  { name: "General Knowledge", emoji: "🧩" },
  { name: "Science", emoji: "🔬" },
  { name: "History", emoji: "🏛️" },
  { name: "Geography", emoji: "🗺️" },
  { name: "Literature", emoji: "📖" },
  { name: "Mathematics", emoji: "➗" },
  { name: "Sports", emoji: "⚽" },
  { name: "Entertainment", emoji: "🎬" },
];

const DIFFICULTIES: {
  value: Difficulty | "mixed";
  label: string;
  emoji: string;
}[] = [
  { value: "mixed", label: "Mixed", emoji: "🎲" },
  { value: "easy", label: "Easy", emoji: "🌱" },
  { value: "medium", label: "Medium", emoji: "🔥" },
  { value: "hard", label: "Hard", emoji: "💀" },
];

const LENGTHS = [5, 10, 15, 20, 30];

const PRESETS: {
  id: string;
  label: string;
  sub: string;
  emoji: string;
  build: () => QuizConfig;
}[] = [
  {
    id: "blitz",
    label: "Blitz",
    sub: "5 questions · timed",
    emoji: "⚡",
    build: () => ({
      categories: [],
      difficulty: "mixed",
      amount: 5,
      timed: true,
    }),
  },
  {
    id: "classic",
    label: "Classic",
    sub: "10 questions · timed",
    emoji: "🎯",
    build: () => ({
      categories: [],
      difficulty: "mixed",
      amount: 10,
      timed: true,
    }),
  },
  {
    id: "brutal",
    label: "Brutal",
    sub: "10 hard · timed",
    emoji: "💀",
    build: () => ({
      categories: [],
      difficulty: "hard",
      amount: 10,
      timed: true,
    }),
  },
  {
    id: "surprise",
    label: "Surprise me",
    sub: "Random everything",
    emoji: "🎁",
    build: () => {
      const shuffled = [...CATEGORIES].sort(() => Math.random() - 0.5);
      const pick = shuffled.slice(0, 2 + Math.floor(Math.random() * 3));
      const difficulties: (Difficulty | "mixed")[] = [
        "mixed",
        "easy",
        "medium",
        "hard",
      ];
      return {
        categories: pick.map((c) => c.name),
        difficulty:
          difficulties[Math.floor(Math.random() * difficulties.length)],
        amount: LENGTHS[Math.floor(Math.random() * LENGTHS.length)],
        timed: true,
      };
    },
  },
];

const DEFAULT_CONFIG: QuizConfig = {
  categories: [],
  difficulty: "mixed",
  amount: 10,
  timed: true,
};

function loadConfig(): QuizConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      difficulty: parsed.difficulty ?? "mixed",
      amount: LENGTHS.includes(parsed.amount) ? parsed.amount : 10,
      timed: parsed.timed !== false,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export default function QuizConfigPanel({
  onStartQuiz,
  isLoading,
}: QuizConfigProps) {
  const { fx } = useSettings();
  const hydrated = useHydrated();
  const [showCustom, setShowCustom] = useState(false);

  // The saved config is the baseline; edits in this session override it.
  const saved = useMemo(
    () => (hydrated ? loadConfig() : DEFAULT_CONFIG),
    [hydrated]
  );
  const [edited, setEdited] = useState<QuizConfig | null>(null);
  const config = edited ?? saved;

  useEffect(() => {
    if (!edited) return;
    try {
      window.localStorage.setItem(CONFIG_KEY, JSON.stringify(edited));
    } catch {
      /* storage blocked — the choice simply won't be remembered */
    }
  }, [edited]);

  const patch = (next: Partial<QuizConfig>) => {
    fx("select");
    setEdited({ ...config, ...next });
  };

  const toggleCategory = (name: string) => {
    fx("select");
    setEdited({
      ...config,
      categories: config.categories.includes(name)
        ? config.categories.filter((c) => c !== name)
        : [...config.categories, name],
    });
  };

  const start = (override?: QuizConfig) => {
    fx("click");
    onStartQuiz(override ?? config);
  };

  const selectedLabel =
    config.categories.length === 0
      ? "All categories"
      : config.categories.length === 1
      ? config.categories[0]
      : `${config.categories.length} categories`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* ------------------------------------------------------------ presets */}
      <div className="mb-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            disabled={isLoading}
            onClick={() => start(preset.build())}
            className="card sheen group flex flex-col items-start gap-0.5 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift active:translate-y-0 disabled:opacity-60"
          >
            <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
              {preset.emoji}
            </span>
            <span className="mt-1 text-sm font-bold text-ink">
              {preset.label}
            </span>
            <span className="text-[0.7rem] font-medium text-subtle">
              {preset.sub}
            </span>
          </button>
        ))}
      </div>

      {/* ----------------------------------------------------- custom builder */}
      <div className="card overflow-hidden">
        <button
          onClick={() => {
            fx("click");
            setShowCustom((v) => !v);
          }}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-surface-2"
          aria-expanded={showCustom}
        >
          <div className="min-w-0">
            <div className="text-sm font-bold text-ink">Build your own</div>
            <div className="truncate text-xs text-subtle">
              {selectedLabel} · {config.difficulty} · {config.amount} questions ·{" "}
              {config.timed ? "timed" : "relaxed"}
            </div>
          </div>
          <span
            className={`shrink-0 text-subtle transition-transform duration-300 ${
              showCustom ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {showCustom && (
          <div className="animate-rise space-y-7 border-t border-line p-5 sm:p-6">
            {/* categories */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-subtle">
                  Categories
                </h3>
                <button
                  onClick={() => patch({ categories: [] })}
                  className="text-xs font-semibold text-brand transition hover:underline"
                >
                  Use all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => {
                  const active = config.categories.includes(category.name);
                  return (
                    <button
                      key={category.name}
                      onClick={() => toggleCategory(category.name)}
                      className={`flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                        active
                          ? "border-brand bg-brand text-brand-contrast shadow-card"
                          : "border-line bg-surface-2 text-muted hover:border-brand/40 hover:text-ink"
                      }`}
                    >
                      <span aria-hidden="true">{category.emoji}</span>
                      {category.name}
                    </button>
                  );
                })}
              </div>
              {config.categories.length === 0 && (
                <p className="mt-2.5 text-xs text-subtle">
                  Nothing picked — questions come from every category.
                </p>
              )}
            </section>

            {/* difficulty */}
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-subtle">
                Difficulty
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DIFFICULTIES.map((option) => {
                  const active = config.difficulty === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => patch({ difficulty: option.value })}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition active:scale-95 ${
                        active
                          ? "border-brand bg-brand text-brand-contrast shadow-card"
                          : "border-line bg-surface-2 text-muted hover:border-brand/40 hover:text-ink"
                      }`}
                    >
                      <span className="mr-1" aria-hidden="true">
                        {option.emoji}
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* length */}
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-subtle">
                Length
              </h3>
              <div className="flex flex-wrap gap-2">
                {LENGTHS.map((length) => {
                  const active = config.amount === length;
                  return (
                    <button
                      key={length}
                      onClick={() => patch({ amount: length })}
                      className={`tnum min-w-14 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition active:scale-95 ${
                        active
                          ? "border-brand bg-brand text-brand-contrast shadow-card"
                          : "border-line bg-surface-2 text-muted hover:border-brand/40 hover:text-ink"
                      }`}
                    >
                      {length}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* pace */}
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-subtle">
                Pace
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <PaceOption
                  active={config.timed}
                  onClick={() => patch({ timed: true })}
                  emoji="⏱️"
                  title="Timed"
                  desc="Countdown per question, speed bonus points"
                />
                <PaceOption
                  active={!config.timed}
                  onClick={() => patch({ timed: false })}
                  emoji="🧘"
                  title="Relaxed"
                  desc="No clock — think as long as you like"
                />
              </div>
            </section>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------- start */}
      <button
        onClick={() => start()}
        disabled={isLoading}
        className="sheen mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-base font-extrabold text-brand-contrast shadow-lift transition hover:bg-brand-strong active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Dealing questions…
          </>
        ) : (
          <>
            Start {config.amount} questions
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </div>
  );
}

function PaceOption({
  active,
  onClick,
  emoji,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border-2 p-3.5 text-left transition active:scale-[0.98] ${
        active
          ? "border-brand bg-brand-soft"
          : "border-line bg-surface-2 hover:border-brand/40"
      }`}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true">{emoji}</span>
        <span
          className={`text-sm font-bold ${active ? "text-brand" : "text-ink"}`}
        >
          {title}
        </span>
        {active && <span className="ml-auto text-brand">✓</span>}
      </div>
      <p className="mt-1 text-xs text-muted">{desc}</p>
    </button>
  );
}

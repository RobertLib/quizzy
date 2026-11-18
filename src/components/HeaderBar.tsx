"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { levelProgress } from "@/lib/scoring";
import type { Profile } from "@/lib/storage";
import { useSettings } from "./SettingsProvider";
import { useLocale, useUi } from "./LocaleProvider";
import LanguageSwitch from "./LanguageSwitch";
import { pathFor } from "@/i18n/routes";

interface HeaderBarProps {
  profile: Profile;
  ready: boolean;
  onResetProgress: () => void;
  /** Called for every header link; may cancel it to confirm leaving a round. */
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export default function HeaderBar({
  profile,
  ready,
  onResetProgress,
  onNavigate,
}: HeaderBarProps) {
  const { settings, setTheme, toggleSound, toggleHaptics, resolvedTheme, fx } =
    useSettings();
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const ui = useUi();
  const t = ui.header;
  const home = pathFor({ page: "home" }, locale);
  const nav = [
    { href: pathFor({ page: "daily" }, locale), label: t.daily, short: t.dailyShort },
    { href: pathFor({ page: "topics" }, locale), label: t.topics, short: t.topics },
  ];

  const progress = levelProgress(profile.xp);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2.5">
        <Link
          href={home}
          onClick={(event) => onNavigate(event, home)}
          className="flex items-center gap-2"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-linear-to-br from-brand to-streak text-base shadow-card">
            🧠
          </span>
          <span className="brand-gradient-text text-lg font-extrabold tracking-tight">
            Quizzy
          </span>
        </Link>

        <nav aria-label={t.mainNav} className="ml-1 flex items-center gap-0.5 sm:ml-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => onNavigate(event, item.href)}
              className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-semibold text-muted transition hover:bg-surface hover:text-ink sm:text-sm"
            >
              {item.short === item.label ? (
                item.label
              ) : (
                <>
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {ready && profile.dailyStreak > 0 && (
            <div
              className="flex items-center gap-1 rounded-xl bg-streak/10 px-2 py-1.5 ring-1 ring-streak/25"
              title={t.dailyStreak(profile.dailyStreak)}
            >
              <span className="text-sm leading-none">🔥</span>
              <span className="tnum text-xs font-bold text-streak-text">
                {profile.dailyStreak}
              </span>
            </div>
          )}

          {ready && (
            <div
              className="hidden items-center gap-2 rounded-xl bg-surface px-2.5 py-1.5 ring-1 ring-line sm:flex"
              title={t.xpToNext(progress.xpIntoLevel, progress.xpForNextLevel, progress.level + 1)}
            >
              <span className="text-xs font-bold text-brand">
                {t.levelShort(progress.level)}
              </span>
              <span className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-3">
                <span
                  className="block h-full rounded-full bg-linear-to-r from-brand to-streak transition-[width] duration-700"
                  style={{ width: `${progress.percent}%` }}
                />
              </span>
            </div>
          )}

          <LanguageSwitch variant="header" onNavigate={onNavigate} />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                fx("click");
                setOpen((v) => !v);
              }}
              aria-label={t.settings}
              aria-expanded={open}
              className="grid size-9 place-items-center rounded-xl text-muted ring-1 ring-line transition hover:bg-surface hover:text-ink"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4.5"
                fill="none"
                strokeWidth={2}
                stroke="currentColor"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
              </svg>
            </button>

            {open && (
              <div className="card animate-flyin absolute right-0 mt-2 w-64 overflow-hidden p-2">
                <div className="px-2 pb-1.5 pt-1 text-[0.7rem] font-bold uppercase tracking-wider text-subtle">
                  {t.appearance}
                </div>
                <div className="mb-2 grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
                  {(["light", "system", "dark"] as const).map((option) => (
                    <button
                      key={option}
                      aria-pressed={settings.theme === option}
                      aria-label={t.themeLabel(t.themes[option])}
                      onClick={() => {
                        fx("select");
                        setTheme(option);
                      }}
                      className={`rounded-lg py-1.5 text-xs font-semibold capitalize transition ${
                        settings.theme === option
                          ? "bg-surface text-brand shadow-card"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {option === "light" ? "☀️" : option === "dark" ? "🌙" : "💻"}
                      <span className="ml-1 hidden sm:inline">{t.themes[option]}</span>
                    </button>
                  ))}
                </div>

                <ToggleRow
                  label={t.sound}
                  emoji="🔊"
                  checked={settings.sound}
                  onChange={toggleSound}
                />
                <ToggleRow
                  label={t.vibration}
                  emoji="📳"
                  checked={settings.haptics}
                  onChange={toggleHaptics}
                />

                <div className="mt-2 border-t border-line pt-2">
                  {confirmReset ? (
                    <div className="px-2 pb-1">
                      <p className="mb-2 text-xs text-muted">
                        {t.resetQuestion}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onResetProgress();
                            setConfirmReset(false);
                            setOpen(false);
                          }}
                          className="flex-1 rounded-lg bg-bad px-2 py-1.5 text-xs font-bold text-white"
                        >
                          {t.delete}
                        </button>
                        <button
                          onClick={() => setConfirmReset(false)}
                          className="flex-1 rounded-lg bg-surface-2 px-2 py-1.5 text-xs font-semibold text-muted"
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmReset(true)}
                      className="w-full rounded-lg px-2 py-2 text-left text-xs font-semibold text-muted transition hover:bg-bad-soft hover:text-bad-text"
                    >
                      🗑️ {t.reset}
                    </button>
                  )}
                </div>

                <p className="px-2 pt-1.5 text-[0.65rem] text-subtle">
                  {t.footnote(t.themes[resolvedTheme])}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function ToggleRow({
  label,
  emoji,
  checked,
  onChange,
}: {
  label: string;
  emoji: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-surface-2"
    >
      <span aria-hidden="true">{emoji}</span>
      <span className="flex-1 text-xs font-semibold text-ink">{label}</span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          checked ? "bg-brand" : "bg-line-strong"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${
            checked ? "left-4.5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  type Settings,
  type ThemePreference,
} from "@/lib/storage";
import { useHydrated, useSystemDark } from "@/lib/client-state";
import { cue, setSoundEnabled, type SoundName } from "@/lib/sound";

interface SettingsValue {
  settings: Settings;
  /** True once localStorage has been read on the client. */
  ready: boolean;
  setTheme: (theme: ThemePreference) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  /** Fire a sound + haptic cue honouring the player's preferences. */
  fx: (name: SoundName) => void;
  resolvedTheme: "light" | "dark";
}

const SettingsContext = createContext<SettingsValue | null>(null);

export default function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useHydrated();
  const systemDark = useSystemDark();

  // Stored settings are the baseline; local edits override them until reload.
  const stored = useMemo(
    () => (hydrated ? loadSettings() : defaultSettings),
    [hydrated]
  );
  const [edited, setEdited] = useState<Settings | null>(null);
  const settings = edited ?? stored;

  const resolvedTheme: "light" | "dark" =
    settings.theme === "system"
      ? systemDark
        ? "dark"
        : "light"
      : settings.theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    setSoundEnabled(settings.sound);
  }, [settings.sound]);

  const persist = useCallback((next: Settings) => {
    setEdited(next);
    saveSettings(next);
  }, []);

  const value = useMemo<SettingsValue>(
    () => ({
      settings,
      ready: hydrated,
      resolvedTheme,
      setTheme: (theme) => persist({ ...settings, theme }),
      toggleSound: () => persist({ ...settings, sound: !settings.sound }),
      toggleHaptics: () => persist({ ...settings, haptics: !settings.haptics }),
      fx: (name) =>
        cue(name, { sound: settings.sound, haptics: settings.haptics }),
    }),
    [settings, hydrated, resolvedTheme, persist]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}

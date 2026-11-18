/**
 * Languages the site is published in. English lives at the root ("/daily"),
 * every other language under its own prefix ("/cs/denni") with its own
 * slugs — see routes.ts.
 */
export const LOCALES = ["en", "cs"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** BCP 47 tag for Intl formatting (numbers, dates). */
export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  cs: "cs-CZ",
};

/** Open Graph `og:locale`. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB",
  cs: "cs_CZ",
};

/** The language's name in itself, for the language switcher. */
export const LOCALE_NAME: Record<Locale, string> = {
  en: "English",
  cs: "Čeština",
};

/** "1,240" / "1 240" — points, player counts. */
export function formatNumber(value: number, locale: Locale): string {
  // English keeps the US grouping the site has always shown.
  return value.toLocaleString(locale === "en" ? "en-US" : INTL_LOCALE[locale]);
}

/** Czech has three plural forms: 1 otázka, 2–4 otázky, 5+ otázek. */
export function czPlural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  if (abs === 1) return one;
  if (abs >= 2 && abs <= 4) return few;
  return many;
}

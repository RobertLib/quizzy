import type { Locale } from "@/i18n/config";

/**
 * The eight topics. Client-safe and small: the longer page copy for each
 * topic lives in category-content.ts, which only the topic pages import.
 */
export interface Category {
  /**
   * The internal key — matches `QuizQuestion.category` and the player's
   * stored stats, so it stays English whatever the page language.
   */
  name: string;
  /** What the player sees. */
  label: Record<Locale, string>;
  /** URL segment of the topic page, per language. */
  slug: Record<Locale, string>;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "General Knowledge",
    label: { en: "General Knowledge", cs: "Všeobecný přehled" },
    slug: { en: "general-knowledge", cs: "vseobecny-prehled" },
    emoji: "🧩",
  },
  {
    name: "Science",
    label: { en: "Science", cs: "Věda" },
    slug: { en: "science", cs: "veda" },
    emoji: "🔬",
  },
  {
    name: "History",
    label: { en: "History", cs: "Historie" },
    slug: { en: "history", cs: "historie" },
    emoji: "🏛️",
  },
  {
    name: "Geography",
    label: { en: "Geography", cs: "Zeměpis" },
    slug: { en: "geography", cs: "zemepis" },
    emoji: "🗺️",
  },
  {
    name: "Literature",
    label: { en: "Literature", cs: "Literatura" },
    slug: { en: "literature", cs: "literatura" },
    emoji: "📖",
  },
  {
    name: "Mathematics",
    label: { en: "Mathematics", cs: "Matematika" },
    slug: { en: "mathematics", cs: "matematika" },
    emoji: "➗",
  },
  {
    name: "Sports",
    label: { en: "Sports", cs: "Sport" },
    slug: { en: "sports", cs: "sport" },
    emoji: "⚽",
  },
  {
    name: "Entertainment",
    label: { en: "Entertainment", cs: "Zábava" },
    slug: { en: "entertainment", cs: "zabava" },
    emoji: "🎬",
  },
];

export function categoryBySlug(slug: string, locale: Locale): Category | undefined {
  return CATEGORIES.find((c) => c.slug[locale] === slug);
}

export function categoryByName(name: string): Category | undefined {
  return CATEGORIES.find((c) => c.name === name);
}

/** A question's category as the player should see it. */
export function categoryLabel(name: string, locale: Locale): string {
  return categoryByName(name)?.label[locale] ?? name;
}

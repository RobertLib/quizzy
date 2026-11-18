import { CATEGORIES, type Category } from "@/data/categories";
import { LOCALES, type Locale } from "./config";

/**
 * Every public page, independent of language. A route renders to a different
 * path per locale; `pathFor` and `parsePath` are each other's inverse, which
 * is what lets the language switcher land on the same page in the other
 * language.
 */
export type Route =
  | { page: "home" }
  | { page: "topics" }
  | { page: "topic"; category: Category }
  | { page: "daily" }
  | { page: "day"; date: string }
  | { page: "challenge"; date: string; result: string }
  | { page: "embed" };

interface Segments {
  /** "" for the default language, "/cs" otherwise. */
  prefix: string;
  topics: string;
  daily: string;
  challenge: string;
  embed: string;
}

const SEGMENTS: Record<Locale, Segments> = {
  en: { prefix: "", topics: "trivia", daily: "daily", challenge: "c", embed: "embed/daily" },
  cs: { prefix: "/cs", topics: "kvizy", daily: "denni", challenge: "vyzva", embed: "embed/denni" },
};

export function pathFor(route: Route, locale: Locale): string {
  const s = SEGMENTS[locale];
  switch (route.page) {
    case "home":
      return s.prefix || "/";
    case "topics":
      return `${s.prefix}/${s.topics}`;
    case "topic":
      return `${s.prefix}/${s.topics}/${route.category.slug[locale]}`;
    case "daily":
      return `${s.prefix}/${s.daily}`;
    case "day":
      return `${s.prefix}/${s.daily}/${route.date}`;
    case "challenge":
      return `${s.prefix}/${s.challenge}/${route.date}/${route.result}`;
    case "embed":
      return `${s.prefix}/${s.embed}`;
  }
}

/** The path of a route in every language, for hreflang alternates. */
export function pathsFor(route: Route): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, pathFor(route, l)])) as Record<
    Locale,
    string
  >;
}

/** The locale a path belongs to, from its prefix. */
export function localeOfPath(pathname: string): Locale {
  for (const locale of LOCALES) {
    const { prefix } = SEGMENTS[locale];
    if (prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return locale;
    }
  }
  return "en";
}

/** Which page a path shows, or null for one this map doesn't know. */
export function parsePath(pathname: string): { locale: Locale; route: Route | null } {
  const locale = localeOfPath(pathname);
  const s = SEGMENTS[locale];
  const rest = pathname.slice(s.prefix.length).replace(/\/+$/, "");
  const parts = rest.split("/").filter(Boolean);

  if (parts.length === 0) return { locale, route: { page: "home" } };
  if (parts.join("/") === s.embed) return { locale, route: { page: "embed" } };

  const [first, second, third] = parts;
  if (first === s.topics) {
    if (parts.length === 1) return { locale, route: { page: "topics" } };
    const category = CATEGORIES.find((c) => c.slug[locale] === second);
    if (category && parts.length === 2) return { locale, route: { page: "topic", category } };
  }
  if (first === s.daily) {
    if (parts.length === 1) return { locale, route: { page: "daily" } };
    if (parts.length === 2) return { locale, route: { page: "day", date: second } };
  }
  if (first === s.challenge && parts.length === 3) {
    return { locale, route: { page: "challenge", date: second, result: third } };
  }
  return { locale, route: null };
}

/** The same page in another language — its home page if there's no match. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const { route } = parsePath(pathname);
  return pathFor(route ?? { page: "home" }, to);
}

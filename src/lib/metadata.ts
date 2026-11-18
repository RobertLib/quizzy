import type { Metadata } from "next";
import { LOCALES, OG_LOCALE, type Locale } from "@/i18n/config";
import { pathFor, pathsFor, type Route } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import { SITE_NAME } from "./site";

/*
 * Metadata helpers for pages. Kept apart from site.ts, which client code
 * imports, because the page text they read must stay out of the browser.
 */

/** Default link preview (1200×630). Pages with their own image override it. */
export function ogImage(locale: Locale) {
  return {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: PAGES[locale].meta.ogAlt,
  };
}


/**
 * hreflang links for a page that exists in every language: each language's
 * own path, with English as the fallback for everyone else.
 */
export function languageAlternates(route: Route): Record<string, string> {
  const paths = pathsFor(route);
  return { ...paths, "x-default": paths.en };
}

/**
 * Per-page metadata. Next merges metadata shallowly, so every page sets its
 * own canonical and Open Graph block — otherwise it would inherit the home
 * page's and tell search engines it is a duplicate of "/".
 */
export function pageMetadata({
  locale,
  route,
  title,
  description,
  noindex = false,
  absoluteTitle = false,
}: {
  locale: Locale;
  route: Route;
  title: string;
  description: string;
  noindex?: boolean;
  /** Use the title as-is instead of appending " · Quizzy". */
  absoluteTitle?: boolean;
}): Metadata {
  const path = pathFor(route, locale);
  const image = ogImage(locale);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path, languages: languageAlternates(route) },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

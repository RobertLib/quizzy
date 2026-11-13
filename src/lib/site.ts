import type { Metadata } from "next";

/**
 * Canonical origin of the site. Set NEXT_PUBLIC_SITE_URL when the site moves
 * to its own domain — every absolute URL (canonicals, sitemap, share links)
 * is built from this one value.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quizzy-eight-khaki.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Quizzy";

/** Default link preview (1200×630). Pages with their own image override it. */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Quizzy — free daily trivia quiz",
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Per-page metadata. Next merges metadata shallowly, so every page sets its
 * own canonical and Open Graph block — otherwise it would inherit the home
 * page's and tell search engines it is a duplicate of "/".
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  /** Use the title as-is instead of appending " · Quizzy". */
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

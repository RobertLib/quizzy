
/**
 * Canonical origin of the site. Set NEXT_PUBLIC_SITE_URL when the site moves
 * to its own domain — every absolute URL (canonicals, sitemap, share links)
 * is built from this one value.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quizzy-eight-khaki.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Quizzy";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

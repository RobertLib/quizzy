import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { LOCALES } from "@/i18n/config";
import { pathFor, pathsFor, type Route } from "@/i18n/routes";
import { addDays, archiveKeys } from "@/lib/daily";
import { absoluteUrl } from "@/lib/site";

// New archive days appear daily.
export const revalidate = 3600;

type Entry = Omit<MetadataRoute.Sitemap[number], "url">;

/** One entry per language, each listing all of them as hreflang alternates. */
function everyLanguage(route: Route, entry: Entry): MetadataRoute.Sitemap {
  const paths = pathsFor(route);
  const languages = Object.fromEntries(
    Object.entries(paths).map(([locale, path]) => [locale, absoluteUrl(path)])
  );
  return LOCALES.map((locale) => ({
    url: absoluteUrl(pathFor(route, locale)),
    ...entry,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const archive = archiveKeys(now);

  return [
    ...everyLanguage({ page: "home" }, { lastModified: now, changeFrequency: "daily", priority: 1 }),
    ...everyLanguage({ page: "daily" }, { lastModified: now, changeFrequency: "daily", priority: 0.9 }),
    ...everyLanguage({ page: "topics" }, { changeFrequency: "weekly", priority: 0.8 }),
    ...CATEGORIES.flatMap((category) =>
      everyLanguage({ page: "topic", category }, { changeFrequency: "weekly", priority: 0.8 })
    ),
    ...archive.flatMap((date) =>
      everyLanguage(
        { page: "day", date },
        {
          // Answers are published two days after the day itself.
          lastModified: new Date(`${addDays(date, 2)}T00:00:00Z`),
          changeFrequency: "yearly",
          priority: 0.5,
        }
      )
    ),
  ];
}

import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { addDays, archiveKeys } from "@/lib/daily";
import { absoluteUrl } from "@/lib/site";

// New archive days appear daily.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const archive = archiveKeys(now);

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/daily"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/trivia"), changeFrequency: "weekly", priority: 0.8 },
    ...CATEGORIES.map((category) => ({
      url: absoluteUrl(`/trivia/${category.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...archive.map((key) => ({
      url: absoluteUrl(`/daily/${key}`),
      // Answers are published two days after the day itself.
      lastModified: new Date(`${addDays(key, 2)}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}

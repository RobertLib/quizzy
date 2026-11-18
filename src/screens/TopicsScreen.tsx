import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CATEGORIES } from "@/data/categories";
import { categoryContent } from "@/data/category-content";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import { topicQuestions } from "@/lib/daily-questions";
import { pageMetadata } from "@/lib/metadata";

export function topicsMetadata(locale: Locale) {
  const { meta } = PAGES[locale];
  return pageMetadata({
    locale,
    route: { page: "topics" },
    title: meta.topicsTitle,
    description: meta.topicsDescription,
  });
}

export default function TopicsScreen({ locale }: { locale: Locale }) {
  const { topics } = PAGES[locale];
  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs locale={locale} items={[{ name: topics.crumb, route: { page: "topics" } }]} />

      <h1 className="text-balance text-3xl font-extrabold tracking-tight text-ink">
        {topics.title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {topics.lead}
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((category) => {
          const content = categoryContent(category.name, locale);
          const names = { label: category.label[locale], quiz: content.quiz };
          return (
            <li key={category.name}>
              <Link
                href={pathFor({ page: "topic", category }, locale)}
                className="card group flex h-full items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift"
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {category.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-ink">
                    {topics.cardTitle(names)}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{content.tagline}</span>
                  <span className="mt-2 block text-xs font-semibold text-brand">
                    {topics.count(topicQuestions(category.name).length)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuestionList from "@/components/QuestionList";
import { CategoryPlayButtons } from "@/components/PlayButtons";
import { CATEGORIES, categoryBySlug, type Category } from "@/data/categories";
import { categoryContent } from "@/data/category-content";
import { localizeQuestions } from "@/data/questions/localize";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import { topicQuestions } from "@/lib/daily-questions";
import { pageMetadata } from "@/lib/metadata";
import type { Difficulty } from "@/types/quiz";

const LEVELS: Difficulty[] = ["easy", "medium", "hard"];

export function topicStaticParams(locale: Locale) {
  return CATEGORIES.map((category) => ({ category: category.slug[locale] }));
}

function names(category: Category, locale: Locale) {
  return { label: category.label[locale], quiz: categoryContent(category.name, locale).quiz };
}

export function topicMetadata(locale: Locale, slug: string): Metadata {
  const category = categoryBySlug(slug, locale);
  if (!category) return {};
  const { meta } = PAGES[locale];
  const count = topicQuestions(category.name).length;
  const topic = names(category, locale);
  return pageMetadata({
    locale,
    route: { page: "topic", category },
    title: meta.topicTitle(topic, count),
    description: meta.topicDescription(topic, categoryContent(category.name, locale).tagline, count),
  });
}

export default function TopicScreen({ locale, slug }: { locale: Locale; slug: string }) {
  const category = categoryBySlug(slug, locale);
  if (!category) notFound();

  const { topic: t, topics } = PAGES[locale];
  const content = categoryContent(category.name, locale);
  const topic = names(category, locale);
  const questions = localizeQuestions(topicQuestions(category.name), locale);
  const others = CATEGORIES.filter((c) => c.name !== category.name);
  const groups = LEVELS.map((level) => ({
    level,
    items: questions.filter((q) => q.difficulty === level),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: topics.crumb, route: { page: "topics" } },
          { name: topic.label, route: { page: "topic", category } },
        ]}
      />

      <header className="card relative mb-8 overflow-hidden p-6 sm:p-8">
        <div className="mb-3 text-4xl">{category.emoji}</div>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-ink">
          {t.title(topic)}
        </h1>
        {content.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {paragraph}
          </p>
        ))}
        <div className="mt-6">
          <CategoryPlayButtons category={category.name} />
        </div>
      </header>

      <section aria-labelledby="questions-heading">
        <h2 id="questions-heading" className="mb-1 text-xl font-extrabold text-ink">
          {t.questionsHeading(topic, questions.length)}
        </h2>
        <p className="mb-6 text-sm text-muted">{t.hint}</p>

        {groups.map((group, index) => (
          <section key={group.level} className="mb-8" aria-labelledby={`${group.level}-heading`}>
            <h3 id={`${group.level}-heading`} className="mb-3 px-1 text-base font-bold text-ink">
              {t.levelHeading(topic, group.level)}
            </h3>
            <QuestionList
              locale={locale}
              questions={group.items}
              start={1 + groups.slice(0, index).reduce((n, g) => n + g.items.length, 0)}
              headingLevel={4}
            />
          </section>
        ))}
      </section>

      <section className="card mt-4 p-5" aria-labelledby="more-heading">
        <h2 id="more-heading" className="mb-3 text-sm font-bold text-ink">
          {t.moreTopics}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((other) => (
            <li key={other.name}>
              <Link
                href={pathFor({ page: "topic", category: other }, locale)}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3 py-2 text-xs font-semibold text-muted transition hover:border-brand/40 hover:text-ink"
              >
                <span aria-hidden="true">{other.emoji}</span>
                {other.label[locale]}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={pathFor({ page: "daily" }, locale)}
              className="flex items-center gap-1.5 rounded-xl border border-brand/30 bg-brand-soft px-3 py-2 text-xs font-semibold text-brand transition hover:border-brand"
            >
              {t.dailyLink}
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

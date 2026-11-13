import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuestionList from "@/components/QuestionList";
import { CategoryPlayButtons } from "@/components/PlayButtons";
import { CATEGORIES, categoryBySlug } from "@/data/categories";
import { questionsInCategory } from "@/data/questions";
import type { Difficulty } from "@/types/quiz";
import { pageMetadata } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

type Props = { params: Promise<{ category: string }> };

/** One copy of each question — the original bank has a few repeats. */
function uniqueQuestions(name: string) {
  const seen = new Set<string>();
  return questionsInCategory(name).filter((q) => {
    const key = q.question.toLowerCase().replace(/\W+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categoryBySlug((await params).category);
  if (!category) return {};
  const count = uniqueQuestions(category.name).length;
  return pageMetadata({
    title: `${category.name} Trivia Quiz — ${count} Questions with Answers`,
    description: `Free ${category.name.toLowerCase()} trivia quiz: ${category.tagline} Play a timed round or browse ${count} questions with answers and explanations.`,
    path: `/trivia/${category.slug}`,
  });
}

const LEVELS: { value: Difficulty; heading: string }[] = [
  { value: "easy", heading: "Easy" },
  { value: "medium", heading: "Medium" },
  { value: "hard", heading: "Hard" },
];

export default async function CategoryPage({ params }: Props) {
  const category = categoryBySlug((await params).category);
  if (!category) notFound();

  const questions = uniqueQuestions(category.name);
  const lower = category.name.toLowerCase();
  const others = CATEGORIES.filter((c) => c.slug !== category.slug);
  const groups = LEVELS.map((level) => ({
    ...level,
    items: questions.filter((q) => q.difficulty === level.value),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[
          { name: "Topics", path: "/trivia" },
          { name: category.name, path: `/trivia/${category.slug}` },
        ]}
      />

      <header className="card relative mb-8 overflow-hidden p-6 sm:p-8">
        <div className="mb-3 text-4xl">{category.emoji}</div>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-ink">
          {category.name} trivia quiz
        </h1>
        {category.intro.map((paragraph) => (
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
          {questions.length} {lower} trivia questions and answers
        </h2>
        <p className="mb-6 text-sm text-muted">
          Tap &ldquo;Show answer&rdquo; to check yourself. Hosting a quiz? You&apos;re
          welcome to use these.
        </p>

        {groups.map((group, index) => (
          <section key={group.value} className="mb-8" aria-labelledby={`${group.value}-heading`}>
            <h2 id={`${group.value}-heading`} className="mb-3 px-1 text-base font-bold text-ink">
              {group.heading} {lower} questions
            </h2>
            <QuestionList
              questions={group.items}
              start={1 + groups.slice(0, index).reduce((n, g) => n + g.items.length, 0)}
            />
          </section>
        ))}
      </section>

      <section className="card mt-4 p-5" aria-labelledby="more-heading">
        <h2 id="more-heading" className="mb-3 text-sm font-bold text-ink">
          More trivia topics
        </h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/trivia/${other.slug}`}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3 py-2 text-xs font-semibold text-muted transition hover:border-brand/40 hover:text-ink"
              >
                <span aria-hidden="true">{other.emoji}</span>
                {other.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/daily"
              className="flex items-center gap-1.5 rounded-xl border border-brand/30 bg-brand-soft px-3 py-2 text-xs font-semibold text-brand transition hover:border-brand"
            >
              📅 Daily challenge
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

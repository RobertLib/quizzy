import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CATEGORIES } from "@/data/categories";
import { questionsInCategory } from "@/data/questions";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Trivia Questions by Topic — Free Quizzes with Answers",
  description:
    "Free trivia quizzes in eight topics — general knowledge, science, history, geography, literature, maths, sports and entertainment. Play a timed round or browse every question with its answer.",
  path: "/trivia",
});

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs items={[{ name: "Topics", path: "/trivia" }]} />

      <h1 className="text-balance text-3xl font-extrabold tracking-tight text-ink">
        Trivia questions by topic
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Pick a topic to play a quick timed round, or browse its full list of
        questions with answers and explanations — free to use for your own
        quiz night.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/trivia/${category.slug}`}
              className="card group flex h-full items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift"
            >
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                {category.emoji}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-bold text-ink">
                  {category.name} trivia
                </span>
                <span className="mt-0.5 block text-sm text-muted">{category.tagline}</span>
                <span className="mt-2 block text-xs font-semibold text-brand">
                  {questionsInCategory(category.name).length} questions with answers →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

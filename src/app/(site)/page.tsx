import Link from "next/link";
import DailyCard from "@/components/DailyCard";
import QuizConfigPanel from "@/components/QuizConfig";
import StatsPanel from "@/components/StatsPanel";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { CATEGORIES } from "@/data/categories";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Quizzy — Free Daily Trivia Quiz with Answers",
  description:
    "A free trivia quiz with a new daily challenge: beat the clock, build streaks for up to ×3 points, unlock badges and challenge friends. Eight categories, three difficulties, no sign-up.",
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE_NAME,
          description:
            "Free trivia game with a daily challenge, timed rounds, streak multipliers, levels and badges",
          url: SITE_URL,
          applicationCategory: "GameApplication",
          operatingSystem: "Web Browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Person", name: "Robert Libsansky" },
        }}
      />

      <div className="mx-auto mb-7 max-w-3xl text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">
          Free daily trivia quiz
        </p>
        <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          How much do you{" "}
          <span className="brand-gradient-text">actually</span> know?
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted sm:text-base">
          Beat the clock, build a streak, climb the levels — then dare a friend
          to beat today&apos;s score.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <DailyCard />
      </div>

      <QuizConfigPanel />

      <div className="mx-auto max-w-3xl">
        <StatsPanel />
      </div>

      <section className="mx-auto mt-10 max-w-3xl" aria-labelledby="topics-heading">
        <div className="mb-4 flex items-baseline justify-between px-1">
          <h2 id="topics-heading" className="text-lg font-extrabold text-ink">
            Trivia by topic
          </h2>
          <Link href="/trivia" className="text-xs font-semibold text-brand hover:underline">
            All topics →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/trivia/${category.slug}`}
              className="card group flex flex-col gap-1 p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                {category.emoji}
              </span>
              <span className="text-sm font-bold text-ink">{category.name}</span>
              <span className="text-[0.7rem] text-subtle">Questions & answers</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard
            emoji="🔥"
            title="Streaks that pay"
            text="Three right in a row starts a multiplier — up to ×3 on every point you bank."
          />
          <FeatureCard
            emoji="⚔️"
            title="Challenge a friend"
            text="Share your daily result and your friend gets the same eight questions — with your score to beat."
          />
          <FeatureCard
            emoji="💡"
            title="Learn as you go"
            text="Daily questions come with a short explanation, so even a wrong answer teaches you something."
          />
        </div>
      </div>

      <FAQ />
    </>
  );
}

function FeatureCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-5">
      <div className="mb-2 text-2xl">{emoji}</div>
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
    </div>
  );
}

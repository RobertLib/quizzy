import Link from "next/link";
import DailyCard from "@/components/DailyCard";
import QuizConfigPanel from "@/components/QuizConfig";
import StatsPanel from "@/components/StatsPanel";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import { CATEGORIES } from "@/data/categories";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export function homeMetadata(locale: Locale) {
  const { meta } = PAGES[locale];
  return pageMetadata({
    locale,
    route: { page: "home" },
    title: meta.homeTitle,
    description: meta.homeDescription,
    absoluteTitle: true,
  });
}

export default function HomeScreen({ locale }: { locale: Locale }) {
  const { home, meta } = PAGES[locale];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE_NAME,
          description: meta.appDescription,
          url: absoluteUrl(pathFor({ page: "home" }, locale)),
          inLanguage: locale,
          applicationCategory: "GameApplication",
          operatingSystem: "Web Browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Person", name: "Robert Libsansky" },
        }}
      />

      <div className="mx-auto mb-7 max-w-3xl text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">
          {home.eyebrow}
        </p>
        <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {home.titleBefore}
          <span className="brand-gradient-text">{home.titleEmphasis}</span>
          {home.titleAfter}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted sm:text-base">{home.lead}</p>
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
            {home.topicsHeading}
          </h2>
          <Link
            href={pathFor({ page: "topics" }, locale)}
            className="text-xs font-semibold text-brand hover:underline"
          >
            {home.allTopics}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={pathFor({ page: "topic", category }, locale)}
              className="card group flex flex-col gap-1 p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                {category.emoji}
              </span>
              <span className="text-sm font-bold text-ink">{category.label[locale]}</span>
              <span className="text-[0.7rem] text-subtle">{home.topicCardSub}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-3">
          {home.features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      <FAQ locale={locale} />
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

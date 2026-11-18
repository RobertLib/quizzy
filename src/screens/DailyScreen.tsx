import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import DailyCard from "@/components/DailyCard";
import EmbedCode from "@/components/EmbedCode";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import { archiveKeys, dailyNumber, formatDateKey } from "@/lib/daily";
import { pageMetadata } from "@/lib/metadata";

export function dailyMetadata(locale: Locale) {
  const { meta } = PAGES[locale];
  return pageMetadata({
    locale,
    route: { page: "daily" },
    title: meta.dailyTitle,
    description: meta.dailyDescription,
  });
}

export default function DailyScreen({ locale }: { locale: Locale }) {
  const { daily } = PAGES[locale];
  const archive = archiveKeys();

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs locale={locale} items={[{ name: daily.crumb, route: { page: "daily" } }]} />

      <h1 className="text-balance text-3xl font-extrabold tracking-tight text-ink">
        {daily.title}
      </h1>
      <p className="mb-6 mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {daily.lead}
      </p>

      <DailyCard showArchiveLink={false} />

      <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label={daily.howItWorks}>
        {daily.features.map(({ emoji, title, text }) => (
          <div key={title} className="card p-4">
            <div className="text-xl">{emoji}</div>
            <h2 className="mt-1 text-sm font-bold text-ink">{title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section id="archive" className="mt-10 scroll-mt-20" aria-labelledby="archive-heading">
        <h2 id="archive-heading" className="mb-1 text-xl font-extrabold text-ink">
          {daily.archiveHeading}
        </h2>
        <p className="mb-4 text-sm text-muted">{daily.archiveLead}</p>
        {archive.length === 0 ? (
          <p className="card p-5 text-sm text-muted">{daily.archiveEmpty}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {archive.map((key) => (
              <li key={key}>
                <Link
                  href={pathFor({ page: "day", date: key }, locale)}
                  className="card flex items-center justify-between gap-3 px-4 py-3 transition hover:border-brand/40 hover:shadow-lift"
                >
                  <span className="text-sm font-bold text-ink">
                    {daily.archiveItem(dailyNumber(key))}
                  </span>
                  <span className="text-xs text-subtle">{formatDateKey(key, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="embed" className="card mt-10 scroll-mt-20 p-5 sm:p-6" aria-labelledby="embed-heading">
        <h2 id="embed-heading" className="text-lg font-extrabold text-ink">
          {daily.embedHeading}
        </h2>
        <p className="mb-4 mt-1 text-sm text-muted">{daily.embedLead}</p>
        <EmbedCode />
      </section>
    </div>
  );
}

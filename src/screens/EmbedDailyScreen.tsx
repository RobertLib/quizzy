import type { Metadata } from "next";
import DailyCard from "@/components/DailyCard";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import { absoluteUrl } from "@/lib/site";

export function embedMetadata(locale: Locale): Metadata {
  return {
    title: PAGES[locale].meta.embedTitle,
    alternates: { canonical: pathFor({ page: "daily" }, locale) },
  };
}

export default function EmbedDailyScreen({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto max-w-3xl">
      <DailyCard showArchiveLink={false} />
      <p className="text-center text-xs text-subtle">
        <a
          href={absoluteUrl(pathFor({ page: "daily" }, locale))}
          target="_blank"
          rel="noopener"
          className="font-semibold text-brand hover:underline"
        >
          {PAGES[locale].embedPage.credit}
        </a>
      </p>
    </div>
  );
}

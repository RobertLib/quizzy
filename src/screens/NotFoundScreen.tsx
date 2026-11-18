import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";

export default function NotFoundScreen({ locale }: { locale: Locale }) {
  const t = PAGES[locale].notFound;
  return (
    <div className="app-shell grid min-h-screen place-items-center px-4">
      <div className="card relative z-10 max-w-sm p-8 text-center">
        <div className="mb-3 text-4xl">🧭</div>
        <h1 className="mb-2 text-lg font-extrabold text-ink">{t.title}</h1>
        <p className="mb-6 text-sm text-muted">{t.text}</p>
        <div className="flex flex-col gap-2">
          <Link
            href={pathFor({ page: "home" }, locale)}
            className="rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-brand-contrast shadow-lift transition hover:bg-brand-strong"
          >
            {t.play}
          </Link>
          <Link
            href={pathFor({ page: "daily" }, locale)}
            className="rounded-2xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-muted transition hover:text-ink"
          >
            {t.daily}
          </Link>
        </div>
      </div>
    </div>
  );
}

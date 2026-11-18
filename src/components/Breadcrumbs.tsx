import Link from "next/link";
import JsonLd, { breadcrumbs } from "./JsonLd";
import type { Locale } from "@/i18n/config";
import { pathFor, type Route } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import { SITE_URL } from "@/lib/site";

export interface Crumb {
  name: string;
  route: Route;
}

/** Visible trail plus BreadcrumbList structured data. The last item is the current page. */
export default function Breadcrumbs({ locale, items }: { locale: Locale; items: Crumb[] }) {
  const t = PAGES[locale].breadcrumbs;
  const trail = [{ name: t.home, route: { page: "home" } as Route }, ...items].map((crumb) => ({
    name: crumb.name,
    path: pathFor(crumb.route, locale),
  }));
  return (
    <>
      <JsonLd data={breadcrumbs(trail, SITE_URL)} />
      <nav aria-label={t.label} className="mb-4 text-xs text-subtle">
        <ol className="flex flex-wrap items-center gap-1.5">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-semibold text-muted">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="hover:text-ink hover:underline">
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true">›</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

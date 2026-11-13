import Link from "next/link";
import JsonLd, { breadcrumbs } from "./JsonLd";
import { SITE_URL } from "@/lib/site";

export interface Crumb {
  name: string;
  path: string;
}

/** Visible trail plus BreadcrumbList structured data. The last item is the current page. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbs(trail, SITE_URL)} />
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-subtle">
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

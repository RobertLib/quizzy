"use client";

import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_NAME } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/routes";
import { useLocale } from "./LocaleProvider";

/**
 * Links to the page being viewed in every other language. Plain <a>: each
 * language has its own root layout, so switching is a full page load anyway.
 */
export default function LanguageSwitch({
  variant,
  onNavigate,
}: {
  variant: "header" | "footer";
  /** Lets the header ask before abandoning a round in progress. */
  onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const locale = useLocale();
  const pathname = usePathname() ?? "/";
  const others = LOCALES.filter((l) => l !== locale);

  if (variant === "header") {
    return (
      <>
        {others.map((other) => {
          const href = switchLocalePath(pathname, other);
          return (
            <a
              key={other}
              href={href}
              hrefLang={other}
              lang={other}
              onClick={(event) => onNavigate?.(event, href)}
              title={LOCALE_NAME[other]}
              aria-label={LOCALE_NAME[other]}
              className="grid h-9 min-w-9 place-items-center rounded-xl px-2 text-xs font-bold uppercase text-muted ring-1 ring-line transition hover:bg-surface hover:text-ink"
            >
              {other}
            </a>
          );
        })}
      </>
    );
  }

  return (
    <ul className="flex items-center justify-center gap-3">
      {LOCALES.map((l) => (
        <li key={l}>
          {l === locale ? (
            <span aria-current="true" className="font-semibold text-muted">
              {LOCALE_NAME[l]}
            </span>
          ) : (
            <a
              href={switchLocalePath(pathname, l)}
              hrefLang={l}
              lang={l}
              className="text-subtle hover:text-ink hover:underline"
            >
              {LOCALE_NAME[l]}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

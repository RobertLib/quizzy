"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { themeScript } from "@/lib/theme-script";
import { localeOfPath } from "@/i18n/routes";
import { UI } from "@/i18n/ui";

/**
 * Last-resort boundary for errors in the root layout itself. It replaces the
 * whole document, so it brings its own <html>, styles and theme.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  // It replaces both languages' root layouts, so the path is all it has.
  const locale = localeOfPath(usePathname() ?? "/");
  const t = UI[locale].error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <title>{t.documentTitle}</title>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <div className="app-shell grid min-h-screen place-items-center px-4">
          <div className="card relative z-10 max-w-sm p-8 text-center">
            <div className="mb-3 text-4xl">🫠</div>
            <h1 className="mb-2 text-lg font-extrabold text-ink">{t.globalTitle}</h1>
            <p className="mb-6 text-sm text-muted">{t.globalText}</p>
            <button
              onClick={() => retry()}
              className="w-full rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-brand-contrast shadow-lift transition hover:bg-brand-strong"
            >
              {t.retry}
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import NotFoundScreen from "@/screens/NotFoundScreen";
import { geistSans } from "@/lib/fonts";
import { themeScript } from "@/lib/theme-script";
import { PAGES } from "@/i18n/pages";

/**
 * 404 for URLs no route matches. It replaces the root layouts, so it brings
 * its own document, styles and theme. Unmatched Czech paths never get here —
 * app/(cs)/cs/[...missing] answers them with the Czech 404.
 */
export const metadata: Metadata = {
  title: `${PAGES.en.notFound.title} · Quizzy`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <NotFoundScreen locale="en" />
      </body>
    </html>
  );
}

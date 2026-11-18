import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import SettingsProvider from "@/components/SettingsProvider";
import LocaleProvider from "@/components/LocaleProvider";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ogImage } from "@/lib/metadata";
import { themeScript } from "@/lib/theme-script";
import { geistSans } from "@/lib/fonts";
import { OG_LOCALE, type Locale } from "@/i18n/config";
import { PAGES } from "@/i18n/pages";

/*
 * The <html> document shared by every language's root layout. Each language
 * is its own root layout (app/(en) and app/(cs)/cs) so that `<html lang>` is
 * right in the server-rendered HTML; switching language is a full page load.
 */

export const rootViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a17" },
  ],
};

export function rootMetadata(locale: Locale): Metadata {
  const { meta } = PAGES[locale];
  const image = ogImage(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.homeTitle,
      template: "%s · Quizzy",
    },
    description: meta.homeDescription,
    applicationName: SITE_NAME,
    authors: [{ name: "Robert Libsansky" }],
    creator: "Robert Libsansky",
    publisher: "Robert Libsansky",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALE[locale],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      images: [image.url],
    },
  };
}

export default function RootDocument({
  locale,
  children,
}: Readonly<{
  locale: Locale;
  children: React.ReactNode;
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      {/* The rule only knows app/layout; this is that layout, shared per language. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <LocaleProvider locale={locale}>
          <SettingsProvider>{children}</SettingsProvider>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}

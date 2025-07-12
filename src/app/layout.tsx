import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import SettingsProvider from "@/components/SettingsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a17" },
  ],
};

export const metadata: Metadata = {
  title: "Quizzy — Trivia with streaks, levels and a daily challenge",
  description:
    "A fast trivia game: beat the clock, build streaks for up to ×3 points, unlock badges and keep a daily streak alive. Eight categories, three difficulties, no sign-up.",
  keywords: [
    "quiz",
    "trivia",
    "trivia game",
    "daily challenge",
    "knowledge",
    "education",
    "streaks",
    "questions",
    "answers",
    "interactive",
  ],
  authors: [{ name: "Robert Libsansky" }],
  creator: "Robert Libsansky",
  publisher: "Robert Libsansky",
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://quizzy-eight-khaki.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Quizzy — Trivia with streaks, levels and a daily challenge",
    description:
      "Beat the clock, build streaks for up to ×3 points, unlock badges and keep your daily streak alive.",
    type: "website",
    url: "/",
  },
};

/**
 * Applies the stored theme before first paint so there is no light-mode flash.
 * Mirrors the SETTINGS_KEY used by src/lib/storage.ts.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('quizzy:settings:v1');var t=s?JSON.parse(s).theme:'system';var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Quizzy",
    description:
      "Interactive trivia game with timed rounds, streak multipliers, levels, badges and a daily challenge",
    url: "https://quizzy-eight-khaki.vercel.app",
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Robert Libsansky",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <SettingsProvider>
          <main>{children}</main>
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}

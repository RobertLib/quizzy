import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import SettingsProvider from "@/components/SettingsProvider";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import { themeScript } from "@/lib/theme-script";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Quizzy — Free Daily Trivia Quiz with Answers",
    template: "%s · Quizzy",
  },
  description:
    "A free trivia quiz with a new daily challenge: beat the clock, build streaks for up to ×3 points, unlock badges and challenge friends. Eight categories, three difficulties, no sign-up.",
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
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <SettingsProvider>{children}</SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}

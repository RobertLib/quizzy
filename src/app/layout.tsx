import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quizzy - Interactive Quiz App | Test Your Knowledge",
  description:
    "Test your knowledge with Quizzy, an interactive quiz application. Choose from various categories and difficulty levels. Fun and educational quizzes for everyone!",
  keywords: [
    "quiz",
    "trivia",
    "knowledge",
    "education",
    "fun",
    "test",
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
  themeColor: "#3b82f6",
};

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
      "Interactive quiz application for testing knowledge across various categories",
    url: "https://quizzy-eight-khaki.vercel.app",
    applicationCategory: "Educational",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <div className="font-[family-name:var(--font-geist-sans)]">
          <main>
            {children}
            <Analytics />
          </main>
        </div>
      </body>
    </html>
  );
}

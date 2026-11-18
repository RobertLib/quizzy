import type { Metadata } from "next";
import QuizHost from "@/components/QuizHost";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

/** Chrome-free shell for iframes on other sites. */
export default function EmbedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <QuizHost embed>{children}</QuizHost>;
}

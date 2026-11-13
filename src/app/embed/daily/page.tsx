import type { Metadata } from "next";
import DailyCard from "@/components/DailyCard";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Daily trivia",
  alternates: { canonical: "/daily" },
};

export default function EmbedDailyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <DailyCard showArchiveLink={false} />
      <p className="text-center text-xs text-subtle">
        <a
          href={`${SITE_URL}/daily`}
          target="_blank"
          rel="noopener"
          className="font-semibold text-brand hover:underline"
        >
          Daily trivia by Quizzy ↗
        </a>
      </p>
    </div>
  );
}

import { NextResponse } from "next/server";
import { dailyNumber, isPlayableKey } from "@/lib/daily";
import { buildDailyQuiz } from "@/lib/daily-questions";
import { localizeQuestions } from "@/data/questions/localize";
import { isLocale } from "@/i18n/config";

/**
 * One day's daily set. Served from here rather than bundled so the question
 * bank stays out of the client JavaScript.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  if (!isPlayableKey(date)) {
    return NextResponse.json({ error: "No daily for that day" }, { status: 404 });
  }

  // ?lang=cs — the same questions, in another language.
  const lang = new URL(request.url).searchParams.get("lang") ?? "en";
  const locale = isLocale(lang) ? lang : "en";

  return NextResponse.json(
    {
      date,
      number: dailyNumber(date),
      questions: localizeQuestions(buildDailyQuiz(date), locale),
    },
    // A day's set never changes; a deploy purges the CDN anyway.
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } }
  );
}

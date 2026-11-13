import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChallengePlay } from "@/components/PlayButtons";
import { DAILY_QUESTION_COUNT, dailyNumber, formatDateKey, isPlayableKey } from "@/lib/daily";
import { SITE_NAME } from "@/lib/site";
import { correctIn, parseChallenge } from "@/lib/challenge";
import GridSquares from "@/components/ui/GridSquares";

type Props = { params: Promise<{ date: string; result: string }> };

async function load(params: Props["params"]) {
  const { date, result } = await params;
  const challenge = parseChallenge(result);
  if (!isPlayableKey(date) || !challenge) return null;
  return { date, challenge, correct: correctIn(challenge.grid) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const title = `Can you beat ${data.correct}/${DAILY_QUESTION_COUNT} on Quizzy Daily #${dailyNumber(data.date)}?`;
  const description = `A friend scored ${data.correct}/${DAILY_QUESTION_COUNT} (${data.challenge.points.toLocaleString("en-US")} pts) on the daily trivia challenge for ${formatDateKey(data.date)}. Same ${DAILY_QUESTION_COUNT} questions — your turn.`;
  return {
    title: { absolute: title },
    description,
    // Endless score variations of one page: keep them out of the index and
    // point search engines at the day itself.
    robots: { index: false, follow: true },
    alternates: { canonical: `/daily/${data.date}` },
    openGraph: { title, description, type: "website", siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ChallengePage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  const { date, challenge, correct } = data;

  return (
    <div className="mx-auto max-w-xl">
      <div className="card relative overflow-hidden p-6 text-center sm:p-8">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "radial-gradient(20rem 12rem at 85% 0%, var(--streak), transparent 70%), radial-gradient(18rem 12rem at 0% 100%, var(--brand), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            ⚔️ You&apos;ve been challenged
          </p>
          <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-ink">
            Can you beat {correct}/{DAILY_QUESTION_COUNT}?
          </h1>
          <p className="mt-2 text-sm text-muted">
            A friend scored {challenge.points.toLocaleString("en-US")} points on Daily
            #{dailyNumber(date)} ({formatDateKey(date)}).
          </p>
          <div className="my-5">
            <GridSquares grid={challenge.grid} size="lg" />
          </div>
          <div className="flex justify-center">
            <ChallengePlay dateKey={date} challenge={challenge} />
          </div>
          <p className="mt-5 text-xs text-subtle">
            Same {DAILY_QUESTION_COUNT} questions, timed. Free, no sign-up.
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        New to Quizzy?{" "}
        <Link href="/" className="font-semibold text-brand hover:underline">
          See what else you can play →
        </Link>
      </p>
    </div>
  );
}

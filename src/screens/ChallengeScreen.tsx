import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ImageResponse } from "next/og";
import { ChallengePlay } from "@/components/PlayButtons";
import GridSquares from "@/components/ui/GridSquares";
import { OG_LOCALE, type Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import { UI } from "@/i18n/ui";
import { DAILY_QUESTION_COUNT, dailyNumber, formatDateKey, isPlayableKey } from "@/lib/daily";
import { correctIn, parseChallenge } from "@/lib/challenge";
import { SITE_NAME } from "@/lib/site";

export type ChallengeParams = Promise<{ date: string; result: string }>;

async function load(params: ChallengeParams) {
  const { date, result } = await params;
  const challenge = parseChallenge(result);
  if (!isPlayableKey(date) || !challenge) return null;
  return { date, challenge, correct: correctIn(challenge.grid) };
}

export async function challengeMetadata(locale: Locale, params: ChallengeParams): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { meta } = PAGES[locale];
  const title = meta.challengeTitle(data.correct, DAILY_QUESTION_COUNT, dailyNumber(data.date));
  const description = meta.challengeDescription(
    data.correct,
    DAILY_QUESTION_COUNT,
    data.challenge.points,
    formatDateKey(data.date, locale)
  );
  return {
    title: { absolute: title },
    description,
    // Endless score variations of one page: keep them out of the index and
    // point search engines at the day itself.
    robots: { index: false, follow: true },
    alternates: { canonical: pathFor({ page: "day", date: data.date }, locale) },
    openGraph: { title, description, type: "website", siteName: SITE_NAME, locale: OG_LOCALE[locale] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ChallengeScreen({
  locale,
  params,
}: {
  locale: Locale;
  params: ChallengeParams;
}) {
  const data = await load(params);
  if (!data) notFound();
  const { date, challenge, correct } = data;
  const { challenge: t } = PAGES[locale];

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
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{t.eyebrow}</p>
          <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-ink">
            {t.title(correct, DAILY_QUESTION_COUNT)}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {t.scored(challenge.points, dailyNumber(date), formatDateKey(date, locale))}
          </p>
          <div className="my-5">
            <GridSquares
              grid={challenge.grid}
              size="lg"
              label={UI[locale].common.gridLabel(correct, challenge.grid.length)}
            />
          </div>
          <div className="flex justify-center">
            <ChallengePlay dateKey={date} challenge={challenge} />
          </div>
          <p className="mt-5 text-xs text-subtle">{t.footnote(DAILY_QUESTION_COUNT)}</p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {t.newHere}{" "}
        <Link href={pathFor({ page: "home" }, locale)} className="font-semibold text-brand hover:underline">
          {t.seeMore}
        </Link>
      </p>
    </div>
  );
}

const SQUARE = { g: "#22c55e", y: "#facc15", r: "#ef4444" } as const;

export const challengeImageSize = { width: 1200, height: 630 };

/** The link preview is what gets the challenge tapped, so it shows the score. */
export async function challengeImage(locale: Locale, params: ChallengeParams) {
  const { date, result } = await params;
  const { challenge: t } = PAGES[locale];
  const challenge = parseChallenge(result);
  const valid = challenge && isPlayableKey(date);
  const correct = valid ? correctIn(challenge.grid) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1b1436 0%, #0c0a17 55%, #2a1440 100%)",
          color: "#f3f0fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#a486f5" }}>
          {valid ? t.imageHeading(dailyNumber(date)) : t.imageFallbackHeading}
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, marginTop: 18 }}>
          {valid ? `${correct}/${DAILY_QUESTION_COUNT}` : t.imageFallbackScore}
        </div>
        {valid && (
          <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
            {[...challenge.grid].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 18,
                  background: SQUARE[c as keyof typeof SQUARE],
                }}
              />
            ))}
          </div>
        )}
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, marginTop: 40, color: "#ff9142" }}>
          {valid ? t.imagePoints(challenge.points) : t.imageFallback(DAILY_QUESTION_COUNT)}
        </div>
      </div>
    ),
    challengeImageSize
  );
}

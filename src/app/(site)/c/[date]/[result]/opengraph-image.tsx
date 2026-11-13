import { ImageResponse } from "next/og";
import { DAILY_QUESTION_COUNT, dailyNumber, isPlayableKey } from "@/lib/daily";
import { correctIn, parseChallenge } from "@/lib/challenge";

export const alt = "A friend's Quizzy daily trivia score — can you beat it?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SQUARE = { g: "#22c55e", y: "#facc15", r: "#ef4444" } as const;

/** The link preview is what gets the challenge tapped, so it shows the score. */
export default async function Image({
  params,
}: {
  params: Promise<{ date: string; result: string }>;
}) {
  const { date, result } = await params;
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
          {valid ? `Quizzy Daily #${dailyNumber(date)}` : "Quizzy Daily"}
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, marginTop: 18 }}>
          {valid ? `${correct}/${DAILY_QUESTION_COUNT}` : "Daily trivia"}
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
          {valid
            ? `${challenge.points.toLocaleString("en-US")} pts — can you beat it?`
            : "8 questions. Same for everyone."}
        </div>
      </div>
    ),
    size
  );
}

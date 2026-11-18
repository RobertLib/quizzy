import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { QuizAnswer, QuizSession } from "@/types/quiz";
import { maxPointsFor, parseChallenge, shareUrlFor } from "@/lib/challenge";
import { SITE_URL } from "@/lib/site";

describe("challenge links", () => {
  it("know the real ceiling of a daily", () => {
    // 2×300 at ×1, 3×450 at ×1.5, 3×600 at ×2.
    assert.equal(maxPointsFor(8), 3750);
    assert.equal(maxPointsFor(0), 0);
  });

  it("accept scores the grid could have produced", () => {
    assert.deepEqual(parseChallenge("ggyrgggr-1240"), { grid: "ggyrgggr", points: 1240 });
    assert.deepEqual(parseChallenge("gggggggg-3750"), { grid: "gggggggg", points: 3750 });
    assert.deepEqual(parseChallenge("rrrrrrrr-0"), { grid: "rrrrrrrr", points: 0 });
  });

  it("reject scores it couldn't", () => {
    assert.equal(parseChallenge("gggggggg-3751"), null); // above the maximum
    assert.equal(parseChallenge("rrrrrrrr-7200"), null); // points for nothing
    assert.equal(parseChallenge("gggggggg-700"), null); // under 100 per right answer
    assert.equal(parseChallenge("gggggggg-01240"), null); // leading zero
    assert.equal(parseChallenge("gggg-400"), null); // wrong length
    assert.equal(parseChallenge("ggggxggg-800"), null);
  });
});

describe("shared results", () => {
  const answers: QuizAnswer[] = Array.from({ length: 8 }, (_, i) => ({
    question: `Q${i}`,
    userAnswer: "A",
    correctAnswer: "A",
    isCorrect: i !== 3,
    category: "Science",
    difficulty: "easy",
    timeSpent: 4,
    points: i !== 3 ? 100 : 0,
    streak: 0,
    skipped: false,
  }));
  const session = (mode: QuizSession["mode"]): QuizSession => ({
    questions: [],
    config: { categories: [], difficulty: "mixed", amount: 8, timed: true },
    mode,
    dailyKey: "2026-11-13",
  });

  it("challenge a friend to the same daily", () => {
    assert.equal(shareUrlFor(session("daily"), answers, 700), `${SITE_URL}/c/2026-11-13/gggrgggg-700`);
    assert.equal(shareUrlFor(session("archive"), answers, 700), `${SITE_URL}/c/2026-11-13/gggrgggg-700`);
  });

  it("don't turn a practice replay into a challenge", () => {
    assert.equal(shareUrlFor(session("practice"), answers, 700), `${SITE_URL}/daily/2026-11-13`);
  });

  it("link to the page in the player's language", () => {
    assert.equal(
      shareUrlFor(session("daily"), answers, 700, "cs"),
      `${SITE_URL}/cs/vyzva/2026-11-13/gggrgggg-700`
    );
    assert.equal(shareUrlFor(session("practice"), answers, 700, "cs"), `${SITE_URL}/cs/denni/2026-11-13`);
    const topic: QuizSession = {
      questions: [],
      config: { categories: ["Geography"], difficulty: "mixed", amount: 10, timed: true },
      mode: "custom",
    };
    assert.equal(shareUrlFor(topic, [], 0, "cs"), `${SITE_URL}/cs/kvizy/zemepis`);
    assert.equal(shareUrlFor(topic, [], 0), `${SITE_URL}/trivia/geography`);
  });
});

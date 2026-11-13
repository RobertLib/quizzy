import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { QuizAnswer } from "@/types/quiz";
import {
  applySession,
  dailyResultFor,
  emptyProfile,
  hasPlayedDaily,
  markDailyPlayed,
  markDailyStarted,
  type Profile,
} from "@/lib/storage";

const answer = (isCorrect: boolean): QuizAnswer => ({
  question: "Q",
  userAnswer: "A",
  correctAnswer: "A",
  isCorrect,
  category: "Science",
  difficulty: "easy",
  timeSpent: 4,
  points: isCorrect ? 100 : 0,
  streak: 0,
  skipped: false,
});

describe("daily streak", () => {
  it("continues from yesterday's daily", () => {
    const day1 = markDailyPlayed(emptyProfile, "2026-11-12");
    const day2 = markDailyPlayed(day1, "2026-11-13");
    assert.equal(day2.dailyStreak, 2);
    assert.equal(day2.dailyBestStreak, 2);
    assert.equal(day2.dailyLastPlayed, "2026-11-13");
    assert.deepEqual(day2.dailyCompleted, ["2026-11-13", "2026-11-12"]);
  });

  it("starts over after a missed day", () => {
    const played = markDailyPlayed(
      { ...emptyProfile, dailyStreak: 5, dailyBestStreak: 5, dailyLastPlayed: "2026-11-10" },
      "2026-11-13"
    );
    assert.equal(played.dailyStreak, 1);
    assert.equal(played.dailyBestStreak, 5);
  });

  it("counts a day once", () => {
    const once = markDailyPlayed(emptyProfile, "2026-11-13");
    assert.equal(markDailyPlayed(once, "2026-11-13"), once);
  });

  it("is decided by the daily's date, not the clock at the finish", () => {
    // Started on the 13th, finished after midnight: the round still belongs
    // to the 13th, and the 14th's daily stays open.
    const started = markDailyPlayed(
      { ...emptyProfile, dailyStreak: 3, dailyLastPlayed: "2026-11-12" },
      "2026-11-13"
    );
    const finished = applySession(started, {
      answers: [answer(true)],
      points: 100,
      bestStreak: 1,
      mode: "daily",
      dailyKey: "2026-11-13",
    });
    assert.equal(finished.dailyStreak, 4);
    assert.equal(finished.dailyLastPlayed, "2026-11-13");
    assert.ok(!hasPlayedDaily(finished, "2026-11-14"));
    assert.equal(dailyResultFor(finished, "2026-11-13")?.correct, 1);
  });
});

describe("daily results", () => {
  it("are found by the daily's date whatever the timezone", () => {
    const profile: Profile = {
      ...emptyProfile,
      history: [
        {
          // Finished at 23:30 UTC — already the next day east of Greenwich.
          date: "2026-11-13T23:30:00.000Z",
          mode: "daily",
          points: 900,
          correct: 6,
          total: 8,
          dailyKey: "2026-11-13",
        },
      ],
    };
    assert.equal(dailyResultFor(profile, "2026-11-13")?.correct, 6);
    assert.equal(dailyResultFor(profile, "2026-11-14"), undefined);
  });

  it("fall back to the local date for entries saved before dailyKey", () => {
    // 00:30 local time on the 13th, wherever the tests run.
    const date = new Date(2026, 10, 13, 0, 30).toISOString();
    const profile: Profile = {
      ...emptyProfile,
      history: [{ date, mode: "daily", points: 500, correct: 4, total: 8 }],
    };
    assert.equal(dailyResultFor(profile, "2026-11-13")?.correct, 4);
  });

  it("make a replay practice", () => {
    const archived = applySession(emptyProfile, {
      answers: [answer(false)],
      points: 0,
      bestStreak: 0,
      mode: "archive",
      dailyKey: "2026-11-05",
    });
    assert.ok(hasPlayedDaily(archived, "2026-11-05"));
    assert.ok(!hasPlayedDaily(archived, "2026-11-06"));
  });

  it("outlive the trimmed history", () => {
    let profile = applySession(emptyProfile, {
      answers: [answer(true), answer(false)],
      points: 100,
      bestStreak: 1,
      mode: "archive",
      dailyKey: "2026-11-05",
    });
    for (let i = 0; i < 40; i++) {
      profile = applySession(profile, {
        answers: [answer(true)],
        points: 100,
        bestStreak: 1,
        mode: "custom",
      });
    }
    assert.ok(!profile.history.some((entry) => entry.dailyKey === "2026-11-05"));
    assert.ok(hasPlayedDaily(profile, "2026-11-05"));
    assert.deepEqual(dailyResultFor(profile, "2026-11-05"), { correct: 1, total: 2, points: 100 });
  });

  it("count an archive day as used from the moment it starts", () => {
    const started = markDailyStarted(emptyProfile, "2026-11-05");
    assert.ok(hasPlayedDaily(started, "2026-11-05"));
    assert.equal(dailyResultFor(started, "2026-11-05"), undefined);
    assert.equal(started.dailyStreak, 0);
    assert.deepEqual(started.dailyCompleted, []);

    // Finishing it later records the result once.
    const finished = applySession(started, {
      answers: [answer(true)],
      points: 100,
      bestStreak: 1,
      mode: "archive",
      dailyKey: "2026-11-05",
    });
    assert.equal(dailyResultFor(finished, "2026-11-05")?.correct, 1);
  });
});

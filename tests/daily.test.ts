import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { questionBank, questionsInCategory } from "@/data/questions";
import {
  addDays,
  dayNumber,
  isDateKey,
  isPlayableKey,
  isRevealed,
  latestRevealedKey,
  utcKey,
} from "@/lib/daily";
import {
  MAX_PER_CATEGORY,
  SCHEDULE_START,
  buildDailyQuiz,
  createDailySchedule,
  topicQuestions,
  unrevealedDailyIds,
} from "@/lib/daily-questions";

const ids = (key: string) => buildDailyQuiz(key).map((q) => q.id).join(",");

function* days(from: string, to: string) {
  for (let key = from; key <= to; key = addDays(key, 1)) yield key;
}

describe("daily schedule", () => {
  it("never changes a day that has already been played", () => {
    // Recorded from the original formula. If this fails, a change to the
    // schedule or the bank has rewritten history — see batches.ts.
    const played: Record<string, string> = {
      "2026-11-01": "q005,q051,q009,q096,q017,q003,q039,q059",
      "2026-11-02": "q118,q087,q058,q122,q109,q076,q014,q027",
      "2026-11-03": "q052,q098,q004,q007,q068,q028,q050,q037",
      "2026-11-04": "q082,q124,q084,q055,q123,q062,q044,q019",
      "2026-11-05": "q111,q045,q091,q023,q102,q099,q069,q033",
      "2026-11-06": "q048,q047,q053,q008,q086,q116,q107,q060",
      "2026-11-07": "q071,q073,q075,q056,q018,q078,q120,q016",
      "2026-11-08": "q025,q081,q070,q104,q101,q057,q013,q011",
      "2026-11-09": "q093,q067,q125,q001,q110,q049,q034,q115",
      "2026-11-10": "q094,q083,q030,q106,q021,q036,q090,q108",
      "2026-11-11": "q103,q061,q006,q105,q079,q041,q114,q020",
      "2026-11-12": "q092,q035,q038,q012,q121,q031,q002,q097",
      "2026-11-13": "q024,q029,q010,q042,q046,q015,q089,q119",
      "2026-11-14": "q100,q074,q032,q064,q054,q026,q117,q065",
      "2026-11-15": "q072,q080,q113,q077,q040,q085,q112,q043",
    };
    for (const [key, expected] of Object.entries(played)) {
      assert.equal(ids(key), expected, key);
    }
  });

  it("deals eight different questions every day", () => {
    for (const key of days("2026-11-01", "2027-12-31")) {
      const set = buildDailyQuiz(key);
      assert.equal(set.length, 8, key);
      assert.equal(new Set(set.map((q) => q.id)).size, 8, key);
    }
  });

  it("spreads each day across categories", () => {
    for (const key of days(SCHEDULE_START, "2027-12-31")) {
      const perCategory = new Map<string, number>();
      for (const q of buildDailyQuiz(key)) {
        perCategory.set(q.category, (perCategory.get(q.category) ?? 0) + 1);
      }
      assert.ok(Math.max(...perCategory.values()) <= MAX_PER_CATEGORY, key);
    }
  });

  it("rests a question until the rest of the pool has had a turn", () => {
    const lastSeen = new Map<string, string>();
    let shortest = Infinity;
    for (const key of days("2026-11-01", "2027-12-31")) {
      for (const q of buildDailyQuiz(key)) {
        const previous = lastSeen.get(q.id);
        if (previous && key >= SCHEDULE_START) {
          shortest = Math.min(shortest, dayNumber(key) - dayNumber(previous));
        }
        lastSeen.set(q.id, key);
      }
    }
    // 405 questions at 8 a day is a ~50-day cycle.
    assert.ok(shortest >= 45, `a question came back after ${shortest} days`);
  });

  it("leaves earlier days alone when a batch is added", () => {
    const release = "2027-03-01";
    const extra = questionBank.slice(0, 40).map((q, i) => ({
      ...q,
      id: `zz-${String(i).padStart(3, "0")}`,
      since: release,
    }));
    const grown = createDailySchedule([...questionBank, ...extra]);
    for (const key of days("2026-11-01", addDays(release, -1))) {
      assert.equal(grown(key).map((q) => q.id).join(","), ids(key), key);
    }
    assert.notEqual(grown(release).map((q) => q.id).join(","), ids(release));
  });
});

describe("calendar", () => {
  it("validates date keys", () => {
    assert.ok(isDateKey("2026-02-28"));
    assert.ok(!isDateKey("2026-02-30"));
    assert.ok(!isDateKey("2026-2-3"));
  });

  it("publishes answers only once a day is over everywhere", () => {
    // 12:00 UTC on the 13th: the 12th is still "today" in UTC−12.
    const now = new Date("2026-11-13T12:00:00Z");
    assert.equal(latestRevealedKey(now), "2026-11-11");
    assert.ok(isRevealed("2026-11-11", now));
    assert.ok(!isRevealed("2026-11-12", now));
  });

  it("lets a day be played once it has started somewhere", () => {
    const now = new Date("2026-11-13T12:00:00Z");
    assert.ok(isPlayableKey("2026-11-14", now)); // already the 14th in UTC+14
    assert.ok(!isPlayableKey("2026-11-15", now));
    assert.ok(!isPlayableKey("2026-10-31", now)); // before the archive
  });
});

describe("topic pages", () => {
  const now = new Date("2026-11-20T12:00:00Z");

  it("hide every question of a daily whose answers aren't out", () => {
    const hidden = unrevealedDailyIds(now);
    // Every day not yet revealed at `now` — and the next two, for cached pages.
    for (const key of ["2026-11-19", "2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23"]) {
      assert.ok(!isRevealed(key, now));
      for (const q of buildDailyQuiz(key)) assert.ok(hidden.has(q.id), `${key} ${q.id}`);
    }
  });

  it("stay safe when served from a cache that is up to two days old", () => {
    // A page rendered at `rendered` and shown at `shown` must not list any
    // question of a daily that is live at `shown`.
    const start = Date.parse("2026-11-15T00:00:00Z");
    for (let h = 0; h < 72; h++) {
      const rendered = new Date(start + h * 3_600_000);
      const hidden = unrevealedDailyIds(rendered);
      for (let age = 0; age < 48; age++) {
        const shown = new Date(rendered.getTime() + age * 3_600_000);
        const today = utcKey(shown);
        for (const key of [addDays(today, -1), today, addDays(today, 1)]) {
          for (const q of buildDailyQuiz(key)) {
            assert.ok(hidden.has(q.id), `rendered ${rendered.toISOString()}, shown +${age}h: ${key} ${q.id}`);
          }
        }
      }
    }
  });

  it("are never cached longer than that", async () => {
    const { default: config } = await import("../next.config");
    // Revalidation is hourly, and a stale page lives at most `expireTime`.
    assert.ok(config.expireTime !== undefined && 3600 + config.expireTime < 48 * 3600);
  });

  it("list the rest of the topic", () => {
    const hidden = unrevealedDailyIds(now);
    const science = topicQuestions("Science", now);
    assert.ok(science.every((q) => !hidden.has(q.id)));
    assert.equal(
      science.length,
      questionsInCategory("Science").filter((q) => !hidden.has(q.id)).length
    );
  });
});

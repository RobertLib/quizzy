import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { maxPointsFor, parseChallenge } from "@/lib/challenge";

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

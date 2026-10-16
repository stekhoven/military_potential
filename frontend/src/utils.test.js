import test from "node:test";
import assert from "node:assert/strict";
import {
  contrast,
  trend,
  parseRating,
  pruneAssessments,
  missingLanguages,
  effectiveModel,
  sortedRows,
  groupRows,
} from "./utils.js";
test("contrast preserves neutral and missing values and clamps extremes", () => {
  assert.equal(contrast(3, 2), 3);
  assert.equal(contrast(null, 1.25), null);
  assert.equal(contrast(4.8, 2), 5);
  assert.equal(contrast(1.2, 2), 1);
  assert.equal(contrast(3.8, 1.25), 4);
  assert.equal(contrast(2.2, 1.25), 2);
});
test("blank ratings and missing trends remain missing", () => {
  assert.equal(parseRating(""), null);
  assert.equal(parseRating("3"), 3);
  assert.equal(trend([null, 3, 4]), null);
  assert.equal(trend([3, 3, 4]), 1);
});
test("scenario deletion preserves indicator ratings still used in any model", () => {
  const bundle = {
    model: { indicators: [{ id: "base" }] },
    scenarios: [{ id: "s", model: { indicators: [{ id: "new" }] } }],
    actors: [
      {
        assessments: {
          base: { value: 3 },
          new: { value: 4 },
          orphan: { value: 1 },
        },
      },
    ],
  };
  pruneAssessments(bundle);
  assert.deepEqual(Object.keys(bundle.actors[0].assessments), ["base", "new"]);
  assert.equal(effectiveModel(bundle, "s").indicators[0].id, "new");
});
test("missing translations and sort use explicit absence", () => {
  assert.deepEqual(missingLanguages({ de: "a", fr: " ", it: "b" }), ["fr"]);
  assert.deepEqual(
    sortedRows([{ v: null }, { v: 4 }, { v: 2 }], "v").map((r) => r.v),
    [2, 4, null],
  );
});
test("node groups preserve members and the sorted group order", () => {
  assert.deepEqual(
    groupRows([
      { group: "a", id: "1" },
      { group: "b", id: "2" },
      { group: "a", id: "3" },
    ]),
    [
      {
        group: "a",
        members: [
          { group: "a", id: "1" },
          { group: "a", id: "3" },
        ],
      },
      { group: "b", members: [{ group: "b", id: "2" }] },
    ],
  );
});

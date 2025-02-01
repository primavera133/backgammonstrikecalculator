import { expect, test } from "vitest";
import { calcLikelyhood, getDistance, getValidBlockedPips } from "./engine";

test("getValidBlockedPips", () => {
  const blockers = [{ blocked: "1" }, { blocked: "2" }];
  const result = getValidBlockedPips(blockers);

  expect(result).toStrictEqual([1, 2]);

  const blockers2 = [{ blocked: "1" }, { blocked: "" }];
  const result2 = getValidBlockedPips(blockers2);

  expect(result2).toStrictEqual([1]);

  //@ts-expect-error empty array
  const blockers3 = [];
  //@ts-expect-error empty array
  const result3 = getValidBlockedPips(blockers3);

  expect(result3).toStrictEqual([]);
});

test("getDistance", () => {
  const fromPos = "1";
  const toPos = "12";
  expect(getDistance(fromPos, toPos)).toBe(11);
});

test("calcLikelyhood, no blockers", () => {
  let fromPos = "1";
  let toPos = "2";
  let blockers: {
    blocked: string | undefined;
  }[] = [];

  let expected = [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
  ];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);

  fromPos = "5";
  toPos = "6";
  blockers = [];
  expected = [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
  ];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);

  fromPos = "1";
  toPos = "5";
  blockers = [];
  expected = [
    [1, 1],
    [1, 3],
    [1, 4],
    [2, 2],
    [2, 4],
    [3, 4],
    [4, 4],
    [4, 5],
    [4, 6],
  ];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);

  fromPos = "1";
  toPos = "12";
  blockers = [];
  expected = [[5, 6]];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);

  fromPos = "1";
  toPos = "15";
  blockers = [];
  expected = [];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);

  fromPos = "1";
  toPos = "13";
  blockers = [];
  expected = [
    [3, 3],
    [4, 4],
    [6, 6],
  ];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);
});

test("calcLikelyhood, with blockers", () => {
  let fromPos = "1";
  let toPos = "3";
  let blockers: {
    blocked: string | undefined;
  }[] = [{ blocked: "2" }];

  let expected = [
    [1, 2],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
  ];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);

  fromPos = "5";
  toPos = "7";
  blockers = [{ blocked: "6" }];

  expected = [
    [1, 2],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
  ];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);

  fromPos = "1";
  toPos = "7";
  blockers = [{ blocked: "2" }, { blocked: "6" }];

  expected = [
    [1, 6],
    [2, 2],
    [2, 4],
    [2, 6],
    [3, 3],
    [3, 6],
    [4, 6],
    [5, 6],
    [6, 6],
  ];
  expect(calcLikelyhood(fromPos, toPos, blockers)).toStrictEqual(expected);
});

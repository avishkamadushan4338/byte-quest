import { describe, expect, test } from "bun:test";

import { TEAM_LIMITS } from "./router";

const { MIN_MEMBERS, MAX_MEMBERS, REQUIRED_SPECIALTIES } = TEAM_LIMITS;

describe("team composition rules (permutations)", () => {
  test("team size boundaries: 3 minimum, 5 maximum", () => {
    expect(MIN_MEMBERS).toBe(3);
    expect(MAX_MEMBERS).toBe(5);
    for (const size of [3, 4, 5]) {
      expect(size >= MIN_MEMBERS && size <= MAX_MEMBERS).toBe(true);
    }
    for (const size of [0, 1, 2, 6, 7]) {
      expect(size >= MIN_MEMBERS && size <= MAX_MEMBERS).toBe(false);
    }
  });

  test("all three specialties must be covered", () => {
    expect(REQUIRED_SPECIALTIES).toHaveLength(3);
    expect(new Set(REQUIRED_SPECIALTIES)).toEqual(
      new Set(["ui", "architecture", "business"])
    );
  });

  test("specialty coverage permutations: which members cover which roles", () => {
    // Any team of size 3-5 where each specialty appears at least once is valid.
    // The first two entries cover exactly the three, then a duplicated one.
    const validCombos: string[][] = [
      ["ui", "architecture", "business"],
      ["ui", "ui", "architecture", "business"],
      ["ui", "architecture", "business", "business"],
      ["business", "architecture", "ui"],
      ["ui", "architecture", "business", "ui", "architecture"],
    ];
    for (const combo of validCombos) {
      const covered = new Set(combo);
      for (const specialty of REQUIRED_SPECIALTIES) {
        expect(covered.has(specialty)).toBe(true);
      }
    }

    // Missing any specialty invalidates the team.
    const invalidCombos: string[][] = [
      ["ui", "architecture"],
      ["ui", "business"],
      ["architecture", "business"],
      ["ui", "ui", "ui"],
      [],
    ];
    for (const combo of invalidCombos) {
      const covered = new Set(combo);
      const missing = REQUIRED_SPECIALTIES.filter((s) => !covered.has(s));
      expect(missing.length).toBeGreaterThan(0);
    }
  });
});

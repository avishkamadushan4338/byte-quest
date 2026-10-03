import { describe, expect, test } from "bun:test";

import { gradeSchema, inferDivision } from "./router";

describe("inferDivision (grade → division permutations)", () => {
  test("primary division: grades 6-9", () => {
    for (const grade of ["6", "7", "8", "9"]) {
      expect(inferDivision(grade)).toBe("primary");
    }
  });

  test("secondary division: grades 10-13", () => {
    for (const grade of ["10", "11", "12", "13"]) {
      expect(inferDivision(grade)).toBe("secondary");
    }
  });

  test("grade 9 is the last primary grade", () => {
    expect(inferDivision("9")).toBe("primary");
    expect(inferDivision("10")).toBe("secondary");
  });
});

describe("gradeSchema (validation permutations)", () => {
  test("accepts every valid grade 6-13", () => {
    for (const grade of ["6", "7", "8", "9", "10", "11", "12", "13"]) {
      expect(gradeSchema.safeParse(grade).success).toBe(true);
    }
  });

  test("rejects out-of-range and malformed grades", () => {
    for (const grade of ["5", "14", "0", "-1", "six", "", "06", "6.5", "99"]) {
      expect(gradeSchema.safeParse(grade).success).toBe(false);
    }
  });
});

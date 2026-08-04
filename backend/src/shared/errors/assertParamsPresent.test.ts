import { describe, expect, it } from "vitest";
import { assertParamsPresent } from "./assertParamsPresent.js";
import { MissingParamsError } from "./MissingParamsError.js";

describe("assertParamsPresent", () => {
  it("does not throw when all params are present", () => {
    expect(() =>
      assertParamsPresent({ uid: "user-1", mealId: "meal-1", count: 0, flag: false }),
    ).not.toThrow();
  });

  it("throws MissingParamsError listing every offending key, not just the first", () => {
    expect(() =>
      assertParamsPresent({ uid: undefined, mealId: "", name: "chicken" }),
    ).toThrow(MissingParamsError);

    try {
      assertParamsPresent({ uid: undefined, mealId: "", name: "chicken" });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(MissingParamsError);
      expect((error as MissingParamsError).message).toBe(
        "Missing required parameter(s): uid, mealId",
      );
    }
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["empty string", ""],
    ["empty array", []],
    ["empty object", {}],
  ])("treats %s as missing", (_label, value) => {
    expect(() => assertParamsPresent({ param: value })).toThrow(MissingParamsError);
  });

  it.each([
    ["zero", 0],
    ["false", false],
    ["non-empty string", "value"],
    ["non-empty array", [1]],
    ["non-empty object", { key: "value" }],
  ])("does not treat %s as missing", (_label, value) => {
    expect(() => assertParamsPresent({ param: value })).not.toThrow();
  });
});

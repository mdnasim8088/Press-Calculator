import { describe, expect, it } from "vitest";
import { CalculationError, evaluateExpression } from "@/core";

describe("normal calculator expressions", () => {
  it.each([
    ["2+3*4", 14],
    ["(2+3)×4", 20],
    ["10÷4", 2.5],
    ["7−10", -3],
    ["-5+2", -3],
    ["0.1+0.2", 0.3],
    ["1.5×1.5×50", 112.5],
    ["2 × -3", -6],
  ])("%s = %s", (expr, expected) => {
    expect(evaluateExpression(expr)).toBe(expected);
  });

  it.each([
    ["200+10%", 220],
    ["200-10%", 180],
    ["200×10%", 20],
    ["50%", 0.5],
    ["100÷50%", 200],
  ])("percent like a phone calculator: %s = %s", (expr, expected) => {
    expect(evaluateExpression(expr)).toBe(expected);
  });

  it.each(["", "2+", "1/0", "(2+3", "1..2", "abc", "×5"])("rejects %j", (expr) => {
    expect(() => evaluateExpression(expr)).toThrow(CalculationError);
  });
});

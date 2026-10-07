import { describe, expect, it } from "vitest";
import { CalculationError, calculateSheetCapacity, toMeters } from "@/core";

const base = { itemWidth: 10, itemHeight: 8, unit: "cm" as const, pricePerSqm: 50 };

describe("roll capacity (sheet method)", () => {
  it("1 m × 5 m, 10 × 8 cm, gap 0.5 → 99 per sheet × 5 = 495", () => {
    const r = calculateSheetCapacity({ ...base, lengthMeters: 5, gap: 0.5 });
    expect(r.best.perRow).toBe(9);
    expect(r.best.rowsPerSheet).toBe(11);
    expect(r.best.perSheet).toBe(99);
    expect(r.best.fullSheets).toBe(5);
    expect(r.best.partialCount).toBe(0);
    expect(r.best.total).toBe(495);
    expect(r.best.remainingPerSheet).toBe(7); // 100 − (11×8 + 10×0.5)
    expect(r.best.remainingWidth).toBe(6); // 100 − (9×10 + 8×0.5)
    expect(r.areaSqm).toBe(5);
    expect(r.price).toBe(250);
    expect(r.pricePerPiece).toBe(0.5051);
  });

  it("no gap → 120 per sheet × 5 = 600", () => {
    const r = calculateSheetCapacity({ ...base, lengthMeters: 5, gap: 0 });
    expect(r.best.perSheet).toBe(120);
    expect(r.best.total).toBe(600);
  });

  it("1 m × 5.5 m adds whole rows from the last 50 cm", () => {
    const r = calculateSheetCapacity({ ...base, lengthMeters: 5.5, gap: 0.5 });
    expect(r.best.fullSheets).toBe(5);
    expect(r.best.partialLength).toBe(50);
    expect(r.best.partialRows).toBe(5);
    expect(r.best.partialCount).toBe(45);
    expect(r.best.total).toBe(540);
    expect(r.rotated?.total).toBe(539); // 495 + 4 rows × 11
    expect(r.best.rotated).toBe(false);
  });

  it("shorter than one sheet uses only the partial piece", () => {
    const r = calculateSheetCapacity({ ...base, lengthMeters: 0.5, gap: 0.5 });
    expect(r.best.fullSheets).toBe(0);
    expect(r.best.total).toBe(45);
  });

  it("compares with one continuous grid over the whole roll", () => {
    const r = calculateSheetCapacity({ ...base, lengthMeters: 5, gap: 0.5 });
    expect(r.continuous.total).toBe(522); // 9 per row × 58 rows
  });

  it("a rounded length like 9.8425 ft (2.99999 m) still counts 3 full sheets", () => {
    const r = calculateSheetCapacity({ ...base, lengthMeters: toMeters(9.8425, "ft"), gap: 0.5 });
    expect(r.best.fullSheets).toBe(3);
    expect(r.best.partialLength).toBe(0);
    expect(r.best.total).toBe(297);
  });

  it("rejects a sticker larger than the sheet", () => {
    expect(() => calculateSheetCapacity({ ...base, itemWidth: 120, itemHeight: 120, lengthMeters: 5, gap: 0 })).toThrow(
      CalculationError,
    );
  });
});

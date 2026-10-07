import { describe, expect, it } from "vitest";
import {
  CalculationError,
  calculateArea,
  calculateBestLayout,
  calculatePacking,
  calculateProfit,
  calculateRoll,
  calculateSheet,
  convert,
  fitCount,
  pricePerSqm,
  sellingPriceFromMargin,
  sellingPriceFromMarkup,
} from "@/core";

describe("units", () => {
  it("converts between supported units", () => {
    expect(convert(50, "cm", "m")).toBe(0.5);
    expect(convert(1, "inch", "mm")).toBe(25.4);
    expect(convert(1, "ft", "cm")).toBe(30.48);
    expect(convert(1500, "mm", "m")).toBe(1.5);
  });
});

describe("area pricing (meters first)", () => {
  it.each([
    [50, 70, 0.35, 17.5],
    [150, 150, 2.25, 112.5],
    [300, 500, 15, 750],
  ])("%s × %s cm @ 50 SAR/m²", (w, h, area, price) => {
    const r = calculateArea({ width: w, height: h, unit: "cm", pricePerSqm: 50 });
    expect(r.areaSqm).toBe(area);
    expect(r.totalPrice).toBe(price);
  });

  it("multiplies by quantity", () => {
    const r = calculateArea({ width: 50, height: 70, unit: "cm", pricePerSqm: 50, quantity: 4 });
    expect(r.totalAreaSqm).toBe(1.4);
    expect(r.totalPrice).toBe(70);
  });

  it("rejects invalid sizes", () => {
    expect(() => calculateArea({ width: 0, height: 70, unit: "cm", pricePerSqm: 50 })).toThrow(
      CalculationError,
    );
  });
});

describe("sticker packing", () => {
  it("has no trailing gap after the last sticker", () => {
    expect(fitCount(100, 5, 0.5)).toBe(18);
    expect(fitCount(10.5, 3, 0.75)).toBe(3); // 3×3 + 2×0.75 = 10.5 exactly
    expect(fitCount(4, 5, 0.5)).toBe(0);
  });

  it("100 × 100 cm, 5 × 5 cm, gap 0.5", () => {
    const r = calculatePacking({
      materialWidth: 100,
      materialHeight: 100,
      itemWidth: 5,
      itemHeight: 5,
      gap: 0.5,
    });
    expect(r.columns).toBe(18);
    expect(r.rows).toBe(18);
    expect(r.total).toBe(324);
    expect(r.usedWidth).toBe(98.5);
    expect(r.usedHeight).toBe(98.5);
    expect(r.remainingWidth).toBe(1.5);
    expect(r.remainingHeight).toBe(1.5);
    expect(r.wasteArea).toBe(1900);
    expect(r.wastePercent).toBe(19);
  });
});

describe("rotation / best layout", () => {
  it("picks 7 × 5 on a 100 × 50 cm material", () => {
    const r = calculateBestLayout({
      materialWidth: 100,
      materialHeight: 50,
      itemWidth: 5,
      itemHeight: 7,
      gap: 0.5,
    });
    expect(r.normal.total).toBe(108);
    expect(r.rotated.total).toBe(117);
    expect(r.best.rotated).toBe(true);
  });

  it("keeps the normal orientation for square stickers", () => {
    const r = calculateBestLayout({
      materialWidth: 100,
      materialHeight: 50,
      itemWidth: 5,
      itemHeight: 5,
      gap: 0.5,
    });
    expect(r.isSquare).toBe(true);
    expect(r.best.rotated).toBe(false);
  });
});

describe("roll mode", () => {
  it("5 × 7 cm, 500 pcs, 100 cm roll", () => {
    const { best } = calculateRoll({
      quantity: 500,
      rollWidth: 100,
      itemWidth: 5,
      itemHeight: 7,
      gap: 0.5,
      unit: "cm",
      pricePerSqm: 50,
    });
    expect(best.rotated).toBe(false);
    expect(best.perRow).toBe(18);
    expect(best.rows).toBe(28);
    expect(best.length).toBe(209.5);
    expect(best.lengthMeters).toBe(2.095);
    expect(best.areaSqm).toBe(2.095);
    expect(best.cost).toBe(104.75);
  });
});

describe("sheet mode (cutter sticker, 1 m × 1 m sheets)", () => {
  it("5 × 5 cm, 3000 pcs → 1 m × 10 m, 73 cm left on the last sheet", () => {
    const { best } = calculateSheet({
      quantity: 3000,
      itemWidth: 5,
      itemHeight: 5,
      gap: 0.5,
      unit: "cm",
      pricePerSqm: 50,
    });
    expect(best.perSheet).toBe(324);
    expect(best.fullSheets).toBe(9);
    expect(best.leftover).toBe(84);
    expect(best.lastSheetRows).toBe(5);
    expect(best.lastSheetCount).toBe(90);
    expect(best.lastSheetUsed).toBe(27);
    expect(best.lastSheetRemaining).toBe(73);
    expect(best.produced).toBe(3006);
    expect(best.extra).toBe(6);
    expect(best.sheets).toBe(10);
    expect(best.artboardWidthMeters).toBe(1);
    expect(best.artboardLengthMeters).toBe(10);
    expect(best.price).toBe(500);
    expect(best.usedLengthMeters).toBe(9.27);
    expect(best.usedPrice).toBe(463.5);
  });

  it("5 × 7 cm, 500 pcs → tie-break picks less length on the last sheet", () => {
    const { best, normal, rotated } = calculateSheet({
      quantity: 500,
      itemWidth: 5,
      itemHeight: 7,
      gap: 0.5,
      unit: "cm",
      pricePerSqm: 50,
    });
    expect(normal?.perSheet).toBe(234);
    expect(rotated?.perSheet).toBe(234);
    expect(normal?.lastSheetUsed).toBe(14.5);
    expect(rotated?.lastSheetUsed).toBe(16);
    expect(best.rotated).toBe(false);
    expect(best.lastSheetCount).toBe(36);
    expect(best.lastSheetRemaining).toBe(85.5);
    expect(best.produced).toBe(504);
    expect(best.artboardLengthMeters).toBe(3);
    expect(best.price).toBe(150);
    expect(best.usedLengthMeters).toBe(2.145);
  });

  it("exact fill leaves no partial sheet", () => {
    const { best } = calculateSheet({
      quantity: 648,
      itemWidth: 5,
      itemHeight: 5,
      gap: 0.5,
      unit: "cm",
      pricePerSqm: 50,
    });
    expect(best.sheets).toBe(2);
    expect(best.leftover).toBe(0);
    expect(best.extra).toBe(0);
    expect(best.lastSheetCount).toBe(324);
    expect(best.lastSheetRemaining).toBe(1.5);
  });

  it("works with millimeter input", () => {
    const { best } = calculateSheet({
      quantity: 3000,
      itemWidth: 50,
      itemHeight: 50,
      gap: 5,
      unit: "mm",
      pricePerSqm: 50,
    });
    expect(best.sheets).toBe(10);
    expect(best.lastSheetRemaining).toBe(730);
  });

  it("throws when the sticker is bigger than the sheet", () => {
    expect(() =>
      calculateSheet({
        quantity: 10,
        itemWidth: 120,
        itemHeight: 120,
        gap: 0,
        unit: "cm",
        pricePerSqm: 50,
      }),
    ).toThrow(CalculationError);
  });
});

describe("cost & profit", () => {
  it("calculates selling price and profit", () => {
    expect(sellingPriceFromMarkup(100, 30)).toBe(130);
    expect(sellingPriceFromMargin(75, 25)).toBe(100);
    expect(calculateProfit(100, 150)).toEqual({
      profit: 50,
      marginPercent: 33.333333333,
      markupPercent: 50,
    });
  });
});

describe("price per meter", () => {
  it("equals price per m² on a 1 m roll", () => {
    expect(pricePerSqm(50, "meter", 1)).toBe(50);
    expect(pricePerSqm(50, "sqm", 1)).toBe(50);
  });
  it("divides by the roll width on wider rolls", () => {
    expect(pricePerSqm(60, "meter", 1.5)).toBe(40);
  });
});

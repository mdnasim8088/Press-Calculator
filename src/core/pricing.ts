import { clean } from "./units";
import { CalculationError, requireNonNegative } from "./validation";

export interface CostInput {
  materialCost: number;
  inkCost?: number;
  laborCost?: number;
  otherCost?: number;
}

export function calculateCost(input: CostInput): number {
  const parts = [input.materialCost, input.inkCost ?? 0, input.laborCost ?? 0, input.otherCost ?? 0];
  parts.forEach((p) => requireNonNegative(p, "Cost"));
  return clean(parts.reduce((sum, p) => sum + p, 0));
}

/** Selling price = cost + markup% of cost. */
export function sellingPriceFromMarkup(cost: number, markupPercent: number): number {
  requireNonNegative(cost, "Cost");
  requireNonNegative(markupPercent, "Markup");
  return clean(cost * (1 + markupPercent / 100));
}

/** Selling price where profit is marginPercent of the selling price. */
export function sellingPriceFromMargin(cost: number, marginPercent: number): number {
  requireNonNegative(cost, "Cost");
  if (!Number.isFinite(marginPercent) || marginPercent < 0 || marginPercent >= 100) {
    throw new CalculationError("Margin must be between 0 and 100%");
  }
  return clean(cost / (1 - marginPercent / 100));
}

export interface ProfitResult {
  profit: number;
  /** Profit as % of selling price. */
  marginPercent: number;
  /** Profit as % of cost. */
  markupPercent: number;
}

export function calculateProfit(cost: number, sellingPrice: number): ProfitResult {
  requireNonNegative(cost, "Cost");
  requireNonNegative(sellingPrice, "Selling price");
  const profit = clean(sellingPrice - cost);
  return {
    profit,
    marginPercent: sellingPrice > 0 ? clean((profit / sellingPrice) * 100) : 0,
    markupPercent: cost > 0 ? clean((profit / cost) * 100) : 0,
  };
}

export type PriceMode = "sqm" | "meter";

/**
 * Converts a price per running meter of roll to a price per m².
 * On a 1 m wide roll they are equal: 50 SAR per meter = 50 SAR per m².
 */
export function pricePerSqm(price: number, mode: PriceMode, rollWidthMeters: number): number {
  requireNonNegative(price, "Price");
  if (mode === "sqm") return price;
  if (!Number.isFinite(rollWidthMeters) || rollWidthMeters <= 0) {
    throw new CalculationError("Roll width must be greater than 0");
  }
  return clean(price / rollWidthMeters);
}

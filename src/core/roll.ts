import { fitCount, occupiedLength } from "./packing";
import { clean, toMeters, type Unit } from "./units";
import {
  CalculationError,
  requireNonNegative,
  requirePositive,
  requirePositiveInteger,
} from "./validation";

export interface RollInput {
  quantity: number;
  /** All lengths are in `unit`. */
  rollWidth: number;
  itemWidth: number;
  itemHeight: number;
  gap: number;
  unit: Unit;
  pricePerSqm: number;
}

export interface RollOption {
  rotated: boolean;
  itemWidth: number;
  itemHeight: number;
  perRow: number;
  rows: number;
  produced: number;
  extra: number;
  /** Required roll length in `unit`, with no trailing gap after the last row. */
  length: number;
  lengthMeters: number;
  areaSqm: number;
  cost: number;
}

export interface RollResult {
  best: RollOption;
  normal: RollOption | null;
  rotated: RollOption | null;
}

function option(input: RollInput, rotated: boolean): RollOption | null {
  const itemWidth = rotated ? input.itemHeight : input.itemWidth;
  const itemHeight = rotated ? input.itemWidth : input.itemHeight;
  const perRow = fitCount(input.rollWidth, itemWidth, input.gap);
  if (perRow === 0) return null;

  const rows = Math.ceil(input.quantity / perRow);
  const produced = rows * perRow;
  const length = occupiedLength(rows, itemHeight, input.gap);
  const lengthMeters = toMeters(length, input.unit);
  const areaSqm = clean(toMeters(input.rollWidth, input.unit) * lengthMeters);

  return {
    rotated,
    itemWidth,
    itemHeight,
    perRow,
    rows,
    produced,
    extra: produced - input.quantity,
    length,
    lengthMeters,
    areaSqm,
    cost: clean(areaSqm * input.pricePerSqm),
  };
}

/**
 * Roll mode: exact roll length needed for a quantity of stickers.
 * Both orientations are tested and the one using less length is recommended.
 */
export function calculateRoll(input: RollInput): RollResult {
  requirePositiveInteger(input.quantity, "Quantity");
  requirePositive(input.rollWidth, "Roll width");
  requirePositive(input.itemWidth, "Sticker width");
  requirePositive(input.itemHeight, "Sticker height");
  requireNonNegative(input.gap, "Gap");
  requireNonNegative(input.pricePerSqm, "Price per m²");

  const normal = option(input, false);
  const rotated = option(input, true);
  const candidates = [normal, rotated].filter((o): o is RollOption => o !== null);
  if (candidates.length === 0) {
    throw new CalculationError("Sticker is wider than the roll");
  }

  const best = candidates.reduce((a, b) =>
    b.length < a.length || (b.length === a.length && b.extra < a.extra) ? b : a,
  );
  return { best, normal, rotated };
}

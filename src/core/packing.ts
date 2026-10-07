import { clean } from "./units";
import { requireNonNegative, requirePositive } from "./validation";

/** Tolerance so values like 10.5 / 3.5 never floor to 2.999… */
const EPSILON = 1e-9;

export interface PackingInput {
  /** All lengths must share the same unit. */
  materialWidth: number;
  materialHeight: number;
  itemWidth: number;
  itemHeight: number;
  gap: number;
}

export interface PackingResult {
  /** Item size as placed (swapped when rotated). */
  itemWidth: number;
  itemHeight: number;
  rotated: boolean;
  columns: number;
  rows: number;
  total: number;
  usedWidth: number;
  usedHeight: number;
  remainingWidth: number;
  remainingHeight: number;
  materialArea: number;
  itemsArea: number;
  wasteArea: number;
  wastePercent: number;
}

export interface BestLayoutResult {
  best: PackingResult;
  normal: PackingResult;
  rotated: PackingResult;
  /** True when the item is square, so rotating changes nothing. */
  isSquare: boolean;
}

/**
 * How many complete items fit along one axis.
 * n items need n × item + (n − 1) × gap, i.e. no trailing gap after the last one.
 */
export function fitCount(length: number, item: number, gap: number): number {
  if (item > length + EPSILON) return 0;
  return Math.floor((length + gap) / (item + gap) + EPSILON);
}

/** Length occupied by `count` items with gaps between them (no trailing gap). */
export function occupiedLength(count: number, item: number, gap: number): number {
  return count > 0 ? clean(count * item + (count - 1) * gap) : 0;
}

function validate(input: PackingInput): void {
  requirePositive(input.materialWidth, "Material width");
  requirePositive(input.materialHeight, "Material height");
  requirePositive(input.itemWidth, "Sticker width");
  requirePositive(input.itemHeight, "Sticker height");
  requireNonNegative(input.gap, "Gap");
}

function pack(input: PackingInput, rotated: boolean): PackingResult {
  const itemWidth = rotated ? input.itemHeight : input.itemWidth;
  const itemHeight = rotated ? input.itemWidth : input.itemHeight;
  const { materialWidth, materialHeight, gap } = input;

  const columns = fitCount(materialWidth, itemWidth, gap);
  const rows = columns > 0 ? fitCount(materialHeight, itemHeight, gap) : 0;
  const total = columns * rows;

  const usedWidth = rows > 0 ? occupiedLength(columns, itemWidth, gap) : 0;
  const usedHeight = occupiedLength(rows, itemHeight, gap);
  const materialArea = clean(materialWidth * materialHeight);
  const itemsArea = clean(total * itemWidth * itemHeight);
  const wasteArea = clean(materialArea - itemsArea);

  return {
    itemWidth,
    itemHeight,
    rotated,
    columns,
    rows,
    total,
    usedWidth,
    usedHeight,
    remainingWidth: clean(materialWidth - usedWidth),
    remainingHeight: clean(materialHeight - usedHeight),
    materialArea,
    itemsArea,
    wasteArea,
    wastePercent: clean((wasteArea / materialArea) * 100),
  };
}

/** Packs items in the given orientation only. */
export function calculatePacking(input: PackingInput): PackingResult {
  validate(input);
  return pack(input, false);
}

/**
 * Tests W×H and H×W and returns the better layout:
 * more stickers wins; on a tie, less waste wins; otherwise keep the normal orientation.
 */
export function calculateBestLayout(input: PackingInput): BestLayoutResult {
  validate(input);
  const normal = pack(input, false);
  const rotated = pack(input, true);
  const isSquare = input.itemWidth === input.itemHeight;

  let best = normal;
  if (!isSquare) {
    if (rotated.total > normal.total) best = rotated;
    else if (rotated.total === normal.total && rotated.wasteArea < normal.wasteArea - EPSILON) {
      best = rotated;
    }
  }

  return { best, normal, rotated, isSquare };
}

import { calculateBestLayout, fitCount, occupiedLength, type PackingResult } from "./packing";
import { CUTTER_SHEET_SIZE_METERS } from "./sheet";
import { clean, fromMeters, type Unit } from "./units";
import { CalculationError, requireNonNegative, requirePositive } from "./validation";

/**
 * Lengths within 0.1 mm of a whole sheet count as that sheet, so a rounded value
 * such as 9.8425 ft (= 2.99999 m) still gives 3 full sheets.
 */
const SHEET_TOLERANCE_METERS = 1e-4;

export interface SheetCapacityInput {
  /** Roll length in meters, e.g. 5 for a 1 m × 5 m roll. Decimals allowed (5.5). */
  lengthMeters: number;
  /** Sticker size and gap, in `unit`. */
  itemWidth: number;
  itemHeight: number;
  gap: number;
  unit: Unit;
  pricePerSqm: number;
  /** Square sheet side in meters. Defaults to 1 m (cutter-sticker width). */
  sheetSizeMeters?: number;
}

export interface SheetCapacityOption {
  rotated: boolean;
  itemWidth: number;
  itemHeight: number;
  /** Sheet side in `unit`. */
  sheetSize: number;
  perRow: number;
  rowsPerSheet: number;
  perSheet: number;
  /** Leftover length at the end of each full sheet, in `unit`. */
  remainingPerSheet: number;
  /** Leftover width on every sheet, in `unit`. */
  remainingWidth: number;

  fullSheets: number;
  /** Length of the part after the last full sheet (e.g. 50 cm of a 5.5 m roll), in `unit`. */
  partialLength: number;
  partialRows: number;
  partialCount: number;
  partialRemaining: number;

  /** Complete stickers in the whole roll. */
  total: number;
}

export interface SheetCapacityResult {
  best: SheetCapacityOption;
  normal: SheetCapacityOption | null;
  rotated: SheetCapacityOption | null;
  widthMeters: number;
  lengthMeters: number;
  areaSqm: number;
  price: number;
  /** Material price ÷ pieces. */
  pricePerPiece: number;
  /** For comparison: one continuous grid over the whole roll, ignoring sheet breaks. */
  continuous: PackingResult;
}

function option(input: SheetCapacityInput, sheetMeters: number, rotated: boolean): SheetCapacityOption | null {
  const itemWidth = rotated ? input.itemHeight : input.itemWidth;
  const itemHeight = rotated ? input.itemWidth : input.itemHeight;
  const { gap, unit } = input;
  const sheetSize = fromMeters(sheetMeters, unit);

  const perRow = fitCount(sheetSize, itemWidth, gap);
  const rowsPerSheet = perRow > 0 ? fitCount(sheetSize, itemHeight, gap) : 0;
  const perSheet = perRow * rowsPerSheet;
  if (perSheet === 0) return null;

  const fullSheets = Math.floor((input.lengthMeters + SHEET_TOLERANCE_METERS) / sheetMeters);
  const partialLength = Math.max(0, fromMeters(clean(input.lengthMeters - fullSheets * sheetMeters), unit));
  const partialRows = partialLength > 0 ? fitCount(partialLength, itemHeight, gap) : 0;
  const partialCount = partialRows * perRow;

  return {
    rotated,
    itemWidth,
    itemHeight,
    sheetSize,
    perRow,
    rowsPerSheet,
    perSheet,
    remainingPerSheet: clean(sheetSize - occupiedLength(rowsPerSheet, itemHeight, gap)),
    remainingWidth: clean(sheetSize - occupiedLength(perRow, itemWidth, gap)),
    fullSheets,
    partialLength,
    partialRows,
    partialCount,
    partialRemaining: clean(partialLength - occupiedLength(partialRows, itemHeight, gap)),
    total: fullSheets * perSheet + partialCount,
  };
}

/**
 * Roll capacity with the sheet method:
 * count complete stickers on one 1 m × 1 m sheet, multiply by the number of full sheets,
 * then add whole rows that fit in any extra length (e.g. the last 0.5 m of a 5.5 m roll).
 * Both orientations are tested; the one with more pieces wins.
 */
export function calculateSheetCapacity(input: SheetCapacityInput): SheetCapacityResult {
  const sheetMeters = input.sheetSizeMeters ?? CUTTER_SHEET_SIZE_METERS;
  requirePositive(input.lengthMeters, "Roll length");
  requirePositive(input.itemWidth, "Sticker width");
  requirePositive(input.itemHeight, "Sticker height");
  requireNonNegative(input.gap, "Gap");
  requireNonNegative(input.pricePerSqm, "Price per m²");
  requirePositive(sheetMeters, "Sheet size");

  const normal = option(input, sheetMeters, false);
  const rotated = input.itemWidth === input.itemHeight ? null : option(input, sheetMeters, true);
  const candidates = [normal, rotated].filter((o): o is SheetCapacityOption => o !== null);
  if (candidates.length === 0) {
    throw new CalculationError("Sticker does not fit on the sheet");
  }
  const best = candidates.reduce((a, b) => (b.total > a.total ? b : a));

  const areaSqm = clean(sheetMeters * input.lengthMeters);
  const price = clean(areaSqm * input.pricePerSqm);
  const continuous = calculateBestLayout({
    materialWidth: fromMeters(sheetMeters, input.unit),
    materialHeight: fromMeters(input.lengthMeters, input.unit),
    itemWidth: input.itemWidth,
    itemHeight: input.itemHeight,
    gap: input.gap,
  }).best;

  return {
    best,
    normal,
    rotated,
    widthMeters: sheetMeters,
    lengthMeters: input.lengthMeters,
    areaSqm,
    price,
    pricePerPiece: best.total > 0 ? clean(price / best.total, 4) : 0,
    continuous,
  };
}

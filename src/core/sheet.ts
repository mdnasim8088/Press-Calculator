import { fitCount, occupiedLength } from "./packing";
import { clean, fromMeters, toMeters, type Unit } from "./units";
import {
  CalculationError,
  requireNonNegative,
  requirePositive,
  requirePositiveInteger,
} from "./validation";

/** Cutter-sticker width is always 1 m. */
export const CUTTER_SHEET_SIZE_METERS = 1;

export interface SheetInput {
  quantity: number;
  /** Sticker size and gap, in `unit`. */
  itemWidth: number;
  itemHeight: number;
  gap: number;
  unit: Unit;
  pricePerSqm: number;
  /** Square sheet side in meters. Defaults to 1 m (locked for cutter stickers). */
  sheetSizeMeters?: number;
}

export interface SheetOption {
  rotated: boolean;
  itemWidth: number;
  itemHeight: number;
  /** Sheet side expressed in `unit`. */
  sheetSize: number;
  perRow: number;
  rowsPerSheet: number;
  perSheet: number;

  sheets: number;
  fullSheets: number;
  /** Stickers still needed after the full sheets (0 when they fill exactly). */
  leftover: number;

  /** Last sheet: rows are always completed, never a half row. */
  lastSheetRows: number;
  lastSheetCount: number;
  lastSheetUsed: number;
  lastSheetRemaining: number;

  produced: number;
  extra: number;

  /** Artboard = sheetSizeMeters × artboardLengthMeters, e.g. 1 m × 10 m. */
  artboardWidthMeters: number;
  artboardLengthMeters: number;
  artboardAreaSqm: number;
  /** Price charged on full sheets. */
  price: number;

  /** Actual length used, including only the used part of the last sheet. */
  usedLengthMeters: number;
  usedAreaSqm: number;
  usedPrice: number;
}

export interface SheetResult {
  best: SheetOption;
  normal: SheetOption | null;
  rotated: SheetOption | null;
}

function option(input: SheetInput, sheetMeters: number, rotated: boolean): SheetOption | null {
  const itemWidth = rotated ? input.itemHeight : input.itemWidth;
  const itemHeight = rotated ? input.itemWidth : input.itemHeight;
  const sheetSize = fromMeters(sheetMeters, input.unit);
  const { gap, quantity } = input;

  const perRow = fitCount(sheetSize, itemWidth, gap);
  const rowsPerSheet = perRow > 0 ? fitCount(sheetSize, itemHeight, gap) : 0;
  const perSheet = perRow * rowsPerSheet;
  if (perSheet === 0) return null;

  const fullSheets = Math.floor(quantity / perSheet);
  const leftover = quantity - fullSheets * perSheet;
  const sheets = fullSheets + (leftover > 0 ? 1 : 0);

  // When the quantity fills the sheets exactly, the last sheet is a full one.
  const lastSheetRows = leftover > 0 ? Math.ceil(leftover / perRow) : rowsPerSheet;
  const lastSheetCount = lastSheetRows * perRow;
  const lastSheetUsed = occupiedLength(lastSheetRows, itemHeight, gap);
  const lastSheetRemaining = clean(sheetSize - lastSheetUsed);

  const produced = (sheets - 1) * perSheet + lastSheetCount;
  const artboardLengthMeters = clean(sheets * sheetMeters);
  const artboardAreaSqm = clean(sheetMeters * artboardLengthMeters);
  const usedLengthMeters = clean((sheets - 1) * sheetMeters + toMeters(lastSheetUsed, input.unit));
  const usedAreaSqm = clean(sheetMeters * usedLengthMeters);

  return {
    rotated,
    itemWidth,
    itemHeight,
    sheetSize,
    perRow,
    rowsPerSheet,
    perSheet,
    sheets,
    fullSheets,
    leftover,
    lastSheetRows,
    lastSheetCount,
    lastSheetUsed,
    lastSheetRemaining,
    produced,
    extra: produced - quantity,
    artboardWidthMeters: sheetMeters,
    artboardLengthMeters,
    artboardAreaSqm,
    price: clean(artboardAreaSqm * input.pricePerSqm),
    usedLengthMeters,
    usedAreaSqm,
    usedPrice: clean(usedAreaSqm * input.pricePerSqm),
  };
}

/** Fewer sheets wins; then less length used on the last sheet; then fewer extra stickers. */
function isBetter(candidate: SheetOption, current: SheetOption): boolean {
  if (candidate.sheets !== current.sheets) return candidate.sheets < current.sheets;
  if (candidate.lastSheetUsed !== current.lastSheetUsed) {
    return candidate.lastSheetUsed < current.lastSheetUsed;
  }
  return candidate.extra < current.extra;
}

/**
 * Sheet mode (cutter stickers):
 * 1. Count complete stickers on a 1 m × 1 m sheet (both orientations).
 * 2. Sheets = full sheets + one partial sheet for the leftover.
 * 3. The last sheet's final row is always completed.
 * 4. Sheets are joined lengthwise → artboard 1 m × N m, priced on full sheets.
 */
export function calculateSheet(input: SheetInput): SheetResult {
  const sheetMeters = input.sheetSizeMeters ?? CUTTER_SHEET_SIZE_METERS;
  requirePositiveInteger(input.quantity, "Quantity");
  requirePositive(input.itemWidth, "Sticker width");
  requirePositive(input.itemHeight, "Sticker height");
  requireNonNegative(input.gap, "Gap");
  requireNonNegative(input.pricePerSqm, "Price per m²");
  requirePositive(sheetMeters, "Sheet size");

  const normal = option(input, sheetMeters, false);
  const rotated =
    input.itemWidth === input.itemHeight ? null : option(input, sheetMeters, true);
  const candidates = [normal, rotated].filter((o): o is SheetOption => o !== null);
  if (candidates.length === 0) {
    throw new CalculationError("Sticker does not fit on the sheet");
  }

  const best = candidates.reduce((a, b) => (isBetter(b, a) ? b : a));
  return { best, normal, rotated };
}

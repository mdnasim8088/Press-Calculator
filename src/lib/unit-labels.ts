import type { Unit } from "@/core";

/** Full unit names for buttons and dropdowns; the short symbol stays next to numbers. */
export const UNIT_NAMES: Record<Unit, string> = {
  mm: "Millimeter",
  cm: "Centimeter",
  m: "Meter",
  inch: "Inch",
  ft: "Feet",
};

/** "Centimeter (cm)"; just "Inch" where the symbol is the name. */
export function unitLabel(unit: Unit): string {
  const name = UNIT_NAMES[unit];
  return name.toLowerCase() === unit ? name : `${name} (${unit})`;
}

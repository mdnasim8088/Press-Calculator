export type Unit = "mm" | "cm" | "m" | "inch" | "ft";

export const UNITS: readonly Unit[] = ["mm", "cm", "m", "inch", "ft"];

const METERS_PER_UNIT: Record<Unit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  inch: 0.0254,
  ft: 0.3048,
};

/** Rounds away floating-point noise (e.g. 0.35000000000000003 → 0.35). */
export function clean(value: number, decimals = 9): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function roundTo(value: number, decimals = 2): number {
  return clean(value, decimals);
}

export function toMeters(value: number, unit: Unit): number {
  return clean(value * METERS_PER_UNIT[unit]);
}

export function fromMeters(meters: number, unit: Unit): number {
  return clean(meters / METERS_PER_UNIT[unit]);
}

export function convert(value: number, from: Unit, to: Unit): number {
  return fromMeters(toMeters(value, from), to);
}

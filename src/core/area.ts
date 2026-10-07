import { clean, toMeters, type Unit } from "./units";
import { requireNonNegative, requirePositive, requirePositiveInteger } from "./validation";

export interface AreaInput {
  width: number;
  height: number;
  unit: Unit;
  pricePerSqm: number;
  quantity?: number;
}

export interface AreaResult {
  widthMeters: number;
  heightMeters: number;
  areaSqm: number;
  totalAreaSqm: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Business rule: always convert to meters first, then m², then × price.
 * 50 cm × 70 cm → 0.5 m × 0.7 m = 0.35 m² → × 50 SAR = 17.50 SAR
 */
export function calculateArea(input: AreaInput): AreaResult {
  const quantity = input.quantity ?? 1;
  requirePositive(input.width, "Width");
  requirePositive(input.height, "Height");
  requireNonNegative(input.pricePerSqm, "Price per m²");
  requirePositiveInteger(quantity, "Quantity");

  const widthMeters = toMeters(input.width, input.unit);
  const heightMeters = toMeters(input.height, input.unit);
  const areaSqm = clean(widthMeters * heightMeters);
  const totalAreaSqm = clean(areaSqm * quantity);

  return {
    widthMeters,
    heightMeters,
    areaSqm,
    totalAreaSqm,
    unitPrice: clean(areaSqm * input.pricePerSqm),
    totalPrice: clean(totalAreaSqm * input.pricePerSqm),
  };
}

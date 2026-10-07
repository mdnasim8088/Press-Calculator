export class CalculationError extends RangeError {
  constructor(message: string) {
    super(message);
    this.name = "CalculationError";
  }
}

export function requirePositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new CalculationError(`${label} must be greater than 0`);
  }
}

export function requireNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new CalculationError(`${label} cannot be negative`);
  }
}

export function requirePositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new CalculationError(`${label} must be a whole number greater than 0`);
  }
}

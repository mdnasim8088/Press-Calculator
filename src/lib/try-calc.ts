import { CalculationError } from "@/core";

export type CalcOutcome<T> = { ok: true; value: T } | { ok: false; error: string };

/** Runs a core calculation and turns validation errors into a message for the UI. */
export function tryCalc<T>(run: () => T): CalcOutcome<T> {
  try {
    return { ok: true, value: run() };
  } catch (err) {
    if (err instanceof CalculationError) return { ok: false, error: err.message };
    throw err;
  }
}

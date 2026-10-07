"use client";

import type { Unit } from "@/core";
import { parseInput } from "@/lib/format";
import { NumberInput } from "./NumberInput";

/** Common gaps per unit, for one-tap selection. Any other value can still be typed. */
const QUICK_GAPS: Partial<Record<Unit, number[]>> = {
  mm: [0, 2, 3, 5, 10],
  cm: [0, 0.2, 0.3, 0.5, 1],
  m: [0, 0.002, 0.003, 0.005, 0.01],
  inch: [0, 0.1, 0.125, 0.25, 0.5],
  ft: [0, 0.01, 0.02, 0.05],
};

interface GapPickerProps {
  value: string;
  onChange: (value: string) => void;
  unit: Unit;
}

export function GapPicker({ value, onChange, unit }: GapPickerProps) {
  const current = parseInput(value);
  return (
    <div>
      <NumberInput label="Gap" help="field.gap" value={value} onChange={onChange} suffix={unit} />
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Quick gap">
        {(QUICK_GAPS[unit] ?? []).map((g) => {
          const active = current === g;
          return (
            <button
              key={g}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(String(g))}
              className={`min-h-9 rounded-md px-3 font-mono text-sm transition-colors ${
                active ? "bg-accent text-bg" : "bg-surface-2 text-muted hover:text-text"
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}

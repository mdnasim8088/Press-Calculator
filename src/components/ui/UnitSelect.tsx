"use client";

import { UNITS, type Unit } from "@/core";
import { unitLabel } from "@/lib/unit-labels";

interface UnitSelectProps {
  value: Unit;
  onChange: (unit: Unit) => void;
  units?: readonly Unit[];
  label?: string;
}

export function UnitSelect({ value, onChange, units = UNITS, label = "Unit" }: UnitSelectProps) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {units.map((u) => {
        const active = u === value;
        return (
          <button
            key={u}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(u)}
            className={`hud-clip-sm min-h-9 px-3 font-ui text-sm font-bold tracking-wide transition-colors ${
              active ? "bg-accent text-bg" : "bg-surface-2 text-muted hover:text-text"
            }`}
          >
            {unitLabel(u)}
          </button>
        );
      })}
    </div>
  );
}

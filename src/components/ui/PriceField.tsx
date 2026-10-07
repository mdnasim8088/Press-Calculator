"use client";

import type { PriceMode } from "@/core";
import { NumberInput } from "./NumberInput";

const MODES: { value: PriceMode; label: string }[] = [
  { value: "sqm", label: "per m²" },
  { value: "meter", label: "per meter" },
];

/** Small "per m² | per meter" switch, shown in the top-right corner of the Input panel. */
export function PriceModeToggle({ mode, onChange }: { mode: PriceMode; onChange: (mode: PriceMode) => void }) {
  return (
    <div role="radiogroup" aria-label="Price mode" className="flex rounded-lg bg-surface-2 p-0.5">
      {MODES.map((m) => {
        const active = m.value === mode;
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m.value)}
            className={`min-h-8 rounded-md px-2.5 font-ui text-xs font-bold tracking-wide whitespace-nowrap transition-colors ${
              active ? "bg-accent-gradient text-on-accent" : "text-muted hover:text-text"
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

interface PriceFieldProps {
  mode: PriceMode;
  value: string;
  onChange: (value: string) => void;
  currency: string;
}

/** Price input that follows the selected mode. Empty is allowed: the price then shows 0. */
export function PriceField({ mode, value, onChange, currency }: PriceFieldProps) {
  return mode === "meter" ? (
    <NumberInput label="Price per meter" help="field.pricePerMeter" value={value} onChange={onChange} suffix={`${currency}/m`} hint="Optional" />
  ) : (
    <NumberInput label="Price per m²" help="field.price" value={value} onChange={onChange} suffix={`${currency}/m²`} hint="Optional" />
  );
}

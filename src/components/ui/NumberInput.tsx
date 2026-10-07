"use client";

import { useId } from "react";
import type { HelpKey } from "@/i18n/help";
import { Help } from "./Help";

interface NumberInputProps {
  /** English label. */
  label: string;
  /** Small Bangla/Arabic explanation under the label. */
  help?: HelpKey;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  hint?: string;
  error?: boolean;
  /** Whole numbers only (e.g. quantity). */
  integer?: boolean;
  /** When given, the suffix becomes a dropdown with these options (e.g. units). */
  suffixOptions?: readonly { value: string; label: string }[];
  onSuffixChange?: (value: string) => void;
}

export function NumberInput({
  label,
  help,
  value,
  onChange,
  suffix,
  hint,
  error,
  integer,
  suffixOptions,
  onSuffixChange,
}: NumberInputProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block">
        <span className="block font-ui text-sm font-bold text-text">{label}</span>
        {help && <Help k={help} />}
      </label>
      <div
        className={`flex min-h-11 items-center rounded-lg border bg-surface-2 transition-colors focus-within:border-accent focus-within:shadow-[0_0_12px_var(--accent-glow)] ${
          error ? "border-danger" : "border-border"
        }`}
      >
        <input
          id={id}
          type="number"
          inputMode={integer ? "numeric" : "decimal"}
          step={integer ? 1 : "any"}
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error || undefined}
          className="w-full min-w-0 bg-transparent px-3 py-2 font-mono text-base text-text tabular-nums outline-none"
        />
        {suffixOptions && onSuffixChange ? (
          <select
            value={suffix}
            onChange={(e) => onSuffixChange(e.target.value)}
            aria-label={`${label} unit`}
            className="mr-1.5 min-h-9 shrink-0 cursor-pointer rounded-md border border-border bg-surface-solid px-2 font-ui text-sm font-bold text-accent outline-none focus:border-accent"
          >
            {suffixOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          suffix && <span className="shrink-0 pr-3 font-ui text-sm font-semibold text-muted">{suffix}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

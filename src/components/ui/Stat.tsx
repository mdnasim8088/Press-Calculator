import type { ReactNode } from "react";
import type { HelpKey } from "@/i18n/help";
import { Help } from "./Help";

interface StatProps {
  /** English label. */
  label: string;
  /** Small Bangla/Arabic explanation under the label. */
  help?: HelpKey;
  value: ReactNode;
  hint?: ReactNode;
  highlight?: boolean;
}

/** A labelled result value. `highlight` makes it the big glowing number. */
export function Stat({ label, help, value, hint, highlight }: StatProps) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? "bg-accent/10 ring-1 ring-accent/40" : "bg-surface-2/60"}`}>
      <div className="font-ui text-xs font-semibold uppercase tracking-widest text-text">{label}</div>
      {help && <Help k={help} className="text-[11px]" />}
      <div
        className={`mt-1 font-mono font-semibold tabular-nums ${
          highlight ? "text-2xl text-accent text-glow sm:text-3xl" : "text-lg text-text"
        }`}
      >
        {value}
      </div>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </div>
  );
}

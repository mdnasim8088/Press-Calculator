type StatTone = "accent" | "success" | "warning" | "danger";

const BAR: Record<StatTone, string> = {
  accent: "bg-accent shadow-[0_0_10px_var(--accent-glow)]",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

interface StatBarProps {
  label: string;
  /** 0–100 */
  percent: number;
  valueLabel?: string;
  tone?: StatTone;
}

export function StatBar({ label, percent, valueLabel, tone = "accent" }: StatBarProps) {
  const width = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2 font-ui text-sm">
        <span className="font-semibold text-text">{label}</span>
        <span className="font-mono text-xs text-muted tabular-nums">
          {valueLabel ?? `${width.toFixed(1)}%`}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-accent-soft/40"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(width)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full transition-[width] duration-300 ${BAR[tone]}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

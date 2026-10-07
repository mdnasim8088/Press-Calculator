import type { ReactNode } from "react";

export type BadgeTone = "accent" | "success" | "warning" | "danger" | "muted";

const TONES: Record<BadgeTone, string> = {
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  muted: "bg-surface-2 text-muted",
};

export function Badge({ tone = "accent", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`hud-clip-sm inline-flex items-center gap-1 px-2.5 py-1 font-ui text-xs font-bold uppercase tracking-widest ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

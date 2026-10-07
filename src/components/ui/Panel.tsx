import type { ReactNode } from "react";

interface PanelProps {
  /** Step number shown as "01", "02"… */
  index?: number;
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Panel({ index, title, action, className = "", children }: PanelProps) {
  return (
    <section className={`glass relative rounded-xl p-4 sm:p-5 ${className}`}>
      <header className="mb-4 flex items-center gap-3">
        {index !== undefined && (
          <span className="font-display text-xl font-bold text-accent text-glow">
            {String(index).padStart(2, "0")}
          </span>
        )}
        <h2 className="font-ui text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        {action}
      </header>
      {children}
    </section>
  );
}

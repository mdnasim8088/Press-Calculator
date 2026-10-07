import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent-gradient text-on-accent hover:brightness-110 shadow-[0_4px_14px_var(--accent-glow)]",
  ghost: "bg-surface-2 text-text hover:bg-accent-soft",
};

interface HudButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function HudButton({ variant = "primary", className = "", type = "button", ...props }: HudButtonProps) {
  return (
    <button
      type={type}
      className={`hud-clip inline-flex min-h-11 items-center justify-center gap-2 px-5 font-ui text-sm font-bold uppercase tracking-widest transition-colors disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

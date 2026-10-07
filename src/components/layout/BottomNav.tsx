"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_ITEMS } from "@/config/navigation";

/** Mobile-only bottom navigation bar. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="glass fixed inset-x-0 bottom-0 z-30 flex border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {BOTTOM_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 font-ui text-[11px] font-semibold uppercase tracking-wider ${
              active ? "text-accent" : "text-muted"
            }`}
          >
            <Icon size={20} strokeWidth={1.75} className={active ? "drop-shadow-[0_0_6px_var(--accent-glow)]" : ""} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

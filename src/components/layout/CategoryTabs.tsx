"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_TABS } from "@/config/navigation";

/** Calculator category tabs (Sheet · Area · Packing · Roll · Cost · Profit). Scrolls sideways on small screens. */
export function CategoryTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Calculators" className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-1 border-b border-border">
        {CATEGORY_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 items-center px-4 font-ui text-sm font-bold uppercase tracking-widest transition-colors ${
                  active ? "text-accent" : "text-muted hover:text-text"
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 bg-accent-gradient" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

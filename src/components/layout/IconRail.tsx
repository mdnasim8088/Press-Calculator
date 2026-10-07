"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { RAIL_ITEMS, type NavItem } from "@/config/navigation";
import { Logo } from "./Logo";

function RailLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
        active ? "bg-accent/15 text-accent glow" : "text-muted hover:bg-surface-2 hover:text-text"
      }`}
    >
      <Icon size={22} strokeWidth={1.75} />
    </Link>
  );
}

/** Desktop-only vertical icon navigation, like the sidebar in the reference design. */
export function IconRail() {
  const pathname = usePathname();
  return (
    <aside className="glass fixed inset-y-0 left-0 z-30 hidden w-20 flex-col items-center gap-2 border-y-0 border-l-0 py-5 md:flex">
      <Link href="/" aria-label="Press Calculator home" className="mb-6">
        <Logo />
      </Link>
      <nav className="flex flex-1 flex-col items-center gap-2" aria-label="Main">
        {RAIL_ITEMS.map((item) => (
          <RailLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </nav>
      <RailLink item={{ href: "/settings", label: "Settings", icon: Settings }} active={pathname === "/settings"} />
    </aside>
  );
}

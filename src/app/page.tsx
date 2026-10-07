import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FEATURED_TOOL, GROUPS, TOOLS, type Tool } from "@/config/navigation";
import { Badge } from "@/components/ui/Badge";
import { Help } from "@/components/ui/Help";
import { LangToggle } from "@/components/ui/LangToggle";
import { Wordmark } from "@/components/layout/Logo";

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const ready = tool.status === "ready";
  return (
    <Link
      href={tool.href}
      className={`glass group flex min-h-20 items-center gap-4 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-accent/60 ${
        ready ? "" : "opacity-60 hover:opacity-100"
      }`}
    >
      <Icon size={26} strokeWidth={1.5} aria-hidden className={`shrink-0 ${ready ? "text-accent" : "text-muted"}`} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-ui text-base font-bold tracking-wider text-text uppercase">{tool.title}</span>
          {!ready && <Badge tone="muted">Soon</Badge>}
        </span>
        <Help k={tool.help} className="mt-0.5 text-sm" />
      </span>
      <ChevronRight size={18} aria-hidden className="shrink-0 text-muted transition-colors group-hover:text-accent" />
    </Link>
  );
}

/** The normal calculator, shown first as its own big option. */
function FeaturedCard() {
  const Icon = FEATURED_TOOL.icon;
  return (
    <Link
      href={FEATURED_TOOL.href}
      className="glass group relative flex items-center gap-5 overflow-clip rounded-2xl border-accent/50 p-5 transition-all hover:-translate-y-0.5 hover:glow sm:p-6"
    >
      <div aria-hidden className="absolute -right-10 -bottom-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
      <Icon size={44} strokeWidth={1.25} aria-hidden className="relative shrink-0 text-accent drop-shadow-[0_0_10px_var(--accent-glow)]" />
      <span className="relative min-w-0 flex-1">
        <span className="font-display text-xl font-bold tracking-wider text-text uppercase sm:text-2xl">
          {FEATURED_TOOL.title}
        </span>
        <Help k={FEATURED_TOOL.help} className="mt-1 text-sm" />
      </span>
      <ChevronRight size={22} aria-hidden className="relative shrink-0 text-accent" />
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="glass relative overflow-clip rounded-2xl p-5 sm:p-7">
        <div aria-hidden className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <span className="w-44 sm:w-56">
            <Wordmark height={64} />
          </span>
          <LangToggle className="ml-auto" />
        </div>
        <h1 className="relative mt-4 font-display text-3xl leading-tight font-extrabold tracking-wider text-text uppercase sm:text-5xl">
          Press <span className="text-accent-gradient">Calculator</span>
        </h1>
        <span aria-hidden className="relative mt-3 block h-0.5 w-28 bg-accent-gradient" />
        <p className="relative mt-3 max-w-xl text-sm text-text">
          Sheets, meters, leftover and price for stickers, cutter stickers, banners and vinyl.
        </p>
        <Help k="home.tagline" className="relative mt-1 max-w-xl text-sm" />
      </section>

      <FeaturedCard />

      {GROUPS.map(({ group, title, help }, i) => (
        <section key={group}>
          <h2 className="mb-4 flex items-center gap-3">
            <span className="font-display text-lg font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="block font-ui text-sm font-bold tracking-[0.2em] text-text uppercase">{title}</span>
              <Help k={help} />
            </span>
            <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.filter((t) => t.group === group && t !== FEATURED_TOOL).map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

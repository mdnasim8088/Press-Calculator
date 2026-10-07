import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { findTool } from "@/config/navigation";
import { Badge } from "@/components/ui/Badge";
import { Help } from "@/components/ui/Help";
import { Panel } from "@/components/ui/Panel";
import { PageHeader } from "./PageHeader";

/** Placeholder for features planned in later steps. */
export function ComingSoon({ href, tabs }: { href: string; tabs?: boolean }) {
  const tool = findTool(href);
  const title = tool?.title ?? "Coming soon";
  const Icon = tool?.icon;
  return (
    <>
      <PageHeader title={title} help={tool?.help} tabs={tabs} badge={<Badge tone="muted">Coming soon</Badge>} />
      <Panel title="Planned">
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          {Icon && <Icon size={44} strokeWidth={1.25} className="text-accent opacity-70" />}
          <div>
            <p className="text-sm text-text">This feature is coming in the next phase.</p>
            <Help k="page.soon" className="mt-1 text-center" />
          </div>
          <Link
            href="/sticker"
            className="inline-flex items-center gap-1 font-ui text-sm font-bold uppercase tracking-widest text-accent hover:underline"
          >
            Open sticker calculator <ChevronRight size={16} />
          </Link>
        </div>
      </Panel>
    </>
  );
}

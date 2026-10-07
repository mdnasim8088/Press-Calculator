import type { ReactNode } from "react";
import type { HelpKey } from "@/i18n/help";
import { Help } from "@/components/ui/Help";
import { CategoryTabs } from "./CategoryTabs";

interface PageHeaderProps {
  title: string;
  /** Small Bangla/Arabic explanation under the title. */
  help?: HelpKey;
  /** Show the calculator category tabs under the title. */
  tabs?: boolean;
  badge?: ReactNode;
}

export function PageHeader({ title, help, tabs, badge }: PageHeaderProps) {
  return (
    <header className="mb-6 space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-text sm:text-3xl">
            {title}
          </h1>
          {badge}
        </div>
        <span aria-hidden className="mt-2 block h-0.5 w-24 bg-accent shadow-[0_0_12px_var(--accent)]" />
        {help && <Help k={help} className="mt-3 max-w-2xl text-sm" />}
      </div>
      {tabs && <CategoryTabs />}
    </header>
  );
}

"use client";

import { Languages } from "lucide-react";
import { HELP_LANGS } from "@/i18n/help";
import { useSettings } from "@/stores/settings";

/** EN + বাংলা / EN + عربي switch for the small explanation lines. */
export function LangToggle({ className = "" }: { className?: string }) {
  const lang = useSettings((s) => s.helpLang);
  const setLang = useSettings((s) => s.setHelpLang);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Languages size={16} className="text-muted" aria-hidden />
      <span className="font-ui text-xs font-bold tracking-widest text-text">EN +</span>
      <div role="radiogroup" aria-label="Help language" className="flex rounded-lg bg-surface-2 p-0.5">
        {HELP_LANGS.map((l) => {
          const active = l.value === lang;
          return (
            <button
              key={l.value}
              type="button"
              role="radio"
              aria-checked={active}
              lang={l.value}
              onClick={() => setLang(l.value)}
              className={`min-h-9 rounded-md px-3 text-sm font-semibold transition-colors ${
                active ? "bg-accent-gradient text-on-accent" : "text-muted hover:text-text"
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { helpText, type HelpKey } from "@/i18n/help";
import { useSettings } from "@/stores/settings";

interface HelpProps {
  k: HelpKey;
  vars?: Record<string, string>;
  className?: string;
}

/**
 * Small Bangla or Arabic explanation under an English label.
 * Server and first client render both use the default language, then it switches
 * once saved settings load, so there is no hydration mismatch.
 */
export function Help({ k, vars, className = "" }: HelpProps) {
  const lang = useSettings((s) => s.helpLang);
  // Left-aligned under its English label, unless the caller centers it.
  const align = className.includes("text-center") ? "" : "text-left";
  return (
    <span lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className={`block ${align} text-xs leading-snug text-muted ${className}`}>
      {helpText(k, lang, vars)}
    </span>
  );
}

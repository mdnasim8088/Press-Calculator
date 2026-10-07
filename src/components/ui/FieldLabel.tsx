import type { HelpKey } from "@/i18n/help";
import { Help } from "./Help";

/** English label with a small Bangla/Arabic explanation, for fields that are not NumberInputs. */
export function FieldLabel({ label, help }: { label: string; help?: HelpKey }) {
  return (
    <span className="mb-1.5 block">
      <span className="block font-ui text-sm font-bold text-text">{label}</span>
      {help && <Help k={help} />}
    </span>
  );
}

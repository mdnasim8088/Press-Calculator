import type { HelpKey } from "@/i18n/help";
import { Help } from "./Help";
import { Panel } from "./Panel";
import { Stat } from "./Stat";

/** Shown before the required fields are filled: zeros, like a fresh calculator. */
export function EmptyResult({ first, second, help }: { first: string; second: string; help: HelpKey }) {
  return (
    <Panel index={2} title="Result">
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat highlight label={first} value="0" />
        <Stat highlight label={second} value="0" />
      </div>
      <p className="mt-3 text-sm text-text">Enter the sizes to see the result.</p>
      <Help k={help} />
    </Panel>
  );
}

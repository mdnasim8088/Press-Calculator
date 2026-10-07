"use client";

import { useId, useState } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import type { Unit } from "@/core";
import { parseInput } from "@/lib/format";
import { FACTORY_DEFAULTS, useSettings, useSettingsHydrated, type CalculatorDefaults } from "@/stores/settings";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Help } from "@/components/ui/Help";
import { HudButton } from "@/components/ui/HudButton";
import { LangToggle } from "@/components/ui/LangToggle";
import { NumberInput } from "@/components/ui/NumberInput";
import { Panel } from "@/components/ui/Panel";
import { UnitSelect } from "@/components/ui/UnitSelect";

export function SettingsForm() {
  const hydrated = useSettingsHydrated();
  if (!hydrated) return <div className="glass h-72 animate-pulse rounded-xl" aria-busy />;
  return <SettingsFields />;
}

/** What the user is editing; kept as text so "0." can be typed. Nothing is stored until Save. */
interface Draft {
  currency: string;
  unit: Unit;
  price: string;
  gap: string;
}

function toDraft(d: CalculatorDefaults): Draft {
  return { currency: d.currency, unit: d.defaultUnit, price: String(d.defaultPricePerSqm), gap: String(d.defaultGap) };
}

/** Returns the values to save, or null while something is invalid. */
function fromDraft(d: Draft): CalculatorDefaults | null {
  const price = parseInput(d.price);
  const gap = parseInput(d.gap);
  const currency = d.currency.trim();
  if (!currency || !Number.isFinite(price) || price < 0 || !Number.isFinite(gap) || gap < 0) return null;
  return { currency, defaultUnit: d.unit, defaultPricePerSqm: price, defaultGap: gap };
}

function SettingsFields() {
  const s = useSettings();
  const currencyId = useId();
  const saved: CalculatorDefaults = {
    currency: s.currency,
    defaultUnit: s.defaultUnit,
    defaultPricePerSqm: s.defaultPricePerSqm,
    defaultGap: s.defaultGap,
  };
  const [draft, setDraft] = useState<Draft>(() => toDraft(saved));
  const [justSaved, setJustSaved] = useState(false);

  const edit = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setJustSaved(false);
  };

  const values = fromDraft(draft);
  const changed = values === null || JSON.stringify(values) !== JSON.stringify(saved);
  const canSave = values !== null && changed;

  const save = () => {
    if (!values) return;
    s.saveDefaults(values);
    setDraft(toDraft(values));
    setJustSaved(true);
  };

  return (
    <div className="max-w-xl space-y-5">
      <Panel index={1} title="Language">
        <FieldLabel label="Help text language" help="field.helpLang" />
        <LangToggle />
        <p className="mt-2 text-xs text-muted">Changes right away.</p>
      </Panel>

      <Panel index={2} title="Defaults">
        <div className="space-y-5">
          <div>
            <label htmlFor={currencyId} className="mb-1.5 block">
              <span className="block font-ui text-sm font-bold text-text">Currency</span>
              <Help k="field.currency" />
            </label>
            <input
              id={currencyId}
              value={draft.currency}
              maxLength={6}
              onChange={(e) => edit({ currency: e.target.value.toUpperCase() })}
              className={`min-h-11 w-full rounded-lg border bg-surface-2 px-3 font-mono text-text uppercase outline-none focus:border-accent ${
                draft.currency.trim() ? "border-border" : "border-danger"
              }`}
            />
          </div>
          <div>
            <FieldLabel label="Default unit" help="field.defaultUnit" />
            <UnitSelect value={draft.unit} onChange={(u) => edit({ unit: u })} />
          </div>
          <NumberInput
            label="Default price per m²"
            help="field.defaultPrice"
            value={draft.price}
            onChange={(v) => edit({ price: v })}
            suffix={draft.currency || FACTORY_DEFAULTS.currency}
            error={!Number.isFinite(parseInput(draft.price)) || parseInput(draft.price) < 0}
          />
          <NumberInput
            label="Default gap"
            help="field.defaultGap"
            value={draft.gap}
            onChange={(v) => edit({ gap: v })}
            suffix={draft.unit}
            error={!Number.isFinite(parseInput(draft.gap)) || parseInput(draft.gap) < 0}
          />

          <div aria-live="polite" className="min-h-10">
            {justSaved ? (
              <>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
                  <Check size={16} /> Saved
                </p>
                <Help k="settings.savedOk" />
              </>
            ) : changed ? (
              <>
                <p className="text-sm font-semibold text-warning">
                  {values ? "You have unsaved changes." : "Fix the red fields to save."}
                </p>
                <Help k={values ? "settings.unsaved" : "settings.invalid"} />
              </>
            ) : (
              <>
                <p className="text-xs text-text">Change a value, then press Save.</p>
                <Help k="settings.saved" />
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <HudButton onClick={save} disabled={!canSave}>
              <Save size={16} /> Save
            </HudButton>
            <HudButton variant="ghost" onClick={() => edit(toDraft(FACTORY_DEFAULTS))}>
              <RotateCcw size={16} /> Reset
            </HudButton>
          </div>
          <Help k="settings.resetNote" />
        </div>
      </Panel>
    </div>
  );
}

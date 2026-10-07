"use client";

import { Lock, TriangleAlert } from "lucide-react";
import { calculateSheet, pricePerSqm, type PriceMode, type SheetResult as SheetCalcResult, type Unit } from "@/core";
import { anyEmpty, formatNumber, parseInput, parseOptional } from "@/lib/format";
import { tryCalc } from "@/lib/try-calc";
import { useStoresHydrated } from "@/stores/hydration";
import { useFormState } from "@/stores/session";
import { useSettings } from "@/stores/settings";
import { EmptyResult } from "@/components/ui/EmptyResult";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { GapPicker } from "@/components/ui/GapPicker";
import { Help } from "@/components/ui/Help";
import { NumberInput } from "@/components/ui/NumberInput";
import { Panel } from "@/components/ui/Panel";
import { PriceField, PriceModeToggle } from "@/components/ui/PriceField";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { RollPreview, type RollPiece } from "./RollPreview";
import { OrientationCard, SheetResult, STICKER_UNITS } from "./SheetCalculator";

/** The cutter-sticker roll is always 1 m wide. */
const ROLL_WIDTH_METERS = 1;

interface QuantityFormState {
  quantity: string;
  width: string;
  height: string;
  gap: string;
  unit: Unit;
  price: string;
  priceMode: PriceMode;
}

/**
 * Quantity: how much 1 m roll a job needs for a number of pieces, using the sheet method.
 * (The "pieces in roll" engine, calculateSheetCapacity, is kept in src/core for later use.)
 */
export function QuantityCalculator() {
  const hydrated = useStoresHydrated();
  if (!hydrated) return <div className="glass h-96 animate-pulse rounded-xl" aria-busy />;
  return <QuantityForm />;
}

function QuantityForm() {
  const settings = useSettings();
  const currency = settings.currency;
  // A fresh visit starts empty, like a calculator showing 0; gap, unit and price come from Settings.
  const [form, update] = useFormState<QuantityFormState>("quantity", () => ({
    quantity: "",
    width: "",
    height: "",
    gap: String(settings.defaultGap),
    unit: STICKER_UNITS.includes(settings.defaultUnit) ? settings.defaultUnit : "cm",
    price: String(settings.defaultPricePerSqm),
    priceMode: "sqm",
  }));
  const { quantity, width, height, gap, unit, price, priceMode } = form;

  const input = {
    quantity: parseInput(quantity),
    itemWidth: parseInput(width),
    itemHeight: parseInput(height),
    gap: parseOptional(gap),
    unit,
    pricePerSqm: pricePerSqm(Math.max(0, parseOptional(price)), priceMode, ROLL_WIDTH_METERS),
  };
  const empty = anyEmpty(quantity, width, height);
  const sheet = tryCalc(() => calculateSheet(input));

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
      <Panel
        index={1}
        title="Input"
        className="lg:sticky lg:top-6"
        action={<PriceModeToggle mode={priceMode} onChange={(m) => update({ priceMode: m })} />}
      >
        <div className="space-y-4">
          <NumberInput label="Quantity" help="field.quantity" value={quantity} onChange={(v) => update({ quantity: v })} suffix="pcs" integer />
          <div>
            <FieldLabel label="Unit" help="field.unit" />
            <UnitSelect value={unit} onChange={(u) => update({ unit: u })} units={STICKER_UNITS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Width" help="field.stickerWidth" value={width} onChange={(v) => update({ width: v })} suffix={unit} />
            <NumberInput label="Height" help="field.stickerHeight" value={height} onChange={(v) => update({ height: v })} suffix={unit} />
          </div>
          <GapPicker value={gap} onChange={(v) => update({ gap: v })} unit={unit} />
          <PriceField mode={priceMode} value={price} onChange={(v) => update({ price: v })} currency={currency} />
          <div className="flex items-start gap-2 rounded-lg bg-surface-2/60 p-3">
            <Lock size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="text-xs text-text">Sheet method: pieces on one 1 m × 1 m sheet × number of sheets.</p>
              <Help k="roll.method" />
            </div>
          </div>
        </div>
      </Panel>

      <div className="min-w-0 space-y-5">
        {empty ? (
          <EmptyResult first="Sheets" second="Price" help="empty.result" />
        ) : !sheet.ok ? (
          <Panel index={2} title="Result">
            <p role="alert" className="flex items-center gap-2 text-sm text-danger">
              <TriangleAlert size={16} /> {sheet.error}
            </p>
          </Panel>
        ) : (
          <QuantityResult result={sheet.value} unit={unit} gap={input.gap} currency={currency} quantity={input.quantity} />
        )}
      </div>
    </div>
  );
}

/** Every sheet needed, the last sheet's empty part, and meters used after completing the row. */
function QuantityResult({
  result,
  unit,
  gap,
  currency,
  quantity,
}: {
  result: SheetCalcResult;
  unit: Unit;
  gap: number;
  currency: string;
  quantity: number;
}) {
  const { best } = result;
  const pieces: RollPiece[] = [
    ...Array.from({ length: best.sheets - 1 }, (): RollPiece => ({ kind: "full", length: best.sheetSize, rows: best.rowsPerSheet })),
    { kind: "last", length: best.sheetSize, rows: best.lastSheetRows, used: best.lastSheetUsed },
  ];
  const left = `${formatNumber(best.lastSheetRemaining)} ${unit}`;
  return (
    <>
      <SheetResult option={best} unit={unit} currency={currency} quantity={quantity} />
      <Panel index={3} title="Roll preview">
        <RollPreview
          sheetSize={best.sheetSize}
          perRow={best.perRow}
          itemWidth={best.itemWidth}
          itemHeight={best.itemHeight}
          gap={gap}
          unit={unit}
          pieces={pieces}
          caption={
            <>
              <p className="font-ui text-sm font-bold text-text">
                {best.sheets} {best.sheets === 1 ? "sheet" : "sheets"} → 1 m × {formatNumber(best.artboardLengthMeters)} m · last sheet{" "}
                <span className="text-warning">{left} empty</span> · used after completing the row{" "}
                <span className="text-accent">{formatNumber(best.usedLengthMeters, 3)} m</span>
              </p>
              <Help k="preview.sheets" vars={{ sheets: String(best.sheets), left }} className="text-center" />
            </>
          }
        />
      </Panel>
      <Panel index={4} title="Compare">
        <Help k="compare.title" className="-mt-2 mb-3" />
        <div className="grid gap-3 sm:grid-cols-2">
          <OrientationCard label="Normal" option={result.normal} best={best} unit={unit} />
          <OrientationCard label="Rotated" option={result.rotated} best={best} unit={unit} />
        </div>
      </Panel>
    </>
  );
}

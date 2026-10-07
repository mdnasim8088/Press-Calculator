"use client";

import { Lock, TriangleAlert } from "lucide-react";
import { calculateSheet, pricePerSqm, type PriceMode, type SheetOption, type SheetResult as SheetCalcResult, type Unit } from "@/core";
import { anyEmpty, formatMoney, formatNumber, parseInput, parseOptional } from "@/lib/format";
import { tryCalc } from "@/lib/try-calc";
import { useStoresHydrated } from "@/stores/hydration";
import { useFormState } from "@/stores/session";
import { useSettings } from "@/stores/settings";
import { Badge } from "@/components/ui/Badge";
import { EmptyResult } from "@/components/ui/EmptyResult";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { GapPicker } from "@/components/ui/GapPicker";
import { Help } from "@/components/ui/Help";
import { NumberInput } from "@/components/ui/NumberInput";
import { Panel } from "@/components/ui/Panel";
import { PriceField, PriceModeToggle } from "@/components/ui/PriceField";
import { Stat } from "@/components/ui/Stat";
import { StatBar } from "@/components/ui/StatBar";
import { UnitSelect } from "@/components/ui/UnitSelect";
import { RollPreview, type RollPiece } from "./RollPreview";
import { LayoutBadges, ROLL_WIDTH_METERS, STICKER_UNITS } from "./shared";

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
 * (How many pieces fit on a sheet is the Sticker Sheet page.)
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

function SheetResult({ option, unit, currency, quantity }: { option: SheetOption; unit: Unit; currency: string; quantity: number }) {
  const usedPercent = (option.lastSheetUsed / option.sheetSize) * 100;
  const used = `${formatNumber(option.lastSheetUsed)} ${unit}`;
  const left = `${formatNumber(option.lastSheetRemaining)} ${unit}`;
  return (
    <Panel
      index={2}
      title="Result"
      action={<LayoutBadges rotated={option.rotated} />}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          highlight
          label="Artboard"
          help="res.artboard"
          value={`1 m × ${formatNumber(option.artboardLengthMeters)} m`}
          hint={`${formatNumber(option.artboardAreaSqm)} m²`}
        />
        <Stat highlight label="Price" help="res.price" value={formatMoney(option.price, currency)} hint="Full sheets charged" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Sheets" help="res.sheets" value={option.sheets} hint={`${option.fullSheets} full + ${option.sheets - option.fullSheets} last`} />
        <Stat label="Per sheet" help="res.perSheet" value={option.perSheet} hint={`${option.perRow} × ${option.rowsPerSheet} rows`} />
        <Stat
          label="Total pieces"
          help="res.produced"
          value={formatNumber(option.produced, 0)}
          hint={option.extra > 0 ? `+${option.extra} extra (row completed)` : `exactly ${formatNumber(quantity, 0)}`}
        />
        <Stat label="Used length" help="res.usedLength" value={`${formatNumber(option.usedLengthMeters, 3)} m`} hint={`${formatNumber(option.usedAreaSqm, 3)} m²`} />
        <Stat label="Used price" help="res.usedPrice" value={formatMoney(option.usedPrice, currency)} hint="Used length only" />
        <Stat label="Last sheet" help="res.lastSheetCount" value={option.lastSheetCount} hint={`${option.lastSheetRows} full rows`} />
      </div>

      <div className="mt-4 rounded-lg border border-warning/40 bg-warning/5 p-4">
        <p className="font-ui text-base font-bold text-text">
          Last sheet: <span className="text-accent">{used}</span> used · <span className="text-warning">{left}</span> left
        </p>
        <Help k="res.lastSheet" vars={{ used, left }} className="mt-0.5 text-sm" />
        <div className="mt-3">
          <StatBar
            label="Last sheet used"
            percent={usedPercent}
            valueLabel={`${formatNumber(usedPercent, 1)}%`}
            tone={usedPercent < 50 ? "warning" : "accent"}
          />
        </div>
      </div>
    </Panel>
  );
}

function OrientationCard({ label, option, best, unit }: { label: string; option: SheetOption | null; best: SheetOption; unit: Unit }) {
  if (!option) {
    return (
      <div className="rounded-lg border border-border p-4 text-sm">
        <span className="font-ui text-sm font-bold tracking-widest text-text uppercase">{label}</span>
        <p className="mt-2 text-muted">Square sticker: rotating gives the same result.</p>
        <Help k="compare.square" />
      </div>
    );
  }
  const isBest = option.rotated === best.rotated;
  return (
    <div className={`rounded-lg border p-4 ${isBest ? "border-success/60 bg-success/5" : "border-border"}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-ui text-sm font-bold tracking-widest text-text uppercase">
          {label} {formatNumber(option.itemWidth)} × {formatNumber(option.itemHeight)}
        </span>
        {isBest && <Badge tone="success">Best</Badge>}
      </div>
      <dl className="grid grid-cols-2 gap-y-1 text-sm">
        <dt className="text-muted">Per sheet</dt>
        <dd className="text-right font-mono tabular-nums">{option.perSheet}</dd>
        <dt className="text-muted">Sheets</dt>
        <dd className="text-right font-mono tabular-nums">{option.sheets}</dd>
        <dt className="text-muted">Last sheet used</dt>
        <dd className="text-right font-mono tabular-nums">{formatNumber(option.lastSheetUsed)} {unit}</dd>
        <dt className="text-muted">Left</dt>
        <dd className="text-right font-mono tabular-nums">{formatNumber(option.lastSheetRemaining)} {unit}</dd>
      </dl>
    </div>
  );
}

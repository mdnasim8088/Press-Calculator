"use client";

import { Lock, TriangleAlert } from "lucide-react";
import {
  calculateSheetCapacity,
  convert,
  pricePerSqm,
  roundTo,
  toMeters,
  UNITS,
  type PriceMode,
  type SheetCapacityOption,
  type SheetCapacityResult,
  type Unit,
} from "@/core";
import { anyEmpty, formatMoney, formatNumber, parseInput, parseOptional } from "@/lib/format";
import { tryCalc } from "@/lib/try-calc";
import { unitLabel } from "@/lib/unit-labels";
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
import { UnitSelect } from "@/components/ui/UnitSelect";
import { RollPreview, type RollPiece } from "./RollPreview";
import { LayoutBadges, ROLL_WIDTH_METERS, STICKER_UNITS } from "./shared";

interface StickerSheetFormState {
  /** Sheet length; the width is always 1 m. */
  length: string;
  lengthUnit: Unit;
  width: string;
  height: string;
  gap: string;
  unit: Unit;
  price: string;
  priceMode: PriceMode;
}

/**
 * Sticker Sheet: how many complete stickers fit on a 1 m × N m sheet (e.g. 1 m × 1 m).
 * Uses the sheet method: pieces on one 1 m × 1 m sheet × number of sheets, plus whole rows in any extra length.
 */
export function StickerCalculator() {
  const hydrated = useStoresHydrated();
  if (!hydrated) return <div className="glass h-96 animate-pulse rounded-xl" aria-busy />;
  return <StickerSheetForm />;
}

function StickerSheetForm() {
  const settings = useSettings();
  const currency = settings.currency;
  // A fresh visit starts empty, like a calculator showing 0; gap, unit and price come from Settings.
  const [form, update] = useFormState<StickerSheetFormState>("sticker-sheet", () => ({
    length: "",
    lengthUnit: "m",
    width: "",
    height: "",
    gap: String(settings.defaultGap),
    unit: STICKER_UNITS.includes(settings.defaultUnit) ? settings.defaultUnit : "cm",
    price: String(settings.defaultPricePerSqm),
    priceMode: "sqm",
  }));
  const { length, lengthUnit, width, height, gap, unit, price, priceMode } = form;

  // Switching the length unit converts the typed value, so the length stays the same (1 m → 100 cm).
  const changeLengthUnit = (next: string) => {
    const nextUnit = next as Unit;
    const current = parseInput(length);
    update({
      lengthUnit: nextUnit,
      ...(Number.isFinite(current) && { length: String(roundTo(convert(current, lengthUnit, nextUnit), 4)) }),
    });
  };

  const gapValue = parseOptional(gap);
  const empty = anyEmpty(length, width, height);
  const result = tryCalc(() =>
    calculateSheetCapacity({
      lengthMeters: toMeters(parseInput(length), lengthUnit),
      itemWidth: parseInput(width),
      itemHeight: parseInput(height),
      gap: gapValue,
      unit,
      pricePerSqm: pricePerSqm(Math.max(0, parseOptional(price)), priceMode, ROLL_WIDTH_METERS),
    }),
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
      <Panel
        index={1}
        title="Input"
        className="lg:sticky lg:top-6"
        action={<PriceModeToggle mode={priceMode} onChange={(m) => update({ priceMode: m })} />}
      >
        <div className="space-y-4">
          <NumberInput
            label="Sheet length"
            help="field.sheetLength"
            value={length}
            onChange={(v) => update({ length: v })}
            suffix={lengthUnit}
            suffixOptions={UNITS.map((u) => ({ value: u, label: unitLabel(u) }))}
            onSuffixChange={changeLengthUnit}
          />
          <div>
            <FieldLabel label="Sticker unit" help="field.unit" />
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
              <p className="text-xs text-text">Width is always 1 m. Pieces on one 1 m × 1 m sheet × number of sheets.</p>
              <Help k="roll.method" />
            </div>
          </div>
        </div>
      </Panel>

      <div className="min-w-0 space-y-5">
        {empty ? (
          <EmptyResult first="Total pieces" second="Price" help="empty.sheetLength" />
        ) : !result.ok ? (
          <Panel index={2} title="Result">
            <p role="alert" className="flex items-center gap-2 text-sm text-danger">
              <TriangleAlert size={16} /> {result.error}
            </p>
          </Panel>
        ) : (
          <CapacityResult result={result.value} unit={unit} gap={gapValue} currency={currency} />
        )}
      </div>
    </div>
  );
}

function CapacityResult({ result, unit, gap, currency }: { result: SheetCapacityResult; unit: Unit; gap: number; currency: string }) {
  const { best } = result;
  const sheets = formatNumber(best.fullSheets);
  const pieces: RollPiece[] = [
    ...Array.from({ length: best.fullSheets }, (): RollPiece => ({ kind: "full", length: best.sheetSize, rows: best.rowsPerSheet })),
    ...(best.partialLength > 0 ? [{ kind: "extra" as const, length: best.partialLength, rows: best.partialRows }] : []),
  ];
  return (
    <>
      <Panel index={2} title="Result" action={<LayoutBadges rotated={best.rotated} />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat
            highlight
            label="Total pieces"
            help="res.totalFit"
            value={`${formatNumber(best.total, 0)} pcs`}
            hint={
              <>
                {best.perSheet} per sheet × {sheets} {best.fullSheets === 1 ? "sheet" : "sheets"}
                {best.partialCount > 0 && ` + ${best.partialCount}`}
                <Help k="res.formula" vars={{ perSheet: String(best.perSheet), sheets }} />
              </>
            }
          />
          <Stat
            highlight
            label="Price"
            help="res.sheetPrice"
            value={formatMoney(result.price, currency)}
            hint={`1 m × ${formatNumber(result.lengthMeters, 3)} m · ${formatNumber(result.areaSqm, 3)} m²`}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Per sheet" help="res.perSheet" value={best.perSheet} hint={`${best.perRow} × ${best.rowsPerSheet} rows · 1 m × 1 m`} />
          <Stat label="Full sheets" help="res.fullSheets" value={sheets} />
          {best.partialLength > 0 && (
            <Stat
              label="Extra length"
              help="res.partial"
              value={`${best.partialCount} pcs`}
              hint={`${formatNumber(best.partialLength)} ${unit} · ${best.partialRows} rows`}
            />
          )}
          <Stat label="Per piece" help="res.pricePerPiece" value={`${formatNumber(result.pricePerPiece, 3)} ${currency}`} />
          <Stat
            label="Left per sheet"
            help="res.leftPerSheet"
            value={`${formatNumber(best.remainingPerSheet)} ${unit}`}
            hint={`width left ${formatNumber(best.remainingWidth)} ${unit}`}
          />
        </div>
      </Panel>

      <Panel index={3} title="Sheet preview">
        <RollPreview
          sheetSize={best.sheetSize}
          perRow={best.perRow}
          itemWidth={best.itemWidth}
          itemHeight={best.itemHeight}
          gap={gap}
          unit={unit}
          pieces={pieces}
        />
      </Panel>

      <Panel index={4} title="Compare">
        <Help k="compare.title" className="-mt-2 mb-3" />
        <div className="grid gap-3 sm:grid-cols-2">
          <CapacityCard label="Normal" option={result.normal} best={best} />
          <CapacityCard label="Rotated" option={result.rotated} best={best} />
        </div>
        <div className="mt-3 rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-ui text-sm font-bold tracking-widest text-text uppercase">Without sheet breaks</span>
            <Badge tone="muted">Compare</Badge>
          </div>
          <p className="font-mono text-sm text-text">{formatNumber(result.continuous.total, 0)} pcs</p>
          <Help k="compare.continuous" className="mt-1" />
        </div>
      </Panel>
    </>
  );
}

function CapacityCard({ label, option, best }: { label: string; option: SheetCapacityOption | null; best: SheetCapacityOption }) {
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
        <dt className="text-muted">Total</dt>
        <dd className="text-right font-mono tabular-nums">{formatNumber(option.total, 0)}</dd>
      </dl>
    </div>
  );
}

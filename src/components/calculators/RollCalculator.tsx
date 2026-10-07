"use client";

import { Lock, RotateCw, TriangleAlert } from "lucide-react";
import {
  calculateSheet,
  calculateSheetCapacity,
  convert,
  pricePerSqm,
  roundTo,
  toMeters,
  UNITS,
  type PriceMode,
  type SheetCapacityOption,
  type SheetCapacityResult,
  type SheetResult as SheetCalcResult,
  type Unit,
} from "@/core";
import type { HelpKey } from "@/i18n/help";
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
import { OrientationCard, SheetResult, STICKER_UNITS } from "./SheetCalculator";

/** The cutter-sticker roll is always 1 m wide. */
const ROLL_WIDTH_METERS = 1;

type Mode = "capacity" | "quantity";
const MODES: { value: Mode; label: string; help: HelpKey }[] = [
  { value: "capacity", label: "Pieces in roll", help: "roll.modeCapacity" },
  { value: "quantity", label: "Roll for quantity", help: "roll.modeLength" },
];

interface RollFormState {
  mode: Mode;
  rollLength: string;
  rollUnit: Unit;
  quantity: string;
  width: string;
  height: string;
  gap: string;
  unit: Unit;
  price: string;
  priceMode: PriceMode;
}

export function RollCalculator() {
  const hydrated = useStoresHydrated();
  if (!hydrated) return <div className="glass h-96 animate-pulse rounded-xl" aria-busy />;
  return <RollForm />;
}

function RollForm() {
  const settings = useSettings();
  const currency = settings.currency;
  // A fresh visit starts empty, like a calculator showing 0; gap, unit and price come from Settings.
  const [form, update] = useFormState<RollFormState>("roll", () => ({
    mode: "capacity",
    rollLength: "",
    rollUnit: "m",
    quantity: "",
    width: "",
    height: "",
    gap: String(settings.defaultGap),
    unit: STICKER_UNITS.includes(settings.defaultUnit) ? settings.defaultUnit : "cm",
    price: String(settings.defaultPricePerSqm),
    priceMode: "sqm",
  }));
  const { mode, rollLength, rollUnit, quantity, width, height, gap, unit, price, priceMode } = form;

  const sticker = {
    itemWidth: parseInput(width),
    itemHeight: parseInput(height),
    gap: parseOptional(gap),
    unit,
    pricePerSqm: pricePerSqm(Math.max(0, parseOptional(price)), priceMode, ROLL_WIDTH_METERS),
  };

  // Switching the roll-length unit converts the typed value, so the length stays the same (5 m → 500 cm).
  const changeRollUnit = (next: string) => {
    const nextUnit = next as Unit;
    const current = parseInput(rollLength);
    update({
      rollUnit: nextUnit,
      ...(Number.isFinite(current) && { rollLength: String(roundTo(convert(current, rollUnit, nextUnit), 4)) }),
    });
  };

  const empty = mode === "capacity" ? anyEmpty(rollLength, width, height) : anyEmpty(quantity, width, height);
  const capacity = tryCalc(() =>
    calculateSheetCapacity({ ...sticker, lengthMeters: toMeters(parseInput(rollLength), rollUnit) }),
  );
  const sheet = tryCalc(() => calculateSheet({ ...sticker, quantity: parseInput(quantity) }));
  const outcome = mode === "capacity" ? capacity : sheet;

  return (
    <div className="space-y-5">
      <div role="radiogroup" aria-label="Roll option" className="grid gap-2 sm:grid-cols-2">
        {MODES.map((m) => {
          const active = m.value === mode;
          return (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => update({ mode: m.value })}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active ? "border-accent bg-accent/10 glow" : "glass hover:border-accent/50"
              }`}
            >
              <span className={`block font-ui text-base font-bold tracking-wider uppercase ${active ? "text-accent" : "text-text"}`}>
                {m.label}
              </span>
              <Help k={m.help} className="mt-0.5 text-sm" />
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
        <Panel
          index={1}
          title="Input"
          className="lg:sticky lg:top-6"
          action={<PriceModeToggle mode={priceMode} onChange={(m) => update({ priceMode: m })} />}
        >
          <div className="space-y-4">
            {mode === "capacity" ? (
              <NumberInput
                label="Roll length"
                help="field.rollLength"
                value={rollLength}
                onChange={(v) => update({ rollLength: v })}
                suffix={rollUnit}
                suffixOptions={UNITS.map((u) => ({ value: u, label: unitLabel(u) }))}
                onSuffixChange={changeRollUnit}
              />
            ) : (
              <NumberInput label="Quantity" help="field.quantity" value={quantity} onChange={(v) => update({ quantity: v })} suffix="pcs" integer />
            )}
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
            mode === "capacity" ? (
              <EmptyResult first="Total pieces" second="Roll price" help="empty.roll" />
            ) : (
              <EmptyResult first="Sheets" second="Price" help="empty.result" />
            )
          ) : !outcome.ok ? (
            <Panel index={2} title="Result">
              <p role="alert" className="flex items-center gap-2 text-sm text-danger">
                <TriangleAlert size={16} /> {outcome.error}
              </p>
            </Panel>
          ) : mode === "capacity" && capacity.ok ? (
            <CapacityResult result={capacity.value} unit={unit} gap={sticker.gap} currency={currency} />
          ) : (
            sheet.ok && (
              <QuantityResult result={sheet.value} unit={unit} gap={sticker.gap} currency={currency} quantity={parseInput(quantity)} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function LayoutBadges({ rotated }: { rotated: boolean }) {
  return (
    <span className="flex gap-1.5">
      <Badge tone="success">Best layout</Badge>
      {rotated && (
        <Badge>
          <RotateCw size={12} /> Rotated
        </Badge>
      )}
    </span>
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
                {best.perSheet} per sheet × {sheets} sheets
                {best.partialCount > 0 && ` + ${best.partialCount}`}
                <Help k="res.formula" vars={{ perSheet: String(best.perSheet), sheets }} />
              </>
            }
          />
          <Stat
            highlight
            label="Roll"
            help="res.rollSize"
            value={`1 m × ${formatNumber(result.lengthMeters, 3)} m`}
            hint={`${formatNumber(result.areaSqm, 3)} m²`}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Per sheet" help="res.perSheet" value={best.perSheet} hint={`${best.perRow} × ${best.rowsPerSheet} rows`} />
          <Stat label="Full sheets" help="res.fullSheets" value={sheets} hint="1 m × 1 m each" />
          {best.partialLength > 0 && (
            <Stat
              label="Extra length"
              help="res.partial"
              value={`${best.partialCount} pcs`}
              hint={`${formatNumber(best.partialLength)} ${unit} · ${best.partialRows} rows`}
            />
          )}
          <Stat label="Roll price" help="res.rollPrice" value={formatMoney(result.price, currency)} />
          <Stat label="Per piece" help="res.pricePerPiece" value={`${formatNumber(result.pricePerPiece, 3)} ${currency}`} />
          <Stat
            label="Left per sheet"
            help="res.leftPerSheet"
            value={`${formatNumber(best.remainingPerSheet)} ${unit}`}
            hint={`width left ${formatNumber(best.remainingWidth)} ${unit}`}
          />
        </div>
      </Panel>

      <Panel index={3} title="Roll preview">
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

/** Roll for quantity, with the sheet method: every sheet needed, the last sheet's empty part, and meters used. */
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

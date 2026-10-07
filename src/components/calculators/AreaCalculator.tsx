"use client";

import { TriangleAlert } from "lucide-react";
import { calculateArea, type Unit } from "@/core";
import { anyEmpty, formatMoney, formatNumber, parseInput, parseOptional } from "@/lib/format";
import { tryCalc } from "@/lib/try-calc";
import { useStoresHydrated } from "@/stores/hydration";
import { useFormState } from "@/stores/session";
import { useSettings } from "@/stores/settings";
import { EmptyResult } from "@/components/ui/EmptyResult";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Help } from "@/components/ui/Help";
import { NumberInput } from "@/components/ui/NumberInput";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { UnitSelect } from "@/components/ui/UnitSelect";

interface AreaFormState {
  width: string;
  height: string;
  unit: Unit;
  price: string;
  quantity: string;
}

export function AreaCalculator() {
  const hydrated = useStoresHydrated();
  if (!hydrated) return <div className="glass h-96 animate-pulse rounded-xl" aria-busy />;
  return <AreaForm />;
}

function AreaForm() {
  const settings = useSettings();
  const currency = settings.currency;
  // A fresh visit starts empty, like a calculator showing 0; unit and price come from Settings.
  const [form, update] = useFormState<AreaFormState>("area", () => ({
    width: "",
    height: "",
    unit: settings.defaultUnit,
    price: String(settings.defaultPricePerSqm),
    quantity: "1",
  }));
  const { width, height, unit, price, quantity } = form;

  const w = parseInput(width);
  const h = parseInput(height);
  const p = Math.max(0, parseOptional(price));
  const q = quantity.trim() === "" ? 1 : parseInput(quantity);
  const result = tryCalc(() => calculateArea({ width: w, height: h, unit, pricePerSqm: p, quantity: q }));

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
      <Panel index={1} title="Input">
        <div className="space-y-4">
          <div>
            <FieldLabel label="Unit" help="field.unit" />
            <UnitSelect value={unit} onChange={(u) => update({ unit: u })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Width" help="field.width" value={width} onChange={(v) => update({ width: v })} suffix={unit} />
            <NumberInput label="Height" help="field.height" value={height} onChange={(v) => update({ height: v })} suffix={unit} />
          </div>
          <NumberInput label="Price per m²" help="field.price" value={price} onChange={(v) => update({ price: v })} suffix={`${currency}/m²`} hint="Optional" />
          <NumberInput label="Quantity" help="field.pieces" value={quantity} onChange={(v) => update({ quantity: v })} suffix="pcs" integer />
        </div>
      </Panel>

      {anyEmpty(width, height) ? (
        <EmptyResult first="Total price" second="Total area" help="empty.area" />
      ) : (
      <Panel index={2} title="Result">
        {!result.ok ? (
          <p role="alert" className="flex items-center gap-2 text-sm text-danger">
            <TriangleAlert size={16} /> {result.error}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat highlight label="Total price" help="res.total" value={formatMoney(result.value.totalPrice, currency)} />
              <Stat highlight label="Total area" help="res.area" value={`${formatNumber(result.value.totalAreaSqm, 4)} m²`} />
            </div>

            <div>
              <h3 className="font-ui text-xs font-semibold tracking-widest text-text uppercase">Step by step</h3>
              <Help k="res.steps" className="mb-2" />
              <ol className="space-y-2 font-mono text-sm tabular-nums">
                <Step n={1}>
                  {formatNumber(w, 4)} {unit} = <b className="text-accent">{formatNumber(result.value.widthMeters, 4)} m</b>
                </Step>
                <Step n={2}>
                  {formatNumber(h, 4)} {unit} = <b className="text-accent">{formatNumber(result.value.heightMeters, 4)} m</b>
                </Step>
                <Step n={3}>
                  {formatNumber(result.value.widthMeters, 4)} × {formatNumber(result.value.heightMeters, 4)} ={" "}
                  <b className="text-accent">{formatNumber(result.value.areaSqm, 4)} m²</b>
                </Step>
                <Step n={4}>
                  {formatNumber(result.value.areaSqm, 4)} × {formatNumber(p)} ={" "}
                  <b className="text-accent">{formatMoney(result.value.unitPrice, currency)}</b>
                </Step>
                {q > 1 && (
                  <Step n={5}>
                    {formatMoney(result.value.unitPrice, currency)} × {q} ={" "}
                    <b className="text-accent">{formatMoney(result.value.totalPrice, currency)}</b>
                  </Step>
                )}
              </ol>
            </div>
          </div>
        )}
      </Panel>
      )}
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-3 rounded-lg bg-surface-2/60 px-3 py-2">
      <span className="font-display text-xs text-muted">{String(n).padStart(2, "0")}</span>
      <span className="min-w-0 break-words text-text">{children}</span>
    </li>
  );
}

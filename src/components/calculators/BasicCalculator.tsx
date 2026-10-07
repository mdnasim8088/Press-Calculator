"use client";

import { useEffect, useReducer } from "react";
import { Delete } from "lucide-react";
import { evaluateExpression } from "@/core";
import { formatNumber } from "@/lib/format";
import { tryCalc } from "@/lib/try-calc";
import { useSession, useSessionHydrated } from "@/stores/session";
import { Help } from "@/components/ui/Help";
import { Panel } from "@/components/ui/Panel";

type KeyKind = "num" | "op" | "fn" | "eq";
interface KeyDef {
  label: string;
  /** Text appended to the expression; undefined for special keys. */
  insert?: string;
  action?: "clear" | "equals";
  kind: KeyKind;
  aria?: string;
}

const KEYS: KeyDef[] = [
  { label: "C", action: "clear", kind: "fn", aria: "Clear" },
  { label: "(", insert: "(", kind: "fn" },
  { label: ")", insert: ")", kind: "fn" },
  { label: "÷", insert: "÷", kind: "op", aria: "Divide" },
  { label: "7", insert: "7", kind: "num" },
  { label: "8", insert: "8", kind: "num" },
  { label: "9", insert: "9", kind: "num" },
  { label: "×", insert: "×", kind: "op", aria: "Multiply" },
  { label: "4", insert: "4", kind: "num" },
  { label: "5", insert: "5", kind: "num" },
  { label: "6", insert: "6", kind: "num" },
  { label: "−", insert: "−", kind: "op", aria: "Minus" },
  { label: "1", insert: "1", kind: "num" },
  { label: "2", insert: "2", kind: "num" },
  { label: "3", insert: "3", kind: "num" },
  { label: "+", insert: "+", kind: "op", aria: "Plus" },
  { label: "%", insert: "%", kind: "fn", aria: "Percent" },
  { label: "0", insert: "0", kind: "num" },
  { label: ".", insert: ".", kind: "num", aria: "Decimal point" },
  { label: "=", action: "equals", kind: "eq", aria: "Equals" },
];

const KEY_STYLE: Record<KeyKind, string> = {
  num: "bg-surface-2 text-text hover:bg-accent-soft",
  op: "bg-accent/15 text-accent hover:bg-accent/25",
  fn: "bg-surface-2/60 text-muted hover:text-text",
  eq: "bg-accent text-bg hover:bg-accent-strong shadow-[0_0_18px_var(--accent-glow)]",
};

/** Keyboard keys mapped to calculator input. */
const KEYBOARD: Record<string, string> = {
  "*": "×",
  x: "×",
  "/": "÷",
  "-": "−",
  "+": "+",
  "%": "%",
  "(": "(",
  ")": ")",
  ".": ".",
  ",": ".",
};

interface TapeEntry {
  expression: string;
  result: number;
}

interface CalcState {
  expression: string;
  /** True right after "=": typing a number starts a new calculation. */
  justEvaluated: boolean;
  tape: TapeEntry[];
}

type CalcAction =
  | { type: "insert"; text: string }
  | { type: "backspace" }
  | { type: "clear" }
  | { type: "equals" }
  | { type: "recall"; value: number };

// A reducer so rapid key presses always see the latest state.
function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case "insert": {
      const fresh = state.justEvaluated && /[0-9.(]/.test(action.text);
      return { ...state, expression: fresh ? action.text : state.expression + action.text, justEvaluated: false };
    }
    case "backspace":
      return { ...state, expression: state.expression.slice(0, -1), justEvaluated: false };
    case "clear":
      return { ...state, expression: "", justEvaluated: false };
    case "equals": {
      const outcome = tryCalc(() => evaluateExpression(state.expression));
      if (!outcome.ok) return state;
      return {
        expression: String(outcome.value),
        justEvaluated: true,
        tape: [{ expression: state.expression, result: outcome.value }, ...state.tape].slice(0, 6),
      };
    }
    case "recall":
      return { ...state, expression: String(action.value), justEvaluated: true };
  }
}

const FRESH: CalcState = { expression: "", justEvaluated: false, tape: [] };

export function BasicCalculator() {
  const hydrated = useSessionHydrated();
  if (!hydrated) return <div className="glass mx-auto h-96 max-w-4xl animate-pulse rounded-xl" aria-busy />;
  return <CalculatorBody />;
}

function CalculatorBody() {
  // Restores the display and tape from earlier in this visit; a new visit starts at 0.
  const [state, dispatch] = useReducer(reducer, undefined, () => (useSession.getState().forms.calculator as CalcState | undefined) ?? FRESH);
  const { expression, tape } = state;
  const setForm = useSession((s) => s.setForm);
  useEffect(() => setForm("calculator", state), [state, setForm]);

  const preview = expression ? tryCalc(() => evaluateExpression(expression)) : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (/^[0-9]$/.test(e.key)) dispatch({ type: "insert", text: e.key });
      else if (e.key in KEYBOARD) dispatch({ type: "insert", text: KEYBOARD[e.key] });
      else if (e.key === "Enter" || e.key === "=") dispatch({ type: "equals" });
      else if (e.key === "Backspace") dispatch({ type: "backspace" });
      else if (e.key === "Escape" || e.key === "Delete") dispatch({ type: "clear" });
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const press = (key: KeyDef) => {
    if (key.action === "clear") dispatch({ type: "clear" });
    else if (key.action === "equals") dispatch({ type: "equals" });
    else if (key.insert) dispatch({ type: "insert", text: key.insert });
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
      <Panel index={1} title="Calculator">
        <div className="mb-4 rounded-xl border border-border bg-bg/60 p-4" aria-live="polite">
          <div className="flex items-start gap-2">
            <div className="no-scrollbar min-h-7 flex-1 overflow-x-auto text-right font-mono text-lg whitespace-nowrap text-muted">
              {expression || "0"}
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: "backspace" })}
              aria-label="Backspace"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-text"
            >
              <Delete size={18} />
            </button>
          </div>
          <div className="mt-2 min-h-10 text-right font-mono text-3xl font-semibold text-accent tabular-nums text-glow sm:text-4xl">
            {preview?.ok ? formatNumber(preview.value, 10) : preview ? <span className="text-base text-muted">…</span> : "0"}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {KEYS.map((key) => (
            <button
              key={key.label}
              type="button"
              aria-label={key.aria ?? key.label}
              onClick={() => press(key)}
              className={`hud-clip-sm min-h-14 font-mono text-xl font-semibold transition-colors active:scale-95 ${KEY_STYLE[key.kind]}`}
            >
              {key.label}
            </button>
          ))}
        </div>
        <Help k="calc.keyboard" className="mt-3 hidden md:block" />
      </Panel>

      <Panel index={2} title="Tape">
        <Help k="calc.tape" className="-mt-2 mb-3" />
        {tape.length === 0 ? (
          <p className="text-sm text-muted">No calculations yet.</p>
        ) : (
          <ul className="space-y-2">
            {tape.map((entry, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "recall", value: entry.result })}
                  className="w-full rounded-lg bg-surface-2/60 px-3 py-2 text-right transition-colors hover:bg-surface-2"
                >
                  <span className="block truncate font-mono text-xs text-muted">{entry.expression} =</span>
                  <span className="block font-mono text-lg text-text tabular-nums">{formatNumber(entry.result, 10)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

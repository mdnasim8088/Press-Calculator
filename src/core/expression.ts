import { clean } from "./units";
import { CalculationError } from "./validation";

type Token =
  | { type: "num"; value: number }
  | { type: "op"; value: "+" | "-" | "*" | "/" }
  | { type: "pct" }
  | { type: "lparen" }
  | { type: "rparen" };

/** A value plus whether it was written as a percentage (e.g. "10%"). */
interface Operand {
  value: number;
  percent: boolean;
}

const OP_ALIASES: Record<string, "+" | "-" | "*" | "/"> = {
  "+": "+",
  "-": "-",
  "−": "-",
  "*": "*",
  "×": "*",
  x: "*",
  "/": "/",
  "÷": "/",
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (ch === " ") {
      i++;
    } else if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < input.length && /[0-9.]/.test(input[j])) j++;
      const text = input.slice(i, j);
      if (text === "." || (text.match(/\./g)?.length ?? 0) > 1) {
        throw new CalculationError("Invalid number");
      }
      tokens.push({ type: "num", value: Number(text) });
      i = j;
    } else if (ch in OP_ALIASES) {
      tokens.push({ type: "op", value: OP_ALIASES[ch] });
      i++;
    } else if (ch === "%") {
      tokens.push({ type: "pct" });
      i++;
    } else if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
    } else if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
    } else {
      throw new CalculationError(`Unexpected character "${ch}"`);
    }
  }
  return tokens;
}

/**
 * Recursive-descent parser for the normal calculator.
 * Percent works like a phone calculator:
 *   200 + 10%  = 220   (10% of the left side)
 *   200 × 10%  = 20    (10% as 0.10)
 *   50%        = 0.5
 */
class Parser {
  private pos = 0;
  constructor(private readonly tokens: Token[]) {}

  parse(): number {
    if (this.tokens.length === 0) throw new CalculationError("Empty expression");
    const result = this.expression();
    if (this.pos < this.tokens.length) throw new CalculationError("Invalid expression");
    return result.percent ? result.value / 100 : result.value;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private expression(): Operand {
    const first = this.term();
    let value = first.percent ? first.value / 100 : first.value;
    let single = true;
    for (let t = this.peek(); t?.type === "op" && (t.value === "+" || t.value === "-"); t = this.peek()) {
      this.pos++;
      const right = this.term();
      const amount = right.percent ? (value * right.value) / 100 : right.value;
      value = t.value === "+" ? value + amount : value - amount;
      single = false;
    }
    return single ? first : { value, percent: false };
  }

  private term(): Operand {
    const first = this.factor();
    let value = first.value;
    let single = true;
    for (let t = this.peek(); t?.type === "op" && (t.value === "*" || t.value === "/"); t = this.peek()) {
      this.pos++;
      const right = this.factor();
      const left = single && first.percent ? value / 100 : value;
      const r = right.percent ? right.value / 100 : right.value;
      if (t.value === "/" && r === 0) throw new CalculationError("Cannot divide by zero");
      value = t.value === "*" ? left * r : left / r;
      single = false;
    }
    return single ? first : { value, percent: false };
  }

  private factor(): Operand {
    const t = this.peek();
    if (t?.type === "op" && (t.value === "-" || t.value === "+")) {
      this.pos++;
      const inner = this.factor();
      return { value: t.value === "-" ? -inner.value : inner.value, percent: inner.percent };
    }
    const value = this.primary();
    if (this.peek()?.type === "pct") {
      this.pos++;
      return { value, percent: true };
    }
    return { value, percent: false };
  }

  private primary(): number {
    const t = this.peek();
    if (t?.type === "num") {
      this.pos++;
      return t.value;
    }
    if (t?.type === "lparen") {
      this.pos++;
      const inner = this.expression();
      if (this.peek()?.type !== "rparen") throw new CalculationError("Missing )");
      this.pos++;
      return inner.percent ? inner.value / 100 : inner.value;
    }
    throw new CalculationError("Invalid expression");
  }
}

/** Evaluates a calculator expression such as "2+3×4" or "200+10%". Never uses eval(). */
export function evaluateExpression(input: string): number {
  const value = new Parser(tokenize(input)).parse();
  if (!Number.isFinite(value)) throw new CalculationError("Result is too large");
  return clean(value, 10);
}

export function formatNumber(value: number, maxDecimals = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

export function formatMoney(value: number, currency: string): string {
  const amount = value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount} ${currency}`;
}

/** Parses a text input value; empty or invalid text becomes NaN. */
export function parseInput(text: string): number {
  if (text.trim() === "") return Number.NaN;
  return Number(text);
}

/** For optional fields such as price or gap: empty means 0, so the other results still work. */
export function parseOptional(text: string): number {
  return text.trim() === "" ? 0 : Number(text);
}

/** True when any required field is still empty (show the empty result instead of an error). */
export function anyEmpty(...texts: string[]): boolean {
  return texts.some((t) => t.trim() === "");
}

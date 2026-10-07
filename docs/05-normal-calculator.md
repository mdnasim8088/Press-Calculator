# 05 · Normal Calculator  ✅ built

Route: `/calculator` · UI: `BasicCalculator.tsx` · Engine: `evaluateExpression()` in `src/core/expression.ts` · Tests: `tests/expression.test.ts` (20)

Featured as the first option on the home page.

## Scope
- Basic + − × ÷, percent, clear/backspace, decimal.
- Large keypad (≥ 56px keys) for phone use; keyboard input on desktop.
- Shows the expression and the result; the last result can be copied or sent to another calculator field.

## Design notes
- Evaluate with a small tokenizer/parser in `src/core/expression.ts`, **not** `eval`.
- Decimal handling through `clean()` to avoid 0.1 + 0.2 = 0.30000000000000004.
- Each finished calculation is pushed to History (doc 13).

## Tests to add
`2+3*4 = 14`, `0.1+0.2 = 0.3`, `50%` of 200 = 100, division by zero → error message.

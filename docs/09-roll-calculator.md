# 09 · Roll Calculator  ✅ built

Route: `/roll` · UI: `RollCalculator.tsx`, `RollPreview.tsx` · Engine: `calculateSheetCapacity()` (`src/core/capacity.ts`), `calculateRoll()` (`src/core/roll.ts`) · Tests: `tests/capacity.test.ts` (6)

Width is always 1 m (cutter sticker rule). The page has two options.

## Option 1: Pieces in roll (default), using the sheet method
*"How many 10 × 8 cm stickers fit in a 1 m × 5 m roll?"*

1. Count complete stickers on one 1 m × 1 m sheet (packing rule, both orientations).
2. Multiply by the number of full sheets: `floor(length m)`.
3. If the length has an extra part (e.g. 5.5 m → 50 cm), add the whole rows that fit in it.
4. The orientation with more pieces wins.

| Input | Result |
|---|---|
| 1 m × 5 m, 10 × 8 cm, gap 0.5 | 9 × 11 = **99 per sheet × 5 = 495 pcs** · 7 cm left per sheet · 250 SAR · 0.505 SAR/pc |
| same, gap 0 | 120 per sheet × 5 = **600 pcs** |
| 1 m × 5.5 m | 495 + 5 rows × 9 = **540 pcs** |
| 1 m × 0.5 m | 45 pcs (no full sheet) |

For comparison the page also shows the count for one continuous grid without sheet breaks (522 for the first example).

Outputs: total pieces, roll size and m², per sheet (perRow × rows), full sheets, extra-length pieces, roll price, price per piece, leftover length/width per sheet. The preview draws the roll sideways with each 1 m sheet outlined (first 6 sheets for long rolls) and the extra length dashed in amber.

## Option 2: Roll for quantity
*"How much roll do I need for 500 pcs?"*: exact length, no sheet rounding (`calculateRoll`).
500 × 10 × 8 cm → 9 per row, 56 rows, **1 m × 4.755 m = 237.75 SAR**. For whole-sheet pricing use the Sheet page.

## Next
- Roll on hand: enter the roll's remaining length and show what is left after a job.

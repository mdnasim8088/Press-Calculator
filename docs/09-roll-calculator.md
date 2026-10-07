# 09 · Sticker Sheet Calculator (pieces that fit)  ✅ built

Route: `/sticker` (old `/sheet` redirects here) · UI: `StickerCalculator.tsx`, `RollPreview.tsx` · Engine: `calculateSheetCapacity()` (`src/core/capacity.ts`) · Tests: `tests/capacity.test.ts` (7)

No quantity input: enter the sheet size and the sticker size, and it returns how many complete stickers fit. Width is always 1 m.

## Sheet method
1. Count complete stickers on one 1 m × 1 m sheet (packing rule, both orientations).
2. Multiply by the number of full sheets: `floor(length m)`.
3. If the length has an extra part (e.g. 5.5 m → 50 cm), add the whole rows that fit in it.
4. The orientation with more pieces wins.

| Input | Result |
|---|---|
| 1 m × 1 m, 5 × 5 cm, gap 0.5 | 18 × 18 = **324 pcs** · 50 SAR · 0.154 SAR/pc · 1.5 cm left |
| 1 m × 5 m, 10 × 8 cm, gap 0.5 | 9 × 11 = **99 per sheet × 5 = 495 pcs** · 7 cm left per sheet · 250 SAR · 0.505 SAR/pc |
| same, gap 0 | 120 per sheet × 5 = **600 pcs** |
| 1 m × 5.5 m | 495 + 5 rows × 9 = **540 pcs** |

## Inputs
Sheet length with a unit dropdown (Millimeter, Centimeter, Meter, Inch, Feet; default Meter; switching converts the value, e.g. 1 m → 100 cm), sticker unit and W × H, gap, price per m² or per meter (optional).

## Panels
1. **Input**
2. **Result**: total pieces (per sheet × sheets + extra), price for the sheet, per sheet (perRow × rows), full sheets, extra-length pieces, price per piece, leftover length/width per sheet.
3. **Sheet preview**: each 1 m sheet outlined; extra length dashed in orange.
4. **Compare**: normal vs rotated, plus the count without sheet breaks (one continuous grid).

## History
This was first built as the "Pieces in roll" option on the Roll page, removed from the screen, and brought back as this page (replacing the old quantity-based Sticker page, which duplicated Quantity).

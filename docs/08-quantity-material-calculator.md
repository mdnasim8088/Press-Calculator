# 08 · Quantity Calculator (quantity → required material)  ✅ built

Route: `/quantity` (old `/roll` redirects here) · UI: `QuantityCalculator.tsx`, `RollPreview.tsx` · Engine: `calculateSheet()` (`src/core/sheet.ts`)

First calculator in the tabs and menus (after the basic Calculator).

## What it does
Enter how many pieces you need; it returns how many 1 m × 1 m sheets the job takes, joined lengthwise into a 1 m × N m artboard. The last row is always completed.

| Input | Result |
|---|---|
| 500 pcs, 5 × 7 cm, gap 0.5 | 234 per sheet · **3 sheets → 1 m × 3 m** · last sheet 14.5 cm used, **85.5 cm empty** · used after completing the row **2.145 m** · 150 SAR (used 107.25 SAR) |
| 3000 pcs, 5 × 5 cm, gap 0.5 | 324 per sheet · 10 sheets → 1 m × 10 m · last sheet 27 cm used, **73 cm left** · 500 SAR (used 9.27 m = 463.50 SAR) |

## Panels
1. **Input**: quantity, unit (mm/cm/inch), sticker W × H, gap (quick buttons), price per m² or per meter (optional; empty = 0).
2. **Result**: artboard `1 m × N m`, full-sheet price, sheets (full + last), per sheet, total produced (+extra from the completed row), used length and used-length price, stickers on the last sheet, and the highlight box "Last sheet: 27 cm used · 73 cm left" with a usage bar.
3. **Roll preview**: every sheet outlined (Sheet 1, Sheet 2, … last), the empty part of the last sheet hatched in orange, caption with sheets, empty length and metres used. Long jobs show the first 2 and last 3 sheets with "… +N".
4. **Compare**: normal vs rotated cards (best marked).

## Open decision
Which price is the main one: full sheets (current) or used length? Both are shown.

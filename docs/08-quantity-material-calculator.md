# 08 · Quantity → Required Material  ✅ built (Sheet page)

Route: `/sticker` (old `/sheet` redirects here; page title "Sticker Calculator") · UI: `StickerCalculator.tsx`, `SheetPreview.tsx` · Engine: `calculateSheet()` (`sheet.ts`), `calculateRoll()` (`roll.ts`)

## Two modes, shown side by side
| Mode | Meaning | Example (5×7 cm, 500 pcs) |
|---|---|---|
| **Sheet** (main) | 1 m × 1 m sheets joined lengthwise, priced per full sheet | 1 m × 3 m = 150 SAR |
| **Roll** (compare) | exact length, no sheet rounding | 1 m × 2.095 m = 104.75 SAR |

## Sheet page panels
1. **Input**: quantity, unit (mm/cm/inch), sticker W × H, gap, price per m². Width-locked note: always 1 m.
2. **Result**: artboard `1 m × N m`, full-sheet price, sheets (full + last), per sheet (perRow × rows), total produced (+extra from the completed row), actual used length, used-length price, stickers on the last sheet.
   - Highlight box: **"শেষ শিট: 27 cm লেগেছে, 73 cm বাকি আছে"** + usage bar.
3. **Last sheet preview**: SVG of the final sheet, stickers in cyan, the leftover hatched in amber with "73 cm LEFT". Above 1,500 stickers each row is drawn as a single strip for performance.
4. **Compare**: normal vs rotated cards (best marked), plus the roll-mode result.

## Open decision
Which price is the main one: full sheets (current) or used length? Both are shown today.

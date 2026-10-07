# 09 · Roll Calculator  ✅ built

Route: `/roll` · UI: `RollCalculator.tsx`, `RollPreview.tsx` · Engine: `calculateSheet()` (`src/core/sheet.ts`)

Width is always 1 m (cutter sticker rule). The page has **one option: Roll for quantity**.

## Roll for quantity (sheet method)
*"How much roll do I need for 500 pcs of 5 × 7 cm?"*

Same engine as the Sheet page (doc 08): 1 m × 1 m sheets, the last row completed, priced per full sheet with the used-length price shown too.

| Input | Result |
|---|---|
| 500 pcs, 5 × 7 cm, gap 0.5 | 234 per sheet · **3 sheets → 1 m × 3 m** · last sheet 14.5 cm used, **85.5 cm empty** · used after completing the row **2.145 m** · 150 SAR (used 107.25 SAR) |

The Roll page adds a **roll preview**: the roll drawn sideways with every sheet outlined (Sheet 1, Sheet 2, … last), the empty part of the last sheet hatched in orange, and a caption with sheets, empty length and metres used. Long jobs show the first 2 and last 3 sheets with a "… +N" marker.

Inputs: quantity, unit, sticker width/height, gap (quick buttons), price per m² or per meter (optional; empty = 0).

## Removed from the screen: Pieces in roll
The "how many pieces fit in a 1 m × N m roll" option was taken off the page at the user's request. Its engine is kept and tested, so it can return as its own page:

- `calculateSheetCapacity()` in `src/core/capacity.ts`, tests in `tests/capacity.test.ts`
- 1 m × 5 m, 10 × 8 cm, gap 0.5 → 99 per sheet × 5 = **495 pcs**; 5.5 m → 540 pcs

## Next
- Roll on hand: enter the roll's remaining length and show what is left after a job.

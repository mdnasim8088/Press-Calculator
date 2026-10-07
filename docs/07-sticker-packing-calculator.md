# 07 · Sticker / Cutter Packing Calculator  ⬜ UI planned · ✅ engine ready

Route: `/packing` · Engine: `calculatePacking()` and `calculateBestLayout()` in `src/core/packing.ts`

## Inputs
Material width × height, sticker width × height, gap, unit.

## Outputs (all already returned by the engine)
`columns`, `rows`, `total`, `usedWidth`, `usedHeight`, `remainingWidth`, `remainingHeight`, `materialArea`, `itemsArea`, `wasteArea`, `wastePercent`, `rotated`.

## Rules
- Placement starts at the corner; only complete stickers count.
- No trailing gap after the last sticker in a row or column.
- `calculateBestLayout` returns `normal`, `rotated` and `best`.

## UI plan
Reuse the sheet page pattern: `01 Input`, `02 Result` (StatBar for usage vs waste), `03 Preview` (SVG grid like `SheetPreview`), `04 Compare` (normal vs rotated).

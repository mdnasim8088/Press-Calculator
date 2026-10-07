# 10 · Waste & Best Layout  ⬜ UI planned · ✅ partial engine

Routes: `/waste`, `/best-layout` · Engine: `packing.ts` (`wasteArea`, `wastePercent`, `calculateBestLayout`)

## Already implemented
- Waste area and % for a grid layout.
- Normal vs rotated comparison, with the best chosen automatically.
- Sheet mode: picks the orientation that leaves the least on the last sheet.

## Planned
- Waste badge thresholds: ≤10% good (success), 10–25% ok (accent), >25% `HIGH WASTE` (warning).
- **Mixed layout**: fill the main grid in one orientation, then fill the leftover strip with rotated stickers (fits more pieces on the same material).
- Suggest the material size that minimises waste for a given quantity.

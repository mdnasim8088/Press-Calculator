# 04 · Calculation Rules

All rules live in `src/core`. Each example below is a passing test in `tests/core.test.ts`.

## Units
`mm`, `cm`, `m`, `inch` (0.0254 m), `ft` (0.3048 m). `clean()` removes floating-point noise (0.35000000000000003 → 0.35).

## Area pricing: meters first
`area m² = toMeters(w) × toMeters(h)`, `price = area × price/m²`

| Size | Area | @ 50 SAR/m² |
|---|---|---|
| 50 × 70 cm | 0.35 m² | 17.50 |
| 150 × 150 cm | 2.25 m² | 112.50 |
| 300 × 500 cm | 15 m² | 750.00 |

## Packing (complete items only, no trailing gap)
`count = floor((length + gap) / (item + gap))`, `used = n·item + (n−1)·gap`
A 1e-9 epsilon prevents float results like 2.9999999 from flooring down.

100×100 cm, 5×5 cm, gap 0.5 → 18 × 18 = **324**, used 98.5, remaining 1.5, waste 1900 cm² (**19%**).

## Rotation
Test W×H and H×W. More items wins; tie → less waste; square items are never rotated.
100×50 cm, 5×7 → normal 108, rotated **117** ✅.

## Roll mode (exact length)
`perRow = fit(rollWidth)`, `rows = ceil(qty / perRow)`, `length = rows·h + (rows−1)·gap`.
5×7, 500 pcs, 100 cm roll → 18/row, 28 rows, 209.5 cm = **2.095 m → 104.75 SAR**. The orientation with the shorter length wins.

## Sheet mode (cutter stickers): the main rule
1. Width locked at **1 m**; each sheet is 1 m × 1 m.
2. `perSheet` from packing (both orientations).
3. `fullSheets = floor(qty / perSheet)`, `leftover = qty − fullSheets·perSheet`.
4. **The last row is always completed**: `lastRows = ceil(leftover / perRow)`.
5. `lastUsed = lastRows·h + (lastRows−1)·gap`, **`remaining = sheet − lastUsed`**.
6. Artboard = **1 m × N m**; price on full sheets; the used-length price is also shown.
7. Orientation choice: fewer sheets → less last-sheet length → fewer extras.
8. Exact fill: the last sheet is a full sheet (remaining = the sheet's own edge leftover).

| Input | Result |
|---|---|
| 5×5, 3000 pcs | 324/sheet · 10 sheets · last 5 rows = 90 pcs · 27 cm used · **73 cm left** · 3006 made · 1 m × 10 m = **500 SAR** (used 9.27 m = 463.50) |
| 5×7, 500 pcs | 234/sheet · tie → 5-wide (14.5 cm) beats 7-wide (16 cm) · 36 on last · **85.5 cm left** · 1 m × 3 m = **150 SAR** |

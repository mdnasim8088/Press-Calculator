# 06 · Material Area & Price Calculator  ✅ built

Route: `/area` · UI: `src/components/calculators/AreaCalculator.tsx` · Engine: `calculateArea()` in `src/core/area.ts`

## Inputs
Width, height, unit (mm/cm/m/inch/ft), price per m², quantity.

## Output
- Total price and total area (highlighted)
- Step-by-step working, so the customer can see how the price was made:
  1. `50 cm = 0.5 m`
  2. `70 cm = 0.7 m`
  3. `0.5 × 0.7 = 0.35 m²`
  4. `0.35 × 50 = 17.50 SAR`
  5. `× quantity` (when quantity > 1)

## Defaults
Unit and price come from Settings (default `cm`, `50 SAR/m²`).

## Next
- Pick the price from a Material Preset (doc 12).
- Save to History / Project.

# 12 · Material Presets & Settings

## Settings  ✅ built
Route: `/settings` · Store: `src/stores/settings.ts` (Zustand `persist`, LocalStorage key `print-calculator:settings`)

| Setting | Default | Used by |
|---|---|---|
| Currency | `SAR` | all prices |
| Default unit | `cm` | Area, Sheet (Sheet falls back to cm if m/ft is chosen) |
| Default price per m² | `50` | Area, Sheet |
| Default gap | `0.5` | Sheet |

Changes save instantly; **Reset** restores the defaults. Hydration: `skipHydration` + `ClientBoot` rehydrate; forms wait for `useSettingsHydrated()`.

## Material Presets  ⬜ planned
Route: `/presets`
```ts
interface MaterialPreset {
  id: string;
  name: string;            // "Glossy vinyl", "Banner 440g"
  kind: "vinyl" | "banner" | "sticker" | "other";
  pricePerSqm: number;
  rollWidthMeters?: number;
  notes?: string;
}
```
- Stored in IndexedDB (via a storage adapter, doc 13).
- Shown as "character select" style cards; one tap fills the price in any calculator.

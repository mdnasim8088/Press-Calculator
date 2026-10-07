# 02 · Architecture

## Layers
```
┌──────────────────────────────────────────────┐
│ UI (Next.js App Router, React)               │  src/app, src/components
│   pages → calculator components → ui kit     │
├──────────────────────────────────────────────┤
│ App services                                 │  src/stores (Zustand), src/lib
│   settings store, formatting, tryCalc        │
├──────────────────────────────────────────────┤
│ Calculation engine (pure TypeScript)         │  src/core
│   units · area · packing · roll · sheet · pricing
└──────────────────────────────────────────────┘
```

## Rules
1. `src/core` never imports React, Next.js, browser APIs or anything outside `src/core`.
2. Core functions take plain objects and return plain objects. No side effects, no I/O.
3. Invalid input throws `CalculationError`; the UI turns it into a message via `tryCalc()`.
4. UI components never do business math; they call `@/core` and format the result.
5. Persistence sits behind stores/adapters so storage can be swapped (LocalStorage → IndexedDB → SQLite on mobile).

## Folder map
```
src/
├── core/          engine (see 04-calculation-rules.md)
├── app/           routes: /, /calculator, /sticker, /quantity, /banner, /settings + placeholders (/sheet → /sticker, /roll → /quantity, /area → /banner redirect)
├── components/
│   ├── ui/        Panel, Stat, StatBar, Badge, HudButton, NumberInput, UnitSelect
│   ├── layout/    IconRail, BottomNav, CategoryTabs, PageHeader, Particles, ClientBoot
│   └── calculators/ BasicCalculator, StickerCalculator, SheetPreview, QuantityCalculator, RollPreview, BannerCalculator, SettingsForm
├── config/        navigation.ts (single source for menus and tool list)
├── stores/        settings.ts (Zustand + persist)
└── lib/           format.ts, try-calc.ts
```

## Rendering
- Next.js 16.4 with Cache Components and Partial Prefetching (from the scaffold).
- Every route prerenders as static HTML; calculators are client components that compute instantly in the browser.
- Settings persist to LocalStorage with `skipHydration`, rehydrated in `ClientBoot` after mount; calculators wait for `useSettingsHydrated()` to avoid showing wrong defaults.

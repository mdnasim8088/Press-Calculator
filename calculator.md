# Press Calculator: Master Prompt (v2, with Theme)

> Project folder: `press-calculator`
> App name: **Press Calculator**
> Purpose: a personal/business calculator for printing, stickers, cutter stickers, banners, vinyl and other print-material work.
> Visual direction: dark teal "gaming HUD" style, based on the user's reference image (a futuristic game-UI concept).

---

## Step 0: Ground Rules

1. Build a **responsive web application first**, designed mobile-first.
2. Make the architecture **PWA-ready** and ready for a **future Android/iOS app**.
3. **Do NOT build all features yet.** This phase covers analysis, project foundation, theme system and documentation only.
4. Keep **all math and business logic separate from UI components**. The calculation engine must be pure TypeScript with no React, DOM or browser APIs, so a future mobile app can reuse it.
5. The theme is about **style only**. Do not copy any game logos, characters, artwork or brand names from the reference. Use original shapes, icons and placeholders.
6. **Readability comes first.** This is a business tool, so the gaming style must never make numbers hard to read or inputs hard to use.

---

## Step 1: Technology Stack

| Area | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS (theme tokens as CSS variables) |
| Icons | Lucide Icons |
| Fonts | `next/font` with Google Fonts (see Step 4) |
| Global state | Zustand (only where global state is required) |
| Offline / install | PWA support (manifest + service worker) |
| Persistence | LocalStorage for small settings, IndexedDB for history, projects and presets |
| Testing | Vitest for the calculation engine |

> Note: this Next.js version may have breaking changes. Read `node_modules/next/dist/docs/` before writing code.

---

## Step 2: Feature Roadmap (planned, not built yet)

**Calculation tools**
1. Normal Calculator
2. Material Area & Price Calculator
3. Sticker/Cutter Packing Calculator
4. Sticker Quantity → Required Material Calculator (**Sheet mode**: 1 × 1 m sheets → 1 m × N m artboard, and **Roll mode**: exact length)
5. Roll/Material Calculator
6. Rotation / Best Layout Calculator
7. Waste Calculator

**Business tools**

8. Cost Calculator
9. Selling Price Calculator
10. Profit Calculator
11. Quote/Estimate

**Data & settings**

12. Material Price Presets
13. Calculation History
14. Saved Projects
15. Settings

**Platform**

16. PWA
17. Future Android/iOS support

---

## Step 3: Business Rules

### 3.1 Supported Units

`mm`, `cm`, `m`, `inch`, `ft`

### 3.2 Area Pricing Rule (most important)

**Always convert dimensions to meters first**, then compute m², then multiply by price per m².

| Size | In meters | Area | Price @ 50 SAR/m² |
|---|---|---|---|
| 50 × 70 cm | 0.5 × 0.7 | 0.35 m² | **17.50 SAR** |
| 150 × 150 cm | 1.5 × 1.5 | 2.25 m² | **112.50 SAR** |
| 300 × 500 cm | 3 × 5 | 15 m² | **750.00 SAR** |

### 3.3 Sticker Packing Rule

Calculate how many **complete** stickers physically fit inside a material.

- Placement starts from the material corner.
- Partial stickers are **never** counted.
- The last sticker in a row needs **no trailing gap**. The same applies vertically.
- Formula per axis: `count = floor((material + gap) / (sticker + gap))`
- Used length per axis: `count × sticker + (count − 1) × gap`

**Example:** Material 100 × 100 cm, Sticker 5 × 5 cm, Gap 0.5 cm

| Output | Result |
|---|---|
| Stickers per row | 18 |
| Rows | 18 |
| Total stickers | **324** |
| Used width / height | 98.5 cm / 98.5 cm |
| Remaining width / height | 1.5 cm / 1.5 cm |
| Waste area | 1900 cm² |
| Waste percentage | **19%** |

### 3.4 Rotation Rule (rectangular stickers)

For a sticker like **5 × 7 cm**, test both orientations (5 × 7 and 7 × 5), then return the **better** one: more stickers wins, and on a tie, less waste wins.

**Example:** Material 100 × 50 cm, Gap 0.5 cm
- 5 × 7 → 18 × 6 = 108 stickers
- 7 × 5 → 13 × 9 = **117 stickers ✅ best**

### 3.5 Quantity → Material Rule

**Example:** Sticker 5 × 7 cm, Quantity 500 pcs, Roll width 100 cm, Gap 0.5 cm, Price 50 SAR/m²

| Output | Result |
|---|---|
| Stickers per row | 18 |
| Rows required | 28 (`ceil(500 / 18)`) |
| Required length | 209.5 cm (no trailing gap after the last row) |
| Required meters | 2.095 m |
| Material area | 2.095 m² |
| Estimated cost | **104.75 SAR** |

Test both orientations here too, and recommend the one that uses less material.

### 3.6 Sheet-Based Quantity Rule (1 m × 1 m sheets → artboard)

This is the user's main way of working. The quantity calculator must support this **Sheet mode** next to the Roll mode in 3.5.

**Logic, step by step:**

1. **Width is always 1 m (100 cm) for cutter stickers.** It is locked and cannot be edited in this mode. Each sheet is **1 m × 1 m**.
2. Calculate how many **complete stickers fit in one sheet**, using the packing rule (3.3) and testing both orientations (3.4).
3. Full sheets = `floor(quantity / stickersPerSheet)`. Stickers left for the last sheet = `quantity − fullSheets × stickersPerSheet`.
4. **Complete the last row.** If the quantity ends in the middle of a row, fill the whole row. Never leave a half row.
   - Rows on last sheet = `ceil(leftover / stickersPerRow)`
   - Stickers on last sheet = `rows × stickersPerRow`
5. **Measure the last sheet:**
   - Used length on last sheet = `rows × stickerHeight + (rows − 1) × gap` (no trailing gap)
   - **Remaining on last sheet = 100 cm − used length.** Always show this to the user ("this much is left over").
6. Join the sheets along the length. The width stays 1 m and the length grows sheet by sheet. Final artboard = **1 m × N m**.
7. Price = artboard area (m²) × price per m². **Full sheets are charged.** The used length and leftover are shown for information.
8. **Orientation tie-break:** if both orientations give the same stickers per sheet, choose the one that uses **less length on the last sheet**.
9. If the quantity fills the sheets exactly (leftover = 0), there is no partial sheet and the remaining length is 0 cm.

**Outputs:**
- stickers per sheet, stickers per row, rows per sheet (and best orientation)
- full sheets + last sheet
- rows on last sheet (complete rows only)
- stickers on last sheet
- **used length on last sheet (cm)**
- **remaining length on last sheet (cm)**
- total stickers produced and extra stickers (from completing the last row)
- total used length (exact, in m)
- final artboard size: `1 m × N m`
- artboard area (m²)
- total price

**Example 1:** Sticker 5 × 5 cm, Gap 0.5 cm, Quantity 3000 pcs, Price 50 SAR/m²

| Output | Result |
|---|---|
| Per sheet | 18 per row × 18 rows = 324 |
| Full sheets | `floor(3000 / 324)` = 9 → 2916 stickers |
| Left for last sheet | 3000 − 2916 = 84 |
| Rows on last sheet | `ceil(84 / 18)` = **5 rows** (row completed) |
| Stickers on last sheet | 5 × 18 = **90** |
| Used length on last sheet | 5 × 5 + 4 × 0.5 = **27 cm** |
| **Remaining on last sheet** | 100 − 27 = **73 cm** |
| Total stickers produced | 3006 (6 extra) |
| Total used length | 9 m + 27 cm = 9.27 m |
| Artboard | **1 m × 10 m** = 10 m² |
| Price | 10 × 50 = **500.00 SAR** |

**Example 2:** Sticker 5 × 7 cm, Gap 0.5 cm, Quantity 500 pcs, Price 50 SAR/m²

Both orientations give 234 per sheet, so the tie-break decides:
- 5 wide (18 per row, row height 7 cm): last sheet needs 2 rows → 14.5 cm ✅
- 7 wide (13 per row, row height 5 cm): last sheet needs 3 rows → 16 cm

| Output | Result |
|---|---|
| Per sheet | 18 per row × 13 rows = 234 |
| Full sheets | 2 → 468 stickers |
| Left for last sheet | 32 |
| Rows on last sheet | `ceil(32 / 18)` = **2 rows** |
| Stickers on last sheet | **36** |
| Used length on last sheet | 2 × 7 + 1 × 0.5 = **14.5 cm** |
| **Remaining on last sheet** | **85.5 cm** |
| Total stickers produced | 504 (4 extra) |
| Total used length | 2.145 m |
| Artboard | **1 m × 3 m** = 3 m² |
| Price | 3 × 50 = **150.00 SAR** |

> In the UI, show a clear message on the last sheet, such as **"Last sheet: 27 cm used, 73 cm left"**, and draw the leftover area in the layout preview. Show the exact Roll-mode result (3.5) next to it for comparison.

---

## Step 4: Theme & UI Design (from the reference image)

### 4.1 Mood

A dark, futuristic **HUD/gaming dashboard**: a deep teal-navy background, glowing cyan accents, glass-like panels, thin "leader lines" pointing to labels, bold wide headings, and small numbered section markers (01, 02, 03). It should feel premium and modern, but stay clean enough for daily business use.

### 4.2 Color Tokens (define as CSS variables)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#071216` | App background (deepest) |
| `--bg-gradient` | `#0B1E25 → #071216` | Radial glow behind the main content |
| `--surface` | `#0E2129` | Cards and panels |
| `--surface-2` | `#13303A` | Inputs, raised elements |
| `--border` | `#1E4450` | Panel borders, dividers |
| `--accent` | `#38C6E0` | Primary cyan: buttons, active state, key numbers |
| `--accent-glow` | `rgba(56,198,224,0.35)` | Glow and shadow |
| `--accent-soft` | `#1C5A68` | Bar tracks, selected backgrounds |
| `--text` | `#E6F5F8` | Main text |
| `--text-muted` | `#8AAAB3` | Labels, helper text |
| `--success` | `#3DDC97` | Profit, "best layout" |
| `--warning` | `#F5B841` | High waste |
| `--danger` | `#F2545B` | Loss, errors |

- Dark mode is the default and main theme.
- A light mode can be added later through the same tokens. Do not hard-code colors in components.
- All text and number colors must pass **WCAG AA contrast**.

### 4.3 Typography

| Role | Font | Notes |
|---|---|---|
| Display / page titles | **Orbitron** (bold, uppercase, wide letter-spacing) | Like the big "CALL OF DUTY" heading style |
| UI labels, tabs, nav | **Rajdhani** (600) | Techy and compact |
| Body text | **Inter** | Easy to read |
| Numbers / results | **JetBrains Mono** or Inter with `tabular-nums` | Digits must line up in tables |

Use the display font only for headings. Never use it for input values or long text.

### 4.4 Layout Pattern

- **Desktop:** a thin **left icon rail** (Home, Calculators, Presets, History, Projects, Settings), like the sidebar in the reference, plus a top bar with the page title and quick actions.
- **Mobile:** the icon rail becomes a **bottom navigation bar** with 4–5 icons, and a hamburger opens the full menu.
- **Category tabs** along the top (like "Weapons / Skin / Legendary / Mythic" in the reference) become: **Area · Packing · Quantity · Roll · Cost · Profit**.
- Each calculator page uses **numbered panels**: `01 Input` → `02 Result` → `03 Layout Preview`.

### 4.5 Components Inspired by the Reference

| Reference element | Use in Press Calculator |
|---|---|
| Damage / Range / Accuracy stat bars | **Usage vs Waste bars**, profit margin bar, material-used bar |
| "LEGENDARY" / "MYTHIC" angled badges | **"BEST LAYOUT"**, **"ROTATED"**, **"HIGH WASTE"** badges |
| Leader lines with small labels | **Dimension callouts** on the sticker layout preview (width, height, gap, remaining) |
| Side-by-side weapon comparison | **5×7 vs 7×5 orientation comparison** cards |
| Character-select cards | **Material preset cards** (Vinyl, Banner, Sticker paper…) with name and price/m² |
| Big "01 / 02 / 03" numbers | Step numbers on panels |
| Star rating | Optional "efficiency score" for a layout |

### 4.6 Effects

- **Glassmorphism panels:** semi-transparent surface, `backdrop-blur`, 1px cyan-tinted border.
- **Glow:** soft cyan `box-shadow` on the active tab, primary button and main result number.
- **Background:** a radial teal glow behind the content and an optional subtle floating-particle layer (CSS only, low count).
- **Angled corners:** clipped corners (`clip-path`) on badges and primary buttons for a HUD feel.
- **Motion:** short fades and slides (150–250 ms). Result numbers can count up quickly.

### 4.7 Performance & Accessibility Limits

- Particles and heavy blur must turn off with `prefers-reduced-motion` and on low-end devices.
- Background effects must never sit on top of inputs or numbers.
- Tap targets must be at least 44 × 44 px on mobile.
- Numeric inputs should use `inputMode="decimal"` so the number keypad opens on phones.
- There must be no horizontal scroll at 360 px width.

---

## Step 5: Architecture Principles

```
press-calculator/
├── src/
│   ├── core/              # Pure TypeScript calculation engine (no React)
│   │   ├── units/         # unit conversion (mm, cm, m, inch, ft)
│   │   ├── area/          # area & price
│   │   ├── packing/       # sticker packing + rotation
│   │   ├── quantity/      # quantity → material (sheet mode + roll mode)
│   │   ├── roll/          # roll calculations
│   │   ├── waste/         # waste calculations
│   │   ├── pricing/       # cost, selling price, profit
│   │   └── index.ts       # public API
│   ├── app/               # Next.js routes (UI only)
│   ├── components/
│   │   ├── ui/            # themed primitives: Panel, StatBar, Badge, HudButton, NumberInput
│   │   ├── layout/        # IconRail, BottomNav, TopBar, CategoryTabs
│   │   └── calculators/   # per-calculator forms and result views
│   ├── stores/            # Zustand stores (settings, presets, history)
│   ├── lib/storage/       # LocalStorage / IndexedDB adapters
│   └── styles/            # theme tokens (CSS variables)
├── public/                # PWA manifest, icons
├── docs/                  # documentation (Step 6)
└── tests/                 # engine unit tests
```

- `core/` must never import from `app/`, `components/` or `stores/`.
- Every core function takes plain inputs and returns plain result objects, with no side effects.
- Storage sits behind an adapter interface so a mobile app can replace it later (for example with SQLite or AsyncStorage).

---

## Step 6: Documentation to Create

```
docs/
├── 01-project-overview.md
├── 02-architecture.md
├── 03-ui-ux.md                     ← must include the full theme from Step 4
├── 04-calculation-rules.md
├── 05-normal-calculator.md
├── 06-material-price-calculator.md
├── 07-sticker-packing-calculator.md
├── 08-quantity-material-calculator.md
├── 09-roll-calculator.md
├── 10-waste-optimization.md
├── 11-cost-profit.md
├── 12-presets-settings.md
├── 13-history-projects.md
├── 14-pwa-mobile.md
├── 15-testing.md
├── 16-deployment.md
└── 17-future-mobile-app.md
```

---

## Step 7: Build Order for This Phase

1. Analyze the requirements.
2. Scaffold the Next.js + TypeScript + Tailwind project inside `press-calculator`.
3. Install Lucide, Zustand, Vitest and the PWA tooling.
4. Set up the **theme system**: color tokens, fonts, background glow, and the base Tailwind config.
5. Build the themed **UI primitives**: Panel, StatBar, Badge, HudButton, NumberInput.
6. Build the **app shell**: IconRail (desktop), BottomNav (mobile), TopBar, CategoryTabs, and placeholder pages.
7. Create the `core/` engine skeleton (units, area, packing), with unit tests for every example in Step 3.
8. Add the PWA manifest and icons (dark teal theme color `#071216`).
9. Write all 17 documentation files.
10. **Stop.** Do not implement the full features yet.

---

## Step 8: Final Report

When finished, show:

1. Folder structure
2. Technology choices
3. Architecture
4. Theme system summary (colors, fonts, components)
5. Calculation engine plan
6. Future mobile-app strategy

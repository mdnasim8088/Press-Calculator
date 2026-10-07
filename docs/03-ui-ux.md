# 03 · UI / UX

Style: HUD layout (angled corners, numbered panels) from the user's reference image, coloured with a **white background and a Fiverr-style green gradient**. Colours only; no third-party logos or artwork. (The earlier dark teal palette is in git history.)

## Colour tokens (`src/app/globals.css`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` (+ faint green radial glow) | page background |
| `--surface` | `#FFFFFF` + `--shadow` | cards and panels |
| `--surface-2` | `#F5F6F7` | inputs |
| `--border` | `#DADBDD` | borders |
| `--accent` | `#19A463` | icons, key numbers, active states |
| `--accent-bright` / `--accent-deep` | `#1DBF73` / `#0A7A43` | gradient ends, decoration |
| `--accent-gradient` | `#19A463 → #0A7A43` (135°) | primary buttons, selected chips, `=` key, underlines, bars |
| `--accent-soft` | `#E3F6EC` | hover, bar tracks, selection |
| `--on-accent` | `#FFFFFF` | text on green |
| `--text` / `--text-muted` | `#222325` / `#62646A` | text |
| `--success` / `--warning` / `--danger` | `#0E9F5E` / `#C2410C` / `#D93025` | best layout, leftover, errors |

Contrast on white: text 15.7:1, muted 5.9:1, accent 3.2:1 (bold/large text and icons only), gradient end 5.4:1. The bright `#1DBF73` (2.4:1) is used only decoratively.

Exposed to Tailwind as `bg-surface`, `text-accent`, `text-on-accent`, `bg-accent-gradient`, `text-accent-gradient`, `text-muted`, `border-border`, etc. Components never hard-code colours. Logo colours live in `scripts/build-brand.mjs` (`npm run brand`).

## Typography
| Role | Font | Class |
|---|---|---|
| Display headings | Orbitron | `font-display` |
| Labels, tabs, nav | Rajdhani | `font-ui` |
| Body | Inter | `font-sans` |
| Numbers | JetBrains Mono + `tabular-nums` | `font-mono` |

## Layout
- Desktop (≥768px): fixed left **icon rail** (80px).
- Mobile: **bottom nav** (5 items, safe-area aware).
- Calculator pages: title, glow underline, **category tabs** (Sheet · Area · Packing · Roll · Cost · Profit), then numbered panels `01 Input → 02 Result → 03 Preview → 04 Compare`.
- Desktop calculators use a 2-column grid; the input panel is sticky.

## Reference → app mapping
| Reference | App |
|---|---|
| Damage/Range/Accuracy bars | `StatBar`: last-sheet usage |
| LEGENDARY / MYTHIC tags | `Badge`: BEST LAYOUT, ROTATED |
| Leader-line labels | `SheetPreview` width label + "73 cm LEFT" |
| Weapon comparison | Normal vs Rotated cards |
| 01 / 02 / 03 numbers | `Panel index` |

## Effects & accessibility
- `glass`, `glow`, `text-glow`, `hud-clip` utilities.
- Floating particles and all animation are disabled under `prefers-reduced-motion`.
- Tap targets ≥ 44px; numeric fields use `inputMode="decimal"`/`"numeric"`.
- Verified: no horizontal scroll at 375px width.

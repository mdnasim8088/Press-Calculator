# 03 · UI / UX

Style: dark teal "gaming HUD", based on the user's reference image. Style only; no game logos, characters or artwork.

## Colour tokens (`src/app/globals.css`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#071216` | page background |
| `--surface` | `rgba(14,33,41,.72)` | glass panels |
| `--surface-2` | `#13303a` | inputs |
| `--border` | `#1e4450` | borders |
| `--accent` | `#38c6e0` | primary cyan, key numbers |
| `--text` / `--text-muted` | `#e6f5f8` / `#8aaab3` | text |
| `--success` / `--warning` / `--danger` | green / amber / red | best layout, leftover, errors |

Exposed to Tailwind as `bg-bg`, `bg-surface`, `text-accent`, `text-muted`, `border-border`, etc. Components never hard-code colours.

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

# 01 · Project Overview

**Press Calculator** is a personal/business calculator for printing work: stickers, cutter stickers, banners, vinyl and other print materials.

## Goals
- Answer the daily shop questions fast: *How many sheets? How many meters? What do I charge?*
- Work on phone and desktop, install as an app (PWA) and work offline.
- Keep all business math in one reusable engine so a future Android/iOS app can share it.

## Users
A print-shop owner/operator pricing jobs at the counter or on the phone. Bangla UI labels, SAR as the default currency (configurable).

## Status (phase 1: foundation)
| Area | Status |
|---|---|
| Calculation engine (`src/core`) | ✅ units, area, packing, rotation, roll, sheet, pricing |
| Engine tests | ✅ 17 passing |
| Theme + app shell | ✅ |
| Sticker calculator (`/sticker`, was `/sheet`) | ✅ working |
| Quantity calculator (`/quantity`, was `/roll`) | ✅ working |
| Banner calculator (`/banner`, was `/area`) | ✅ working |
| Settings | ✅ working |
| PWA (manifest, icons, service worker) | ✅ |
| Other 12 features | ⬜ placeholder pages |

## Source documents
- `calculator.md`: full rules and theme spec (master prompt)
- `prompt.md`: step-by-step build plan
- `PROGRESS.md`: work log
- `guide/`: Bangla "which file does what" guides

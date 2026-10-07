# 14 · PWA

## Implemented ✅
| File | Purpose |
|---|---|
| `src/app/manifest.ts` | name, `standalone`, portrait, theme/background `#071216`, icons |
| `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | install icons: the Taghareed bird on white |
| `public/brand/logo-mark.png`, `logo-wordmark.png` | logo shown in the app (icon rail, home page) |
| `brand/source/*.webp` + `scripts/build-brand.mjs` | original black logos; `npm run brand` recolours them and rebuilds every icon |
| `src/app/icon.png`, `src/app/apple-icon.png` | favicon and iPhone icon (generated) |
| `public/sw.js` | service worker |
| `ClientBoot.tsx` | registers `/sw.js` in production only |
| `layout.tsx` `viewport` | theme colour, `viewportFit: cover` (notch safe area) |

## Offline strategy (`sw.js`)
- Precache `/`, `/calculator`, `/sticker`, `/quantity`, `/banner`, `/settings` and the logo images.
- Navigations: network first → cached page → cached `/`.
- `_next/static`, fonts, icons: cache first.
- Bump `CACHE` (`press-calc-v5`) when the caching logic changes.

All math runs on the device, so calculators work fully offline.

## To do
- PNG icons 192/512 for older Android launchers.
- In-app "Install" button using `beforeinstallprompt`.
- Optionally enable `experimental.useOffline` (see `node_modules/next/dist/docs/01-app/02-guides/offline-support.md`).

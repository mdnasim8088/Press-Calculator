# 16 · Deployment

## Local
```
cd D:\press-calculator
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Quality gate before deploy
`npm test` → `npm run lint` → `npm run build` (all routes prerender as static).

## Hosting options
| Option | Notes |
|---|---|
| **Vercel** (recommended) | zero-config for Next.js, HTTPS (required for PWA install), preview URLs |
| Netlify / Cloudflare | work with the Next.js adapters |
| Own server | `npm run build && npm start` behind HTTPS (nginx / Caddy) |

HTTPS is required for the service worker and "Add to Home screen".

## Versioning
Use git: commit after each finished step in `prompt.md`. Bump `CACHE` in `public/sw.js` when offline caching changes.

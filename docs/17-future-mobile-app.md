# 17 · Future Android / iOS App

## Strategy
1. **Now: PWA.** Installable from the browser; works offline. No store needed.
2. **Next: native wrapper or React Native.**

| Option | Reuse | When |
|---|---|---|
| **Capacitor** (wrap the web app) | ~100% UI + engine | fastest route to the Play Store / App Store |
| **Expo / React Native** | 100% of `src/core`, new native UI | best native feel, offline storage with SQLite |

## What makes this possible
- `src/core` is pure TypeScript with zero dependencies → copy or publish it as a shared package (`packages/core`) and import it from the mobile app.
- The same `tests/core.test.ts` guarantees identical results on web and mobile.
- Storage behind the `Repository` interface (doc 13): swap IndexedDB for SQLite/AsyncStorage.
- Design tokens (colours, fonts) are listed in doc 03 and can be ported to a React Native theme object.

## Suggested monorepo (later)
```
apps/web      ← this Next.js app
apps/mobile   ← Expo app
packages/core ← src/core moved here
```

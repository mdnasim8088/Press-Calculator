# 15 · Testing

## Unit tests ✅
- Tool: Vitest 5 (`vitest.config.mts`, alias `@` → `src`)
- File: `tests/core.test.ts`: **17 tests, all passing**
- Run: `npm test` (or `npm run test:watch`)

Coverage: unit conversion, the 3 area examples, packing (no trailing gap, exact-fit edge case), rotation, roll mode, sheet mode (3000 pcs, 500 pcs tie-break, exact fill, mm input, sticker too big), and pricing.

## Rule
**Every business example in `calculator.md` must have a test.** When a rule changes, update the test first.

## Manual / browser checks (done for phase 1)
- `/sheet`: 500 pcs 5×7 → 1 m × 3 m, 85.5 cm left, 150 SAR; 3000 pcs 5×5 → 1 m × 10 m, 73 cm left, 500 SAR.
- `/banner`: 50×70 cm → 0.35 m² → 17.50 SAR with the step list.
- Settings persist across reloads.
- Desktop (1280px) and mobile (375px), no horizontal scroll, no console or server errors.

## Planned
- Component tests (React Testing Library) for the calculators.
- Playwright smoke test: open `/sheet`, type a quantity, assert the leftover text.

# Press Calculator

A calculator for printing, stickers, cutter stickers, banners and vinyl: sheets, meters, leftover and price.

## Start

```
npm install
npm run dev     # http://localhost:3000
npm test        # calculation engine tests
npm run build   # production build
```

## Where to read

| File / folder | What it is |
|---|---|
| `HOW-TO-USE.md` | **বাংলায়** অ্যাপ কীভাবে চালাবেন আর ব্যবহার করবেন (PC, মোবাইল, ইনস্টল) |
| `Start Press Calculator.bat` | Double-click to start the app on this PC |
| `guide/` | **বাংলায়** কোন ফাইলে কী আছে (backend, frontend, theme…) |
| `calculator.md` | All business rules and the theme spec |
| `prompt.md` | Step-by-step build plan |
| `PROGRESS.md` | Work log |
| `docs/` | 17 technical documents |

## Structure

- `src/core/`: pure TypeScript calculation engine (reusable by a future mobile app)
- `src/app/`: pages
- `src/components/`: UI
- `tests/`: engine tests

# Press Calculator: Step-by-Step Build Prompts

> প্রজেক্ট ফোল্ডার: `D:\press-calculator`
> কাজের অগ্রগতি: `PROGRESS.md`
> সব নিয়ম আর থিমের পুরো বিবরণ আছে `calculator.md` ফাইলে। এই ফাইলে সেগুলো **কোন ধাপে কী বানানো হবে**, সেই ক্রমে সাজানো।
> প্রতিটা ধাপে আগে বাংলায় ছোট ব্যাখ্যা, তারপর বিল্ড করার প্রম্পট।
> ✅ = শেষ হয়েছে, ⏳ = চলছে, ⬜ = বাকি

---

## ধাপ ১: প্রজেক্ট সেটআপ ✅

**বাংলায়:** খালি Next.js প্রজেক্ট তৈরি করা আর দরকারি প্যাকেজ ইনস্টল করা।

**Prompt:**
- Scaffold Next.js (App Router) + TypeScript + Tailwind CSS in `press-calculator`, using the `src/` folder.
- Install `lucide-react` (icons), `zustand` (global state) and `vitest` (tests).
- Read `node_modules/next/dist/docs/` before writing code, because this Next.js version may have breaking changes.

---

## ধাপ ২: হিসাবের ইঞ্জিন (Core Engine) ✅

**বাংলায়:** সব অঙ্কের নিয়ম আলাদা ফোল্ডারে (`src/core/`) লেখা হবে, যেখানে ডিজাইনের কোনো কোড থাকবে না। পরে মোবাইল অ্যাপেও এই কোডই কাজে লাগবে।

**Prompt:** Create pure TypeScript functions in `src/core/`, with no React and no browser APIs:

1. **units:** convert `mm`, `cm`, `m`, `inch`, `ft` to each other.
2. **area:** convert to meters first, then m² × price.
   - 50×70 cm → 0.35 m² → 17.50 SAR
3. **packing:** count only complete stickers, with no trailing gap. Formula: `floor((material + gap) / (sticker + gap))`.
   - 100×100 cm, 5×5 cm, gap 0.5 → 324 stickers, used 98.5 cm, remaining 1.5 cm, waste 19%
4. **rotation:** test both orientations (W×H and H×W). More stickers wins; on a tie, less waste wins.
5. **roll mode:** quantity → exact roll length.
   - 5×7 cm, 500 pcs, 100 cm roll → 2.095 m → 104.75 SAR
6. **sheet mode** (cutter sticker, the main rule):
   - Width is locked at **1 m**. Sheets are **1 m × 1 m**.
   - Stickers per sheet → full sheets → leftover for the last sheet.
   - **Complete the last row.** Never leave a half row.
   - Show the used and **remaining cm on the last sheet**.
   - Artboard = **1 m × N m**.
   - Price on full sheets, and also show the price for the used length only.
   - On an orientation tie, pick the one that uses less length on the last sheet.
   - 5×5 cm, 3000 pcs → 10 sheets, last sheet 5 rows = 90 pcs, 27 cm used, **73 cm left**, 1 m × 10 m, 500 SAR (used length 9.27 m = 463.50 SAR)
7. **pricing:** cost, selling price, profit and margin.

---

## ধাপ ৩: টেস্ট ✅

**বাংলায়:** উপরের সব উদাহরণ ঠিক উত্তর দিচ্ছে কিনা, সেটা কোড দিয়ে নিজে নিজে পরীক্ষা হবে।

**Prompt:** Write Vitest tests in `tests/` for every example in `calculator.md` Step 3 (area, packing, rotation, roll, sheet mode). All tests must pass.

---

## ধাপ ৪: থিম (রেফারেন্স ছবির মতো) ✅

**বাংলায়:** গাঢ় টিল ব্যাকগ্রাউন্ড, সায়ান গ্লো, কাচের মতো প্যানেল আর গেমিং ফন্ট।

**Prompt:**
- Add colour tokens as CSS variables (`--bg #071216`, `--accent #38C6E0`, and the rest from `calculator.md` 4.2).
- Fonts with `next/font`: Orbitron (headings), Rajdhani (labels), Inter (body), JetBrains Mono (numbers).
- Background: a radial teal glow and light particles, turned off with `prefers-reduced-motion`.

---

## ধাপ ৫: UI-এর ছোট অংশ (Components) ✅

**বাংলায়:** বারবার ব্যবহার হবে এমন অংশগুলো বানানো।

**Prompt:** Create these in `src/components/ui/`:
- `Panel` (glass panel with a 01/02/03 number)
- `StatBar` (usage/waste bar)
- `Badge` (BEST LAYOUT / ROTATED / HIGH WASTE, with angled corners)
- `HudButton`
- `NumberInput` (`inputMode="decimal"`, unit label)

---

## ধাপ ৬: অ্যাপের কাঠামো (Layout) ✅

**বাংলায়:** মেনু আর পেজের কাঠামো। ডেস্কটপে বাম পাশে আইকন মেনু, মোবাইলে নিচে নেভিগেশন বার।

**Prompt:**
- Build `IconRail` (desktop), `BottomNav` (mobile), `TopBar` and the home dashboard with calculator cards.
- Add placeholder pages for the features that are not built yet.

---

## ধাপ ৭: প্রথম কাজ করা ক্যালকুলেটর ✅

**বাংলায়:** দুইটা ক্যালকুলেটর পুরোপুরি কাজ করবে।
- **Area & Price:** মাপ দিলে m² আর দাম দেখাবে।
- **Sheet / Quantity (কাটার স্টিকার):** পিস দিলে শিট সংখ্যা, শেষ শিটে কত cm বাকি, 1 m × N m আর্টবোর্ড আর দাম দেখাবে। সাথে লেআউটের ছবিও থাকবে।

**Prompt:** Build the `/area` and `/sheet` pages using `src/core/` only for the math. Use panels `01 Input` → `02 Result` → `03 Layout Preview` (SVG drawing of the last sheet with the leftover area highlighted). Show the Roll-mode result next to it for comparison.

---

## ধাপ ৮: PWA ✅

**বাংলায়:** ফোনে অ্যাপের মতো ইনস্টল করা যাবে।

**Prompt:** Add `manifest` (name "Press Calculator", theme colour `#071216`) and app icons.

---

## ধাপ ৯: ডকুমেন্টেশন ✅

**বাংলায়:** প্রতিটা অংশের লিখিত বিবরণ, যাতে পরে যে কেউ বুঝতে পারে।

**Prompt:** Create the 17 files in `docs/` (01-project-overview → 17-future-mobile-app).

---

## ধাপ ১০: চেক করে থামা ✅

**বাংলায়:** বিল্ড চালিয়ে দেখা কোনো ভুল আছে কিনা, ব্রাউজারে খুলে দেখা, তারপর থামা। বাকি ফিচার (Cost, Profit, History, Presets, Quote…) পরের ধাপে হবে।

**Prompt:** Run the tests, lint and `next build`. Open the app in the browser on desktop and mobile size and fix any problems. Then report: folder structure, technology, architecture, calculation engine and mobile-app plan.

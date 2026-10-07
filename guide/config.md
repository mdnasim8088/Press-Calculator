# কনফিগ: প্রজেক্টের সেটিংস ফাইল

এই ফাইলগুলো সাধারণত বদলাতে হয় না।

| ফাইল | কী আছে |
|---|---|
| `package.json` | প্রজেক্টের নাম (`press-calculator`), কোন প্যাকেজ লাগে, আর কমান্ডগুলো (`dev`, `build`, `test`) |
| `package-lock.json` | প্যাকেজের ঠিক কোন ভার্সন ইনস্টল হয়েছে, তার তালিকা। নিজে থেকে তৈরি হয়, হাতে বদলাবেন না। |
| `next.config.ts` | Next.js-এর সেটিংস (Cache Components, Partial Prefetching, Tailwind) |
| `tsconfig.json` | TypeScript-এর সেটিংস। `@/` মানে `src/` ফোল্ডার। |
| `eslint.config.mjs` | কোডের ভুল খোঁজার টুলের সেটিংস |
| `vitest.config.mts` | টেস্টের সেটিংস |
| `next-env.d.ts` | Next.js নিজে তৈরি করে, হাতে বদলাবেন না |
| `.gitignore` | কোন ফাইল git-এ যাবে না (যেমন `node_modules`, `.next`) |
| `node_modules/` | ইনস্টল করা প্যাকেজ। মুছে গেলে `npm install` দিলেই আবার আসবে। |
| `.next/` | বিল্ডের ফলাফল। নিজে থেকে তৈরি হয়। |

## ব্যবহার করা প্রযুক্তি

| প্যাকেজ | ভার্সন | কেন |
|---|---|---|
| Next.js | 16.4 | ওয়েবসাইটের মূল ফ্রেমওয়ার্ক (App Router) |
| React | 19.3 | UI বানানো |
| TypeScript | 5 | ভুল কম হয়, কোড বুঝতে সহজ |
| Tailwind CSS | 4 | ডিজাইন |
| lucide-react | 1.52 | আইকন |
| zustand | 5 | সেটিংস সেভ রাখা |
| vitest | 5 | টেস্ট |

## কমান্ড

| কমান্ড | কী হয় |
|---|---|
| `npm install` | সব প্যাকেজ ইনস্টল |
| `npm run dev` | কাজ করার সময় চালানো → http://localhost:3000 |
| `npm run build` | ফাইনাল বিল্ড |
| `npm start` | ফাইনাল বিল্ড চালানো |
| `npm test` | হিসাবের টেস্ট |
| `npm run lint` | কোডে ভুল খোঁজা |

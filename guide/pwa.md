# PWA: ফোনে অ্যাপের মতো ইনস্টল

PWA মানে ওয়েবসাইটটা ফোনের হোম স্ক্রিনে অ্যাপের মতো বসানো যায়, আর ইন্টারনেট ছাড়াও খোলে।

## ফাইলগুলো

| ফাইল | কী করে |
|---|---|
| `src/app/manifest.ts` | অ্যাপের পরিচয়: নাম "Press Calculator", রঙ `#071216`, আইকন, পুরো স্ক্রিনে খোলা (standalone)। |
| `brand/source/` | **আপনার আসল লোগো** (কালো-সাদা): `logo-mark.webp` (TA গোল), `logo-wordmark.webp` (TA + TUSAR AHAMMAD) |
| `scripts/build-brand.mjs` | লোগোকে থিমের রঙে বদলায়: TA সায়ান, নাম হালকা রঙে, পেছন স্বচ্ছ। সব আইকন বানায়। লোগো বদলালে চালান: `npm run brand` |
| `public/brand/logo-mark.png`, `logo-wordmark.png` | অ্যাপের ভেতরে দেখানো লোগো (বাম মেনু, হোম পেজ) |
| `public/icons/icon-192.png`, `icon-512.png` | ফোনে ইনস্টল করলে অ্যাপের আইকন (TA লোগো, গাঢ় ব্যাকগ্রাউন্ডে সায়ান) |
| `public/icons/icon-maskable-512.png` | Android-এর গোল বা স্কয়ার আইকনের জন্য, চারপাশে বাড়তি জায়গা রাখা। |
| `src/app/icon.png` | ব্রাউজার ট্যাবের ছোট আইকন (favicon)। |
| `src/app/apple-icon.png` | iPhone-এর হোম স্ক্রিনের আইকন। |
| `public/sw.js` | **Service worker**: অফলাইনে চালানোর ফাইল। |
| `src/components/layout/ClientBoot.tsx` | service worker চালু করে (শুধু ফাইনাল বিল্ডে, `npm run dev`-এ নয়)। |

## অফলাইন কীভাবে কাজ করে (`sw.js`)

- **পেজ:** আগে ইন্টারনেট থেকে আনার চেষ্টা করে। না পেলে আগে সেভ করা কপি দেখায়।
- **ডিজাইন ফাইল, ফন্ট, আইকন:** একবার আসার পর সেভ থাকে, পরে সেখান থেকেই খোলে।
- হিসাব সব ফোনেই হয়, তাই অফলাইনেও ক্যালকুলেটর পুরো কাজ করে।

## ফোনে ইনস্টল করার নিয়ম

1. অ্যাপটা অনলাইনে ডেপ্লয় করতে হবে (HTTPS লাগবে)।
2. **Android (Chrome):** মেনু → "Install app" বা "Add to Home screen"।
3. **iPhone (Safari):** Share বাটন → "Add to Home Screen"।

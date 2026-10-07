// Builds the app's logo and icon files from the original black-on-white logos in brand/source/.
// Run again after replacing a source file:  node scripts/build-brand.mjs
//
// Dark parts of the source become the theme colour; white becomes transparent.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

// Fiverr-style green gradient for the TA mark (--accent-bright → --accent-deep), dark name text, white icons.
const GRADIENT_FROM = [0x1d, 0xbf, 0x73];
const GRADIENT_TO = [0x0a, 0x7a, 0x43];
const TEXT = [0x22, 0x23, 0x25]; // --text
const BG = "#ffffff"; // --bg

/** Diagonal gradient colour at (x, y): top-left bright green → bottom-right deep green. */
const gradientAt = (x, y, width, height) => {
  const t = Math.min(1, Math.max(0, (x / width + y / height) / 2));
  return GRADIENT_FROM.map((from, i) => Math.round(from + (GRADIENT_TO[i] - from) * t));
};

/** Reads a black-on-white image as ink coverage per pixel (0 = paper, 255 = full ink). */
async function readInk(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ink = new Uint8Array(info.width * info.height);
  for (let i = 0; i < ink.length; i++) {
    const [r, g, b, a] = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    ink[i] = Math.round((255 - luminance) * (a / 255));
  }
  return { ink, width: info.width, height: info.height };
}

/** Colours ink pixels; `colorAt(x, y, width, height)` picks each pixel's colour. Returns a transparent PNG pipeline. */
function colorize({ ink, width, height }, colorAt) {
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const [r, g, b] = colorAt(x, y, width, height);
      out[i * 4] = r;
      out[i * 4 + 1] = g;
      out[i * 4 + 2] = b;
      out[i * 4 + 3] = ink[i] < 16 ? 0 : ink[i]; // drop faint paper noise
    }
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).trim();
}

/** First fully empty column gap after `from`: where the TA mark ends and the name begins. */
function findGap({ ink, width, height }, from) {
  const empty = (x) => {
    for (let y = 0; y < height; y++) if (ink[y * width + x] >= 16) return false;
    return true;
  };
  for (let x = from; x < width; x++) if (empty(x)) return x;
  return width;
}

/** Square app icon: the mark centred on the theme background with `padding` (0–0.5) around it. */
async function appIcon(markPng, size, padding, file) {
  const inner = Math.round(size * (1 - padding * 2));
  const mark = await sharp(markPng).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(file);
}

await mkdir("public/brand", { recursive: true });
await mkdir("public/icons", { recursive: true });

// TA circle mark, in the green gradient.
const mark = await readInk("brand/source/logo-mark.webp");
const markPng = await colorize(mark, gradientAt).png().toBuffer();
await sharp(markPng).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile("public/brand/logo-mark.png");

// TA + TUSAR AHAMMAD: the mark in the green gradient, the name in the dark text colour.
const word = await readInk("brand/source/logo-wordmark.webp");
const gap = findGap(word, Math.round(word.width * 0.15));
await colorize(word, (x, y, _w, h) => (x < gap ? gradientAt(x, y, gap, h) : TEXT))
  .resize({ height: 200 })
  .png()
  .toFile("public/brand/logo-wordmark.png");

// App icons (PWA, favicon, iPhone).
await appIcon(markPng, 192, 0.1, "public/icons/icon-192.png");
await appIcon(markPng, 512, 0.1, "public/icons/icon-512.png");
await appIcon(markPng, 512, 0.2, "public/icons/icon-maskable-512.png"); // safe zone for round Android icons
await appIcon(markPng, 256, 0.06, "src/app/icon.png");
await appIcon(markPng, 180, 0.1, "src/app/apple-icon.png");

console.log(`Brand assets built (wordmark split at x=${gap}).`);

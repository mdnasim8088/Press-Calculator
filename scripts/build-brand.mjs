// Builds the app's logo and icon files from the Taghareed (وكالة تغاريد) logo in brand/source/.
// Run again after replacing the source file:  npm run brand
//
// The logo keeps its own colours (navy text, green bird). Only the white background
// is removed, so it sits cleanly on the app's white theme and on any card.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "brand/source/taghareed-logo.png";
const ICON_BG = "#ffffff"; // --bg
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * "Colour to alpha" against white: pure white becomes transparent, colours stay exact,
 * and anti-aliased edges fade smoothly instead of leaving a white halo.
 */
async function removeWhite(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    const coverage = Math.max(255 - r, 255 - g, 255 - b) / 255; // 0 = white, 1 = full colour
    if (coverage < 0.03) continue; // stays fully transparent
    const unmix = (c) => Math.round(Math.min(255, Math.max(0, (c - 255 * (1 - coverage)) / coverage)));
    out[i] = unmix(r);
    out[i + 1] = unmix(g);
    out[i + 2] = unmix(b);
    out[i + 3] = Math.round(coverage * a);
  }
  return { raw: out, width: info.width, height: info.height };
}

/**
 * Left edge of the bird. Scans from the right: skip the empty margin, cross the bird,
 * and stop at the first empty column. (Scanning from the left would stop at gaps between letters.)
 */
function findBirdStart({ raw, width, height }) {
  const empty = (x) => {
    for (let y = 0; y < height; y++) if (raw[(y * width + x) * 4 + 3] > 8) return false;
    return true;
  };
  let x = width - 1;
  while (x > 0 && empty(x)) x--; // right margin
  while (x > 0 && !empty(x)) x--; // the bird
  return x + 1;
}

/** Square app icon: the bird centred on white with `padding` (0–0.5) around it. */
async function appIcon(markPng, size, padding, file) {
  const inner = Math.round(size * (1 - padding * 2));
  const mark = await sharp(markPng).resize(inner, inner, { fit: "contain", background: TRANSPARENT }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: ICON_BG } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(file);
}

await mkdir("public/brand", { recursive: true });
await mkdir("public/icons", { recursive: true });

const logo = await removeWhite(SOURCE);
const image = () => sharp(logo.raw, { raw: { width: logo.width, height: logo.height, channels: 4 } });

// Full logo: Arabic name + TAGHAREED + bird.
const wordmark = await image().trim().resize({ height: 240 }).png().toFile("public/brand/logo-wordmark.png");

// Bird only (right of the gap after the text), for the menu icon and app icons.
const gap = findBirdStart(logo);
// Two separate steps: sharp runs trim() before extract() inside one pipeline.
const birdArea = await image().extract({ left: gap, top: 0, width: logo.width - gap, height: logo.height }).png().toBuffer();
const birdPng = await sharp(birdArea).trim().png().toBuffer();
await sharp(birdPng).resize(512, 512, { fit: "contain", background: TRANSPARENT }).png().toFile("public/brand/logo-mark.png");

// App icons (PWA, favicon, iPhone).
await appIcon(birdPng, 192, 0.12, "public/icons/icon-192.png");
await appIcon(birdPng, 512, 0.12, "public/icons/icon-512.png");
await appIcon(birdPng, 512, 0.22, "public/icons/icon-maskable-512.png"); // safe zone for round Android icons
await appIcon(birdPng, 256, 0.06, "src/app/icon.png");
await appIcon(birdPng, 180, 0.12, "src/app/apple-icon.png");

console.log(`Brand assets built: wordmark ${wordmark.width}×${wordmark.height}, bird split at x=${gap}.`);

import Image from "next/image";

/** TA circle mark (Tusar Ahammad), in the theme accent colour. Built by scripts/build-brand.mjs. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt="Tusar Ahammad"
      width={size}
      height={size}
      priority
      className="drop-shadow-[0_0_8px_var(--accent-glow)]"
    />
  );
}

/** TA mark + TUSAR AHAMMAD name. Source image is 1030 × 200. */
export function Wordmark({ height = 40 }: { height?: number }) {
  return (
    <Image
      src="/brand/logo-wordmark.png"
      alt="Tusar Ahammad"
      width={Math.round((height * 1030) / 200)}
      height={height}
      priority
      className="h-auto max-w-full drop-shadow-[0_0_10px_var(--accent-glow)]"
    />
  );
}

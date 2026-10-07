import Image from "next/image";

const BRAND = "Taghareed Agency (وكالة تغاريد)";

/**
 * Taghareed bird mark, in the logo's own colours. Built by scripts/build-brand.mjs.
 * Served as-is (unoptimized) so a rebuilt logo shows immediately instead of a cached copy.
 */
export function Logo({ size = 40 }: { size?: number }) {
  return <Image src="/brand/logo-mark.png" alt={BRAND} width={size} height={size} priority unoptimized />;
}

/** Full Taghareed logo: Arabic name, TAGHAREED and the bird. Source image is 698 × 240. */
export function Wordmark({ height = 40 }: { height?: number }) {
  return (
    <Image
      src="/brand/logo-wordmark.png"
      alt={BRAND}
      width={Math.round((height * 698) / 240)}
      height={height}
      priority
      unoptimized
      className="h-auto max-w-full"
    />
  );
}

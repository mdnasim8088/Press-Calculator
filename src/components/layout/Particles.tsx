// Fixed positions so server and client render the same markup.
const PARTICLES = [
  { left: 4, delay: 0, duration: 22 },
  { left: 13, delay: 7, duration: 28 },
  { left: 24, delay: 3, duration: 25 },
  { left: 37, delay: 11, duration: 30 },
  { left: 49, delay: 5, duration: 24 },
  { left: 61, delay: 14, duration: 27 },
  { left: 72, delay: 2, duration: 23 },
  { left: 83, delay: 9, duration: 29 },
  { left: 93, delay: 16, duration: 26 },
];

/** Subtle floating light shards. Hidden with prefers-reduced-motion (see globals.css). */
export function Particles() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {PARTICLES.map((p) => (
        <span
          key={p.left}
          className="particle"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
        />
      ))}
    </div>
  );
}

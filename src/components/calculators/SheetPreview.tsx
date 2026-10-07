import type { SheetOption, Unit } from "@/core";
import { formatNumber } from "@/lib/format";

/** Above this many stickers, each row is drawn as one strip to keep the SVG light. */
const MAX_DRAWN_ITEMS = 1500;

interface SheetPreviewProps {
  option: SheetOption;
  unit: Unit;
  gap: number;
}

/** Draws the last sheet: placed stickers, and the leftover length highlighted. */
export function SheetPreview({ option, unit, gap }: SheetPreviewProps) {
  const { sheetSize: size, perRow, lastSheetRows, itemWidth, itemHeight, lastSheetUsed, lastSheetRemaining } = option;
  const drawStrips = perRow * lastSheetRows > MAX_DRAWN_ITEMS;
  const font = size * 0.045;
  const usedWidth = perRow * itemWidth + (perRow - 1) * gap;

  const rows = Array.from({ length: lastSheetRows }, (_, r) => r * (itemHeight + gap));

  return (
    <figure className="space-y-3">
      <svg
        viewBox={`${-size * 0.02} ${-size * 0.08} ${size * 1.04} ${size * 1.1}`}
        className="mx-auto block w-full max-w-md"
        role="img"
        aria-label={`Last sheet: ${formatNumber(lastSheetUsed)} ${unit} used, ${formatNumber(lastSheetRemaining)} ${unit} left`}
      >
        <defs>
          <pattern id="leftover-hatch" width={size * 0.03} height={size * 0.03} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2={size * 0.03} stroke="var(--warning)" strokeWidth={size * 0.006} opacity="0.35" />
          </pattern>
        </defs>

        {/* Width label with leader line */}
        <line x1="0" y1={-size * 0.035} x2={size} y2={-size * 0.035} stroke="var(--text-muted)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <text x={size / 2} y={-size * 0.05} textAnchor="middle" fontSize={font} fill="var(--text-muted)" fontFamily="var(--font-rajdhani)">
          {formatNumber(size)} {unit} (1 m)
        </text>

        {/* Sheet */}
        <rect x="0" y="0" width={size} height={size} fill="var(--surface-solid)" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

        {/* Stickers */}
        {drawStrips
          ? rows.map((y) => (
              <rect key={y} x="0" y={y} width={usedWidth} height={itemHeight} fill="var(--accent)" opacity="0.75" />
            ))
          : rows.flatMap((y, r) =>
              Array.from({ length: perRow }, (_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={c * (itemWidth + gap)}
                  y={y}
                  width={itemWidth}
                  height={itemHeight}
                  rx={Math.min(itemWidth, itemHeight) * 0.08}
                  fill="var(--accent)"
                  opacity="0.8"
                />
              )),
            )}

        {/* Leftover */}
        {lastSheetRemaining > 0 && (
          <g>
            <rect x="0" y={lastSheetUsed} width={size} height={lastSheetRemaining} fill="url(#leftover-hatch)" />
            <line x1="0" y1={lastSheetUsed} x2={size} y2={lastSheetUsed} stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
            {lastSheetRemaining > size * 0.08 && (
              <text
                x={size / 2}
                y={lastSheetUsed + lastSheetRemaining / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={font * 1.3}
                fontWeight="700"
                fill="var(--warning)"
                fontFamily="var(--font-rajdhani)"
              >
                {formatNumber(lastSheetRemaining)} {unit} LEFT
              </text>
            )}
          </g>
        )}
      </svg>
      <figcaption className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" /> {lastSheetRows} rows × {perRow} stickers
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-warning/60" /> leftover
        </span>
      </figcaption>
    </figure>
  );
}

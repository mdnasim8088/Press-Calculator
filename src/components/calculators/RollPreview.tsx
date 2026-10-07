import type { ReactNode } from "react";
import type { Unit } from "@/core";
import { formatNumber } from "@/lib/format";

/** One piece of the roll: a full 1 m sheet, the last (partly used) sheet, or extra length after the sheets. */
export interface RollPiece {
  kind: "full" | "last" | "extra";
  /** Piece length in `unit` (a sheet is `sheetSize`). */
  length: number;
  rows: number;
  /** Last sheet only: length used by the rows, in `unit`. */
  used?: number;
}

interface RollPreviewProps {
  sheetSize: number;
  perRow: number;
  itemWidth: number;
  itemHeight: number;
  gap: number;
  unit: Unit;
  pieces: RollPiece[];
  caption?: ReactNode;
}

/** Long rolls show the first and last sheets with a "+N" marker between them. */
const MAX_PIECES_DRAWN = 6;
const HEAD = 2;
const TAIL = 3;
/** Above this many stickers, each row is drawn as one strip to keep the SVG light. */
const MAX_DRAWN_ITEMS = 2500;

type DrawItem = { piece: RollPiece; number: number } | { skipped: number };

/**
 * Draws the roll lying sideways: length runs left → right, the 1 m width top → bottom.
 * Each sheet is outlined; the empty part of the last sheet is hatched in amber.
 */
export function RollPreview({ sheetSize: size, perRow, itemWidth, itemHeight, gap, unit, pieces, caption }: RollPreviewProps) {
  const numbered = pieces.map((piece, i) => ({ piece, number: i + 1 }));
  const items: DrawItem[] =
    numbered.length > MAX_PIECES_DRAWN
      ? [...numbered.slice(0, HEAD), { skipped: numbered.length - HEAD - TAIL }, ...numbered.slice(-TAIL)]
      : numbered;

  const skipWidth = size * 0.45;
  const drawnItems = items.reduce((n, it) => ("piece" in it ? n + it.piece.rows * perRow : n), 0);
  const strips = drawnItems > MAX_DRAWN_ITEMS;
  const usedWidth = perRow * itemWidth + (perRow - 1) * gap;
  const font = size * 0.06;

  // Left edge of each drawn item, laid out one after another.
  const placed = items.reduce<{ it: DrawItem; x: number }[]>((acc, it) => {
    const prev = acc[acc.length - 1];
    const x = prev ? prev.x + ("piece" in prev.it ? prev.it.piece.length : skipWidth) : 0;
    return [...acc, { it, x }];
  }, []);
  const last = placed[placed.length - 1];
  const totalLength = last ? last.x + ("piece" in last.it ? last.it.piece.length : skipWidth) : 0;

  return (
    <figure className="space-y-3">
      <div className="no-scrollbar overflow-x-auto">
        <svg
          viewBox={`${-size * 0.02} ${-size * 0.14} ${totalLength + size * 0.04} ${size * 1.18}`}
          className="block h-auto w-full"
          style={{ minWidth: Math.min(110 * (totalLength / size), 900) }}
          role="img"
          aria-label={`Roll preview: ${pieces.length} pieces`}
        >
          <defs>
            <pattern id="roll-leftover" width={size * 0.04} height={size * 0.04} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2={size * 0.04} stroke="var(--warning)" strokeWidth={size * 0.008} opacity="0.4" />
            </pattern>
          </defs>

          {placed.map(({ it, x: px }, i) => {
            if (!("piece" in it)) {
              return (
                <text key={`skip-${i}`} x={px + skipWidth / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle" fontSize={font * 1.2} fill="var(--text-muted)" fontFamily="var(--font-rajdhani)">
                  … +{it.skipped}
                </text>
              );
            }
            const { piece, number } = it;
            const leftover = piece.kind === "last" && piece.used !== undefined ? piece.length - piece.used : 0;
            const label =
              piece.kind === "extra" ? `+${formatNumber(piece.length)} ${unit}` : piece.kind === "last" ? `Sheet ${number} · last` : `Sheet ${number}`;
            const outline = piece.kind === "full" ? "var(--accent)" : "var(--warning)";
            return (
              <g key={number}>
                <rect
                  x={px}
                  y="0"
                  width={piece.length}
                  height={size}
                  fill="var(--surface-solid)"
                  stroke={outline}
                  strokeWidth="1.5"
                  strokeDasharray={piece.kind === "extra" ? "6 4" : undefined}
                  vectorEffect="non-scaling-stroke"
                />
                <text x={px + piece.length / 2} y={-size * 0.04} textAnchor="middle" fontSize={font} fill={piece.kind === "full" ? "var(--text-muted)" : "var(--warning)"} fontFamily="var(--font-rajdhani)">
                  {label}
                </text>
                {Array.from({ length: piece.rows }, (_, r) => {
                  const rx = px + r * (itemHeight + gap);
                  return strips ? (
                    <rect key={r} x={rx} y="0" width={itemHeight} height={usedWidth} fill="var(--accent)" opacity="0.75" />
                  ) : (
                    Array.from({ length: perRow }, (_, c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={rx}
                        y={c * (itemWidth + gap)}
                        width={itemHeight}
                        height={itemWidth}
                        rx={Math.min(itemWidth, itemHeight) * 0.08}
                        fill="var(--accent)"
                        opacity="0.8"
                      />
                    ))
                  );
                })}
                {leftover > 0 && piece.used !== undefined && (
                  <g>
                    <rect x={px + piece.used} y="0" width={leftover} height={size} fill="url(#roll-leftover)" />
                    <line x1={px + piece.used} y1="0" x2={px + piece.used} y2={size} stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
                    {leftover > size * 0.15 && (
                      <text
                        x={px + piece.used + leftover / 2}
                        y={size / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={font * 1.1}
                        fontWeight="700"
                        fill="var(--warning)"
                        fontFamily="var(--font-rajdhani)"
                      >
                        {formatNumber(leftover)} {unit} empty
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="space-y-1 text-center text-xs text-muted">
        {caption}
        <p>Width 1 m (top → bottom) · length left → right</p>
      </figcaption>
    </figure>
  );
}

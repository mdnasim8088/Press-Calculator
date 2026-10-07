import { RotateCw } from "lucide-react";
import type { Unit } from "@/core";
import { Badge } from "@/components/ui/Badge";

/** Units offered for sticker sizes. */
export const STICKER_UNITS: readonly Unit[] = ["mm", "cm", "inch"];

/** The cutter-sticker roll is always 1 m wide. */
export const ROLL_WIDTH_METERS = 1;

/** "Best layout" badge, plus "Rotated" when the stickers are turned 90°. */
export function LayoutBadges({ rotated }: { rotated: boolean }) {
  return (
    <span className="flex gap-1.5">
      <Badge tone="success">Best layout</Badge>
      {rotated && (
        <Badge>
          <RotateCw size={12} /> Rotated
        </Badge>
      )}
    </span>
  );
}

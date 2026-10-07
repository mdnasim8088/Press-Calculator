import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Presets" };

export default function PresetsPage() {
  return <ComingSoon href="/presets" />;
}

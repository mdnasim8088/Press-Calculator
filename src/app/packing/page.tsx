import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Sticker Packing" };

export default function StickerPackingPage() {
  return <ComingSoon href="/packing" tabs />;
}

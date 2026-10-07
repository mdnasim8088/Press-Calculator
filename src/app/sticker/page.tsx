import type { Metadata } from "next";
import { StickerCalculator } from "@/components/calculators/StickerCalculator";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Sticker" };

export default function StickerPage() {
  return (
    <>
      <PageHeader title="Sticker Calculator" help="page.sticker" tabs />
      <StickerCalculator />
    </>
  );
}

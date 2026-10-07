import type { Metadata } from "next";
import { StickerCalculator } from "@/components/calculators/StickerCalculator";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Sticker Sheet" };

export default function StickerPage() {
  return (
    <>
      <PageHeader title="Sticker Sheet Calculator" help="page.sticker" tabs />
      <StickerCalculator />
    </>
  );
}

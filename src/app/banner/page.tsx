import type { Metadata } from "next";
import { BannerCalculator } from "@/components/calculators/BannerCalculator";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Banner" };

export default function BannerPage() {
  return (
    <>
      <PageHeader title="Banner Calculator" help="page.banner" tabs />
      <BannerCalculator />
    </>
  );
}

import type { Metadata } from "next";
import { QuantityCalculator } from "@/components/calculators/QuantityCalculator";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Quantity" };

export default function QuantityPage() {
  return (
    <>
      <PageHeader title="Quantity Calculator" help="page.quantity" tabs />
      <QuantityCalculator />
    </>
  );
}

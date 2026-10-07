import type { Metadata } from "next";
import { AreaCalculator } from "@/components/calculators/AreaCalculator";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Area & Price" };

export default function AreaPage() {
  return (
    <>
      <PageHeader
        title="Area & Price"
        help="page.area"
        tabs
      />
      <AreaCalculator />
    </>
  );
}

import type { Metadata } from "next";
import { SheetCalculator } from "@/components/calculators/SheetCalculator";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Sheet / Quantity" };

export default function SheetPage() {
  return (
    <>
      <PageHeader
        title="Sheet Calculator"
        help="page.sheet"
        tabs
      />
      <SheetCalculator />
    </>
  );
}

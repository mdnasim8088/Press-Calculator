import type { Metadata } from "next";
import { BasicCalculator } from "@/components/calculators/BasicCalculator";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Calculator" };

export default function CalculatorPage() {
  return (
    <>
      <PageHeader title="Calculator" help="tool.calculator" tabs />
      <BasicCalculator />
    </>
  );
}

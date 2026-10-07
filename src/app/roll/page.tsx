import type { Metadata } from "next";
import { RollCalculator } from "@/components/calculators/RollCalculator";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Roll" };

export default function RollPage() {
  return (
    <>
      <PageHeader title="Roll Calculator" help="page.roll" tabs />
      <RollCalculator />
    </>
  );
}

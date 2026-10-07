import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Profit" };

export default function ProfitPage() {
  return <ComingSoon href="/profit" tabs />;
}

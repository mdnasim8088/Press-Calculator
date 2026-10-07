import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Quote" };

export default function QuotePage() {
  return <ComingSoon href="/quote" />;
}

import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Cost" };

export default function CostPage() {
  return <ComingSoon href="/cost" tabs />;
}

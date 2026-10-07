import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Waste" };

export default function WastePage() {
  return <ComingSoon href="/waste" />;
}

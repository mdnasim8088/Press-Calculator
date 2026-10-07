import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Best Layout" };

export default function BestLayoutPage() {
  return <ComingSoon href="/best-layout" />;
}

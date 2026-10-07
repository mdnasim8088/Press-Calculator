import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return <ComingSoon href="/history" />;
}

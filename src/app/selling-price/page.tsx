import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Selling Price" };

export default function SellingPricePage() {
  return <ComingSoon href="/selling-price" />;
}

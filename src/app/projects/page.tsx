import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <ComingSoon href="/projects" />;
}

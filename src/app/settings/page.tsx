import type { Metadata } from "next";
import { SettingsForm } from "@/components/calculators/SettingsForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" help="page.settings" />
      <SettingsForm />
    </>
  );
}

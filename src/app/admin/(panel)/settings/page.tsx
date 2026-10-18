import type { Metadata } from "next";
import { getSettings } from "@/data/settings";
import { requireAdmin } from "@/lib/auth-guard";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-xl font-semibold">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}

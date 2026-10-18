import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";

export default async function AdminHomePage() {
  await requireAdmin();
  redirect("/admin/projects");
}

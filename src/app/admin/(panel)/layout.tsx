import { UploadEnabledProvider } from "@/components/admin/UploadContext";
import { requireAdmin } from "@/lib/auth-guard";
import { isCloudinaryUploadEnabled } from "@/lib/env";
import AdminNav from "./AdminNav";

// Layouts don't re-run on every navigation, so every page also calls requireAdmin().
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-12 md:px-8 md:py-10">
      <aside className="border-b pb-4 md:w-44 md:shrink-0 md:border-b-0 md:pb-0">
        <p className="mb-3 px-2 text-xs text-muted-foreground md:mb-6">
          <span className="block font-medium uppercase tracking-wide">Admin</span>
          <span className="block truncate" title={admin.email}>
            {admin.email}
          </span>
        </p>
        <AdminNav />
      </aside>

      <main className="min-w-0 flex-1">
        <UploadEnabledProvider enabled={isCloudinaryUploadEnabled()}>{children}</UploadEnabledProvider>
      </main>
    </div>
  );
}

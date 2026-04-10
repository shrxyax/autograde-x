import { requireUser } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/shell/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[240px_1fr]">
      <DashboardSidebar role={user.role} />
      <div className="space-y-6">{children}</div>
    </div>
  );
}

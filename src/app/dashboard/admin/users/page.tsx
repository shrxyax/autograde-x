import { requireRole } from "@/lib/auth/session";
import { getAdminDashboardData } from "@/lib/dashboard/queries";
import { DeleteUserButton } from "@/components/dashboard/delete-user-button";
import { RoleSelectForm } from "@/components/dashboard/role-select-form";
import { EmptyState } from "@/components/shared/empty-state";
import { roles } from "@/lib/domain";

export default async function AdminUsersPage() {
  const admin = await requireRole([roles.ADMIN]);
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">User management</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review account roles, assignment ownership, and submission activity.
        </p>
      </section>

      {data.users.length === 0 ? (
        <EmptyState title="No users found" description="Accounts will appear here after registration." />
      ) : (
        <section className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role Controls</th>
                  <th className="px-4 py-3 font-medium">Assignments</th>
                  <th className="px-4 py-3 font-medium">Submissions</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">{user.name}</p>
                      <p className="text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <RoleSelectForm userId={user.id} currentRole={user.role} disabled={user.id === admin.id} />
                    </td>
                    <td className="px-4 py-4 text-slate-600">{user._count.assignmentsCreated}</td>
                    <td className="px-4 py-4 text-slate-600">{user._count.submissions}</td>
                    <td className="px-4 py-4">
                      <DeleteUserButton userId={user.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

import { requireRole } from "@/lib/auth/session";
import { getAdminDashboardData } from "@/lib/dashboard/queries";
import { AssignmentStatusForm } from "@/components/dashboard/assignment-status-form";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import { roles } from "@/lib/domain";

export default async function AdminAssignmentsPage() {
  await requireRole([roles.ADMIN]);
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Assignment moderation</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review assignments across faculty accounts and update their availability.
        </p>
      </section>

      {data.assignments.length === 0 ? (
        <EmptyState title="No assignments found" description="Assignments will appear here once faculty publish them." />
      ) : (
        <div className="space-y-4">
          {data.assignments.map((assignment) => (
            <div key={assignment.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{assignment.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {assignment.topic} · {assignment.createdBy.name} · Due {formatDate(assignment.deadline)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {assignment._count.submissions} submissions · Current status: {assignment.status}
                  </p>
                </div>
                <AssignmentStatusForm assignmentId={assignment.id} currentStatus={assignment.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

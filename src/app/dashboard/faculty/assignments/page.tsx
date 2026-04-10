import { requireRole } from "@/lib/auth/session";
import { getFacultyDashboardData } from "@/lib/dashboard/queries";
import { formatDate } from "@/lib/utils";
import { deleteAssignmentAction, updateAssignmentStatusAction } from "@/actions/assignments";
import { AssignmentForm } from "@/components/dashboard/assignment-form";
import { EmptyState } from "@/components/shared/empty-state";
import { assignmentStatuses, roles } from "@/lib/domain";

export default async function FacultyAssignmentsPage() {
  const user = await requireRole([roles.FACULTY]);
  const data = await getFacultyDashboardData(user.id);

  return (
    <div className="space-y-6">
      <AssignmentForm />

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">Assignment control panel</h2>
        <p className="mt-2 text-sm text-slate-600">
          Publish, close, or delete assignment briefs from here.
        </p>

        <div className="mt-6 space-y-4">
          {data.assignments.length === 0 ? (
            <EmptyState title="No assignments yet" description="Use the form above to publish your first assignment." />
          ) : (
            data.assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{assignment.title}</p>
                    <p className="text-sm text-slate-600">
                      {assignment.topic} · Due {formatDate(assignment.deadline)} · {assignment._count.submissions} submissions
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form action={updateAssignmentStatusAction}>
                      <input type="hidden" name="assignmentId" value={assignment.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={assignment.status === assignmentStatuses.CLOSED ? assignmentStatuses.PUBLISHED : assignmentStatuses.CLOSED}
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        {assignment.status === assignmentStatuses.CLOSED ? "Reopen" : "Close"}
                      </button>
                    </form>
                    <form action={deleteAssignmentAction}>
                      <input type="hidden" name="assignmentId" value={assignment.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

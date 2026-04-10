import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getStudentDashboardData } from "@/lib/dashboard/queries";
import { formatDate } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { roles } from "@/lib/domain";

export default async function StudentDashboard() {
  const user = await requireRole([roles.STUDENT]);
  const data = await getStudentDashboardData(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Student dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Track assignments, uploads, and finalized feedback.</h1>
        <p className="mt-2 text-sm text-slate-600">
          Welcome back, {user.name}. You can submit improved versions until the deadline closes.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard label="Open assignments" value={data.stats.activeAssignments} hint="Published by faculty." />
        <StatCard label="Submitted projects" value={data.stats.submittedAssignments} hint="Latest version per assignment." />
        <StatCard label="Finalized reviews" value={data.stats.finalizedReviews} hint="Faculty-reviewed outcomes." />
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Upcoming deadlines</h2>
            <p className="mt-1 text-sm text-slate-600">Stay ahead of pending project reviews.</p>
          </div>
          <Link className="text-sm font-semibold text-sky-700" href="/dashboard/student/assignments">
            View all assignments
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {data.assignments.length === 0 ? (
            <EmptyState title="No assignments yet" description="Faculty has not published a project brief yet." />
          ) : (
            data.assignments.slice(0, 4).map((assignment) => (
              <div key={assignment.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{assignment.title}</p>
                    <p className="text-sm text-slate-600">{assignment.topic} · {assignment.createdBy.name}</p>
                  </div>
                  <div className="text-sm text-slate-500">Due {formatDate(assignment.deadline)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

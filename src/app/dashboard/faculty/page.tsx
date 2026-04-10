import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getFacultyDashboardData } from "@/lib/dashboard/queries";
import { formatDate } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { roles } from "@/lib/domain";

export default async function FacultyDashboard() {
  const user = await requireRole([roles.FACULTY]);
  const data = await getFacultyDashboardData(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Faculty dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Publish assignments and close the loop on AI reviews.</h1>
        <p className="mt-2 text-sm text-slate-600">
          Welcome back, {user.name}. Monitor similarity flags and finalize grades from one place.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard label="Assignments" value={data.stats.assignments} hint="Created in your workspace." />
        <StatCard label="Pending reviews" value={data.stats.pendingReviews} hint="AI-reviewed or flagged submissions." />
        <StatCard label="Flagged submissions" value={data.stats.flaggedSubmissions} hint="Similarity above the review threshold." />
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Recently published assignments</h2>
            <p className="mt-1 text-sm text-slate-600">Open, close, or archive them from the assignments tab.</p>
          </div>
          <Link className="text-sm font-semibold text-sky-700" href="/dashboard/faculty/assignments">
            Manage assignments
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {data.assignments.length === 0 ? (
            <EmptyState title="No assignments yet" description="Create your first project brief to start collecting submissions." />
          ) : (
            data.assignments.slice(0, 4).map((assignment) => (
              <div key={assignment.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{assignment.title}</p>
                    <p className="text-sm text-slate-600">{assignment.topic}</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    Due {formatDate(assignment.deadline)} · {assignment._count.submissions} submissions
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

import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getAdminDashboardData } from "@/lib/dashboard/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { roles } from "@/lib/domain";

export default async function AdminDashboard() {
  const user = await requireRole([roles.ADMIN]);
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Admin dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">System oversight for users, submissions, and assignment health.</h1>
        <p className="mt-2 text-sm text-slate-600">Signed in as {user.name}. Track platform growth and adjust moderation controls.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard label="Users" value={data.users.length} hint="Students, faculty, and admins." />
        <StatCard label="Assignments" value={data.assignments.length} hint="Published and draft briefs." />
        <StatCard label="Flagged reviews" value={data.stats.flaggedSubmissions} hint="High-similarity or manually flagged work." />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Link href="/dashboard/admin/users" className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <h2 className="text-xl font-semibold text-slate-950">Manage users</h2>
          <p className="mt-2 text-sm text-slate-600">Review roles, activity, and remove accounts when required.</p>
        </Link>

        <Link href="/dashboard/admin/assignments" className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <h2 className="text-xl font-semibold text-slate-950">Moderate assignments</h2>
          <p className="mt-2 text-sm text-slate-600">Open, close, and inspect course briefs across faculty accounts.</p>
        </Link>

        <Link href="/dashboard/admin/submissions" className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <h2 className="text-xl font-semibold text-slate-950">Monitor submissions</h2>
          <p className="mt-2 text-sm text-slate-600">Inspect flagged reviews and update moderation state.</p>
        </Link>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Recent platform activity</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {data.submissions.slice(0, 6).map((submission) => (
            <div key={submission.id} className="rounded-[22px] bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">{submission.assignment.title}</p>
              <p>{submission.user.name} · similarity {submission.plagiarismScore}% · AI score {submission.aiScore}/100</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{submission.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

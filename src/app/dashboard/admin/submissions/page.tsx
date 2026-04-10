import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getAdminDashboardData } from "@/lib/dashboard/queries";
import { SubmissionStatusForm } from "@/components/dashboard/submission-status-form";
import { EmptyState } from "@/components/shared/empty-state";
import { roles } from "@/lib/domain";

export default async function AdminSubmissionsPage() {
  await requireRole([roles.ADMIN]);
  const data = await getAdminDashboardData();

  const prioritySubmissions = data.submissions
    .filter((submission) => submission.status === "FLAGGED" || submission.plagiarismScore >= 65 || submission.aiProbability >= 75)
    .sort((left, right) => right.plagiarismScore - left.plagiarismScore);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Submission monitoring</h1>
        <p className="mt-2 text-sm text-slate-600">
          Track risky submissions, inspect uploaded reports, and adjust moderation state.
        </p>
      </section>

      {prioritySubmissions.length === 0 ? (
        <EmptyState title="No flagged submissions" description="High-risk submissions will surface here automatically." />
      ) : (
        <div className="space-y-4">
          {prioritySubmissions.map((submission) => (
            <div key={submission.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{submission.assignment.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {submission.user.name} · Faculty owner: {submission.assignment.createdBy.name}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">Similarity {submission.plagiarismScore}%</span>
                    <span className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">AI score {submission.aiScore}/100</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">AI probability {submission.aiProbability}%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <SubmissionStatusForm submissionId={submission.id} currentStatus={submission.status} />
                  <Link
                    href={submission.reportPath}
                    className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Open report
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

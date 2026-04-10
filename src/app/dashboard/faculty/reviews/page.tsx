import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getFacultyDashboardData } from "@/lib/dashboard/queries";
import { formatDateTime } from "@/lib/utils";
import { ReviewForm } from "@/components/dashboard/review-form";
import { EmptyState } from "@/components/shared/empty-state";
import { roles, submissionStatuses } from "@/lib/domain";

function parseFeedback(value: string) {
  try {
    return JSON.parse(value) as { strengths: string[]; weaknesses: string[] };
  } catch {
    return { strengths: [], weaknesses: [] };
  }
}

export default async function FacultyReviewsPage() {
  const user = await requireRole([roles.FACULTY]);
  const data = await getFacultyDashboardData(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Submission reviews</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review flagged submissions, inspect AI feedback, and finalize scores.
        </p>
      </section>

      {data.submissions.length === 0 ? (
        <EmptyState title="No submissions received" description="Student uploads will appear here for review." />
      ) : (
        data.submissions.map((submission) => {
          const feedback = parseFeedback(submission.aiFeedback);

          return (
            <article key={submission.id} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-slate-950">{submission.assignment.title}</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {submission.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {submission.user.name} · {submission.user.email} · Submitted {formatDateTime(submission.createdAt)}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">AI score {submission.aiScore}/100</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">Similarity {submission.plagiarismScore}%</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">Quality {submission.qualityScore}%</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] bg-emerald-50 p-4 text-sm text-emerald-800">
                      <p className="font-semibold">Strengths</p>
                      <ul className="mt-2 space-y-1">
                        {feedback.strengths.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[24px] bg-red-50 p-4 text-sm text-red-800">
                      <p className="font-semibold">Weaknesses</p>
                      <ul className="mt-2 space-y-1">
                        {feedback.weaknesses.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link
                    href={submission.reportPath}
                    className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Open uploaded report
                  </Link>
                </div>

                {submission.status === submissionStatuses.FINALIZED ? (
                  <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Finalized</p>
                    <p className="mt-4 text-4xl font-semibold text-slate-950">{submission.finalScore}/100</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{submission.finalFeedback}</p>
                  </div>
                ) : (
                  <ReviewForm submissionId={submission.id} suggestedScore={submission.aiScore} />
                )}
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

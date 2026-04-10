import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getStudentDashboardData } from "@/lib/dashboard/queries";
import { formatDateTime } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { roles } from "@/lib/domain";

function parseFeedback(value: string) {
  try {
    return JSON.parse(value) as { strengths: string[]; weaknesses: string[] };
  } catch {
    return { strengths: [], weaknesses: [] };
  }
}

function parseReport(value: string) {
  try {
    return JSON.parse(value) as { summary: string };
  } catch {
    return { summary: "No analysis summary available." };
  }
}

export default async function StudentSubmissionsPage() {
  const user = await requireRole([roles.STUDENT]);
  const data = await getStudentDashboardData(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Submission history</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review AI feedback, plagiarism checks, and finalized faculty comments.
        </p>
      </section>

      {data.submissions.length === 0 ? (
        <EmptyState title="No submissions yet" description="Upload your first project report from the assignments page." />
      ) : (
        data.submissions.map((submission) => {
          const feedback = parseFeedback(submission.aiFeedback);
          const report = parseReport(submission.staticReport);

          return (
            <article key={submission.id} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-950">{submission.assignment.title}</h2>
                  <p className="text-sm text-slate-500">
                    Version {submission.version} · Submitted {formatDateTime(submission.createdAt)}
                  </p>
                  <p className="text-sm text-slate-600">{report.summary}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">AI score {submission.aiScore}/100</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">Similarity {submission.plagiarismScore}%</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">AI probability {submission.aiProbability}%</span>
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
                </div>

                <div className="w-full max-w-sm rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Final result</p>
                  {submission.finalScore !== null ? (
                    <>
                      <p className="mt-4 text-4xl font-semibold text-slate-950">{submission.finalScore}/100</p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{submission.finalFeedback}</p>
                    </>
                  ) : (
                    <p className="mt-4 text-sm text-slate-600">Faculty review is still pending.</p>
                  )}
                  <Link
                    href={submission.reportPath}
                    className="mt-6 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Open uploaded report
                  </Link>
                </div>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

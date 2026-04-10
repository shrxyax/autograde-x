import { requireRole } from "@/lib/auth/session";
import { getStudentDashboardData } from "@/lib/dashboard/queries";
import { formatDate } from "@/lib/utils";
import { SubmissionForm } from "@/components/dashboard/submission-form";
import { EmptyState } from "@/components/shared/empty-state";
import { roles } from "@/lib/domain";

export default async function StudentAssignmentsPage() {
  const user = await requireRole([roles.STUDENT]);
  const data = await getStudentDashboardData(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Assignments</h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload a PDF report and optional repository link for each project.
        </p>
      </section>

      {data.assignments.length === 0 ? (
        <EmptyState title="No assignments published" description="Faculty has not opened submissions yet." />
      ) : (
        <div className="space-y-6">
          {data.assignments.map((assignment) => {
            const existing = data.submissions.find((submission) => submission.assignmentId === assignment.id);

            return (
              <article key={assignment.id} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-950">{assignment.title}</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {assignment.difficulty}
                      </span>
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{assignment.description}</p>
                    <p className="text-sm text-slate-500">Deadline: {formatDate(assignment.deadline)} · Max score: {assignment.maxScore}</p>
                    <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                      <strong className="text-slate-900">Rubric:</strong> {assignment.rubric}
                    </div>
                  </div>

                  <div className="w-full max-w-md">
                    {existing ? (
                      <div className="mb-4 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        Latest submission: version {existing.version} · AI score {existing.aiScore}/100 · similarity {existing.plagiarismScore}%
                      </div>
                    ) : null}
                    <SubmissionForm assignmentId={assignment.id} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

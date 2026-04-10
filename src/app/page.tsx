import Link from "next/link";
import { getHomePageData } from "@/lib/dashboard/queries";
import { StatCard } from "@/components/dashboard/stat-card";

const features = [
  {
    title: "Rubric-driven AI evaluation",
    description: "Upload a project report and get a consistent AI score, strengths, weaknesses, and AI-authorship estimate.",
  },
  {
    title: "Faculty oversight",
    description: "Review flagged submissions, override AI decisions, and finalize grades inside a single dashboard.",
  },
  {
    title: "Versioned submissions",
    description: "Students can submit improved versions while faculty keep the latest attempt, quality signals, and history visible.",
  },
];

export default async function Home() {
  const data = await getHomePageData();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-sm font-semibold text-sky-700">
            Review faster. Grade with evidence.
          </span>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              AutoGradeX turns project evaluation into a transparent, AI-assisted workflow.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Built for the BCSE301-style course project flow: assignments, rubric-aware AI scoring,
              plagiarism checks, faculty overrides, and student-facing feedback in one responsive dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Launch workspace
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
            >
              Explore dashboards
            </Link>
          </div>
        </div>

        <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Live snapshot</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatCard label="Published assignments" value={data.assignments} hint="Ready for student submissions." />
            <StatCard label="Student accounts" value={data.students} hint="Course participants onboarded." />
            <StatCard label="Faculty reviewers" value={data.faculty} hint="Managing rubrics and reviews." />
            <StatCard label="Submissions tracked" value={data.submissions} hint="Versioned attempts captured." />
          </div>
        </div>
      </section>

      <section id="features" className="mt-24 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </section>

      <section id="workflow" className="mt-24 rounded-[36px] border border-slate-200 bg-slate-950 px-8 py-10 text-white">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">1. Publish</p>
            <h3 className="mt-3 text-2xl font-semibold">Faculty creates the rubric</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Define topic, deadline, difficulty, and weighted evaluation criteria.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">2. Evaluate</p>
            <h3 className="mt-3 text-2xl font-semibold">AI grades the report</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Uploaded PDFs are analyzed for quality, plagiarism similarity, and rubric alignment.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">3. Finalize</p>
            <h3 className="mt-3 text-2xl font-semibold">Faculty confirms the result</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Review flagged cases, override scores, and publish actionable feedback to students.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Unauthorized</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your account does not have access to this section.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}

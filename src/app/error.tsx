"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="rounded-[28px] border border-red-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">Something went wrong</h2>
        <p className="mt-3 text-sm text-slate-600">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

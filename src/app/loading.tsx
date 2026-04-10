export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="h-12 w-72 animate-pulse rounded-2xl bg-slate-200" />
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-[28px] bg-white" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-16 animate-pulse rounded-[28px] bg-white" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[28px] bg-white" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-[28px] bg-white" />
    </div>
  );
}

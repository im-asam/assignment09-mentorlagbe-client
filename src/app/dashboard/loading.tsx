/** Dashboard-scoped loading skeleton: stat cards + content shimmer. */
export default function DashboardLoading() {
  return (
    <div className="animate-pulse" aria-label="Loading dashboard">
      <div className="h-8 w-56 rounded-full bg-brand-100 dark:bg-brand-900" />
      <div className="mt-2 h-4 w-80 max-w-full rounded-full bg-brand-50 dark:bg-brand-900/60" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-3xl border border-brand-100 bg-white p-5 dark:border-brand-900 dark:bg-[#1b1a35]"
          >
            <div className="h-4 w-24 rounded-full bg-brand-100 dark:bg-brand-900" />
            <div className="mt-4 h-8 w-16 rounded-full bg-brand-100 dark:bg-brand-900" />
          </div>
        ))}
      </div>
      <div className="mt-8 h-64 rounded-[2rem] border border-brand-100 bg-white dark:border-brand-900 dark:bg-[#1b1a35]" />
    </div>
  );
}

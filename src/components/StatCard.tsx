export default function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
}) {
  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm dark:border-brand-900 dark:bg-[#1b1a35]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-xl dark:bg-brand-900/70">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

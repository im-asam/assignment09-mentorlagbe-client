/**
 * Stat cards are numbers: a label, a big figure, and what it compares to.
 * No icons, sparklines, or decoration — the figure is the content.
 */
export default function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-medium tabular-nums tracking-tight text-ink">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

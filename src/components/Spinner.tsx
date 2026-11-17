export default function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-line-strong border-t-accent-ink" />
      <span className="text-sm text-secondary">{label}</span>
    </div>
  );
}

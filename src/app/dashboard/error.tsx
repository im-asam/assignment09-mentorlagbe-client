"use client";

import Link from "next/link";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-5xl font-extrabold text-brand-200 dark:text-brand-800">Oops!</p>
      <h1 className="mt-4 font-display text-xl font-bold text-brand-950 dark:text-white">
        This dashboard section hit an error
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
        Your data is safe. Try loading it again, or go back to your dashboard
        overview.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
        >
          Dashboard Home
        </Link>
      </div>
    </div>
  );
}

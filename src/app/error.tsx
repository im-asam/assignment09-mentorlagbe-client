"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-200 dark:text-brand-800">Oops!</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-brand-950 dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
        An unexpected error stopped this page from loading. Try again, or head
        back home — your data is safe.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

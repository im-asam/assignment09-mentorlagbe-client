import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-extrabold text-brand-200 dark:text-brand-800">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-brand-950 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or was moved. Let&apos;s
        get you back to finding a great tutor.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center py-10 text-center">
      <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-lg dark:border-brand-900 dark:bg-[#1c1a18]">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-brand-900">
          ✕
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-brand-950 dark:text-white">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          No worries — nothing was charged and your account stays on the Free
          plan. You can upgrade anytime you&apos;re ready.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/pricing"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

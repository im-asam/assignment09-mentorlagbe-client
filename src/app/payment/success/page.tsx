"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyCheckoutSession } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: session } = useSession();
  const [state, setState] = useState<"verifying" | "done" | "failed">(
    sessionId ? "verifying" : "failed",
  );
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (!sessionId || ran.current) return;
    ran.current = true;
    verifyCheckoutSession(sessionId)
      .then((res) => {
        setMessage(res.message ?? "Your Pro plan is now active.");
        setState("done");
      })
      .catch((err) => {
        setMessage(
          err instanceof Error
            ? err.message
            : "We couldn't verify this payment. If you were charged, contact support.",
        );
        setState("failed");
      });
  }, [sessionId]);

  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center py-10 text-center">
      {state === "verifying" ? (
        <>
          <Spinner label="Verifying your payment…" />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Hang on — we&apos;re confirming your subscription with Stripe.
          </p>
        </>
      ) : state === "done" ? (
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-lg dark:border-emerald-900 dark:bg-[#1b1a35]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl dark:bg-emerald-950">
            ✓
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-brand-950 dark:text-white">
            Payment Successful!
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {message}
          </p>
          <p className="mt-4 inline-block rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
            Your plan is now Pro 🎉
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href={role ? `/dashboard/${role}` : "/dashboard"}
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-amber-100 bg-white p-8 shadow-lg dark:border-amber-900 dark:bg-[#1b1a35]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl dark:bg-amber-950">
            !
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-brand-950 dark:text-white">
            Couldn&apos;t Confirm Payment
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {message ||
              "No checkout session was found in this link. If you completed a payment, it may take a moment to sync — check your dashboard."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/pricing"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Back to Pricing
            </Link>
            <Link
              href="/"
              className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Spinner label="Loading…" />}>
      <SuccessContent />
    </Suspense>
  );
}

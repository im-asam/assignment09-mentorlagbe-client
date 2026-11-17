"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createCheckoutSession } from "@/lib/api";
import { useSession, type Role, type Plan } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

type CheckoutPlan = "tutor-pro" | "student-pro";

const PLANS: {
  id: CheckoutPlan;
  audience: string;
  price: number;
  role: Role;
  tagline: string;
  features: string[];
  highlight: boolean;
}[] = [
  {
    id: "tutor-pro",
    audience: "For Tutors",
    price: 15,
    role: "tutor",
    tagline: "Post without limits and get discovered first.",
    features: [
      "Unlimited tuition posts (Free: max 2)",
      "Verified badge on profile & listings",
      "Higher placement in search results",
      "Priority support",
    ],
    highlight: true,
  },
  {
    id: "student-pro",
    audience: "For Students",
    price: 10,
    role: "student",
    tagline: "Priority booking with the best mentors.",
    features: [
      "Priority application review",
      "Early access to new batches",
      "Pro badge on your applications",
      "Priority support",
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [busyPlan, setBusyPlan] = useState<CheckoutPlan | null>(null);

  const role = (session?.user as { role?: Role } | undefined)?.role;
  const plan = (session?.user as { plan?: Plan } | undefined)?.plan ?? "free";
  const isPro = plan === "pro";

  const handleSubscribe = async (checkoutPlan: CheckoutPlan, audienceRole: Role) => {
    if (!session?.user) {
      toast("Please sign in first to subscribe.", { icon: "🔐" });
      router.push(`/sign-in?next=${encodeURIComponent("/pricing")}`);
      return;
    }
    if (role !== audienceRole) {
      toast.error(
        `This plan is for ${audienceRole}s. You're signed in as a ${role}.`,
      );
      return;
    }
    if (isPro) {
      toast.success("You're already on the Pro plan. Enjoy!");
      return;
    }
    setBusyPlan(checkoutPlan);
    try {
      const { url } = await createCheckoutSession(checkoutPlan);
      if (!url) throw new Error("Checkout session did not return a URL.");
      window.location.href = url;
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Checkout is unavailable right now. Please try again later.",
      );
    } finally {
      setBusyPlan(null);
    }
  };

  return (
    <div className="pb-8">
      <div className="pt-4 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl dark:text-white">
          Simple Plans, Real Value
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-400">
          Start free. Upgrade to Pro when you&apos;re ready — secure checkout
          powered by Stripe.
        </p>
        {isPending ? (
          <div className="mt-4 flex justify-center"><Spinner label="" /></div>
        ) : session?.user ? (
          <p className="mt-4 inline-block rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
            You&apos;re on the <span className="capitalize">{plan}</span> plan
            {isPro ? " — thank you for supporting MentorLagbe!" : " — upgrade anytime below."}
          </p>
        ) : null}
      </div>

      {/* Free plan strip */}
      <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8 dark:border-brand-900 dark:bg-[#1b1a35]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-950 dark:text-white">Free — $0 forever</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Browse all approved tuitions, apply as a student, and post up to 2
              tuitions as a tutor. No card required.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Included for everyone
          </span>
        </div>
      </div>

      {/* Pro plans */}
      <div className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
        {PLANS.map((p) => {
          const isOwnPlan = role === p.role;
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-[2rem] border-2 p-8 shadow-sm ${
                p.highlight
                  ? "border-brand-600 bg-white dark:bg-[#1b1a35]"
                  : "border-brand-100 bg-white dark:border-brand-900 dark:bg-[#1b1a35]"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow">
                  MOST POPULAR
                </span>
              )}
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {p.audience}
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-brand-950 dark:text-white">
                Pro
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.tagline}</p>
              <p className="mt-5 font-display text-4xl font-extrabold text-brand-950 dark:text-white">
                ${p.price}
                <span className="ml-1 text-base font-medium text-slate-500 dark:text-slate-400">/ month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="text-brand-600 dark:text-brand-400">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleSubscribe(p.id, p.role)}
                disabled={busyPlan !== null}
                className={`mt-8 w-full rounded-full py-3.5 text-sm font-bold transition disabled:opacity-60 ${
                  p.highlight
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/25 hover:bg-brand-700"
                    : "border-2 border-brand-600 text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/50"
                }`}
              >
                {busyPlan === p.id
                  ? "Starting checkout…"
                  : isPro && isOwnPlan
                    ? "You're Pro ✓"
                    : `Subscribe with Stripe — $${p.price}/mo`}
              </button>
              {!isOwnPlan && session?.user && (
                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  This plan is for {p.role}s — you&apos;re signed in as a {role}.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        Payments are processed securely by Stripe. Your plan upgrades to Pro
        automatically after a successful payment.
      </p>
    </div>
  );
}

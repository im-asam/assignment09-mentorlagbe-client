"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyTuitions, getTutorApplications, type Tuition, type Application } from "@/lib/api";
import { useSession, type Plan } from "@/lib/auth-client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import StatCard from "@/components/StatCard";
import { formatFee } from "@/lib/constants";

function TutorOverviewContent() {
  const { data: session } = useSession();
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const plan = ((session?.user as { plan?: Plan } | undefined)?.plan ?? "free") as Plan;

  useEffect(() => {
    let alive = true;
    Promise.all([getMyTuitions(), getTutorApplications()])
      .then(([t, a]) => {
        if (!alive) return;
        setTuitions(t);
        setApps(a);
      })
      .catch(() => {
        if (alive) setFailed(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const activeApproved = tuitions.filter((t) => t.isActive && t.approvalStatus === "approved").length;
  const pendingApps = apps.filter((a) => a.status === "pending").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        Tutor Overview
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Your listings, applicants, and plan at a glance.
      </p>

      {loading ? (
        <Spinner label="Loading your overview…" />
      ) : failed ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load your dashboard right now.
          </p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">Please refresh the page.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Posted" value={tuitions.length} sub="All your tuition listings" />
            <StatCard label="Active & Approved" value={activeApproved} sub="Live on Browse Tuitions" />
            <StatCard label="Total Applicants" value={apps.length} sub={`${pendingApps} awaiting your decision`} />
            <StatCard
              label="Current Plan"
              value={plan === "pro" ? "Pro" : "Free"}
              sub={plan === "pro" ? "Unlimited posts" : "Max 2 posts — upgrade for unlimited"}
            />
          </div>

          {plan === "free" && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Free plan: you can post up to <strong>2 tuitions</strong> ({tuitions.length} used).
                Go Pro for unlimited posts and a verified badge.
              </p>
              <Link
                href="/pricing"
                className="shrink-0 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Upgrade to Pro — $15/mo
              </Link>
            </div>
          )}

          <div className="mt-8 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-sm dark:border-brand-900 dark:bg-[#1c1a18]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-brand-950 dark:text-white">
                Your Latest Listings
              </h2>
              <Link href="/dashboard/tutor/my-tuitions" className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                Manage all →
              </Link>
            </div>
            {tuitions.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-brand-50/70 p-6 text-center dark:bg-brand-900/40">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You haven&apos;t posted a tuition yet. Create your first listing —
                  it goes live after admin approval.
                </p>
                <Link
                  href="/dashboard/tutor/post-tuition"
                  className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Post a Tuition
                </Link>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100 dark:divide-brand-900">
                {tuitions.slice(0, 5).map((t) => (
                  <li key={t._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-brand-950 dark:text-white">{t.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.subject} · {t.classLevel} · {formatFee(t.monthlyFee)}/mo
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        t.approvalStatus === "approved"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : t.approvalStatus === "rejected"
                            ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {t.approvalStatus}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function TutorOverviewPage() {
  return (
    <ProtectedRoute roles={["tutor"]}>
      <TutorOverviewContent />
    </ProtectedRoute>
  );
}

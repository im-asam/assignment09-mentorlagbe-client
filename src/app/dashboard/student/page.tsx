"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyApplications, type Application } from "@/lib/api";
import { useSession, type Plan } from "@/lib/auth-client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import StatCard from "@/components/StatCard";
import { formatDate, formatFee } from "@/lib/constants";

function StudentOverviewContent() {
  const { data: session } = useSession();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const plan = ((session?.user as { plan?: Plan } | undefined)?.plan ?? "free") as Plan;

  useEffect(() => {
    let alive = true;
    getMyApplications()
      .then((data) => {
        if (alive) setApps(data);
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

  const total = apps.length;
  const accepted = apps.filter((a) => a.status === "accepted").length;
  const pending = apps.filter((a) => a.status === "pending").length;
  const recent = [...apps]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 3);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        Student Overview
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Track your applications and keep learning.
      </p>

      {loading ? (
        <Spinner label="Loading your overview…" />
      ) : failed ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load your applications right now.
          </p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">Please refresh the page.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Applied" value={total} icon="✉" sub="All tuitions you applied to" />
            <StatCard label="Accepted" value={accepted} icon="✅" sub="Tutors who said yes" />
            <StatCard label="Pending" value={pending} icon="⏳" sub="Awaiting tutor response" />
            <StatCard
              label="Current Plan"
              value={plan === "pro" ? "Pro" : "Free"}
              icon="⭐"
              sub={plan === "pro" ? "Priority booking active" : "Upgrade for priority booking"}
            />
          </div>

          <div className="mt-8 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-sm dark:border-brand-900 dark:bg-[#1b1a35]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-brand-950 dark:text-white">
                Recent Applications
              </h2>
              <Link href="/dashboard/student/my-applications" className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                View all →
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-brand-50/70 p-6 text-center dark:bg-brand-900/40">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You haven&apos;t applied to any tuition yet. Browse approved
                  listings and apply in a minute.
                </p>
                <Link
                  href="/tuitions"
                  className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Browse Tuitions
                </Link>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100 dark:divide-brand-900">
                {recent.map((a) => (
                  <li key={a._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-brand-950 dark:text-white">{a.tuitionTitle}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {a.subject} · {formatFee(a.monthlyFee)}/mo · Applied {formatDate(a.appliedAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        a.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : a.status === "rejected"
                            ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {a.status}
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

export default function StudentOverviewPage() {
  return (
    <ProtectedRoute roles={["student"]}>
      <StudentOverviewContent />
    </ProtectedRoute>
  );
}

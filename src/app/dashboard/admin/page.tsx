"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats, type AdminStats } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import StatCard from "@/components/StatCard";

function AdminOverviewContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getAdminStats()
      .then((s) => {
        if (alive) setStats(s);
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

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        Admin Overview
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Platform health, moderation queue, and revenue at a glance.
      </p>

      {loading ? (
        <Spinner label="Loading platform stats…" />
      ) : failed || !stats ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load platform stats right now.
          </p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">Please refresh the page.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Users" value={stats.totalUsers} sub="Students, tutors & admins" />
            <StatCard label="Total Tutors" value={stats.totalTutors} sub="Registered tutor accounts" />
            <StatCard
              label="Tuitions"
              value={`${stats.pendingTuitions} pending`}
              sub={`${stats.approvedTuitions} approved & live`}
            />
            <StatCard
              label="Total Stripe Revenue"
              value={`$${Number(stats.totalRevenue || 0).toLocaleString("en-US")}`}
              sub={stats.totalTransactions != null ? `${stats.totalTransactions} Pro payments` : "All Pro subscriptions"}
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/dashboard/admin/tuitions",
                title: "Review Tuitions",
                text: `${stats.pendingTuitions} listing${stats.pendingTuitions === 1 ? "" : "s"} waiting for approval.`,
                cta: "Moderate →",
              },
              {
                href: "/dashboard/admin/users",
                title: "Manage Users",
                text: "Change roles and keep the community healthy.",
                cta: "View users →",
              },
              {
                href: "/dashboard/admin/transactions",
                title: "Transactions",
                text: "Every Stripe Pro payment, in one table.",
                cta: "View payments →",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-brand-900 dark:bg-[#1c1a18]"
              >
                <h2 className="font-display text-lg font-bold text-brand-950 dark:text-white">{card.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{card.text}</p>
                <p className="mt-4 text-sm font-semibold text-brand-600 dark:text-brand-400">{card.cta}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminOverviewContent />
    </ProtectedRoute>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getAdminTuitions,
  updateTuitionStatus,
  type ApprovalStatus,
  type Tuition,
} from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import { fallbackBanner, formatDate, formatFee } from "@/lib/constants";

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

function AdminTuitionsContent() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ApprovalStatus>("all");

  const load = () => {
    setLoading(true);
    setFailed(false);
    getAdminTuitions()
      .then(setTuitions)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id: string, status: ApprovalStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateTuitionStatus(id, status);
      setTuitions((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success(
        status === "approved"
          ? "Tuition approved — it's now live."
          : "Tuition rejected.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update this tuition.");
    } finally {
      setUpdatingId(null);
    }
  };

  const visible = filter === "all" ? tuitions : tuitions.filter((t) => t.approvalStatus === filter);
  const pendingCount = tuitions.filter((t) => t.approvalStatus === "pending").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        Tuition Moderation
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {tuitions.length} total listing{tuitions.length === 1 ? "" : "s"}
        {pendingCount > 0 && ` — ${pendingCount} waiting for review`}. Only approved
        &amp; active listings appear publicly.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === f
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "border border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading tuitions…" />
      ) : failed ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load tuitions right now.
          </p>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-brand-200 p-12 text-center dark:border-brand-800">
          <p className="font-display text-lg font-bold text-brand-950 dark:text-white">
            {tuitions.length === 0 ? "No tuitions yet" : `No ${filter} tuitions`}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {tuitions.length === 0
              ? "Tutor listings will appear here as soon as they're posted."
              : "Try a different filter."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          {visible.map((t) => (
            <article
              key={t._id}
              className="grid gap-5 rounded-[2rem] border border-brand-100 bg-white p-5 shadow-sm sm:grid-cols-[200px_1fr] dark:border-brand-900 dark:bg-[#1b1a35]"
            >
              <div className="overflow-hidden rounded-2xl bg-brand-50 dark:bg-brand-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.bannerImage || fallbackBanner(t._id)}
                  alt={t.title}
                  className="h-36 w-full object-cover sm:h-full"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-bold leading-snug text-brand-950 dark:text-white">
                    <Link href={`/tuitions/${t._id}`} className="transition hover:text-brand-600 dark:hover:text-brand-400">
                      {t.title}
                    </Link>
                  </h2>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLE[t.approvalStatus]}`}>
                    {t.approvalStatus}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.subject} · {t.classLevel} · {t.mode} · {formatFee(t.monthlyFee)}/mo ·{" "}
                  {t.daysPerWeek} days/week · Posted {formatDate(t.createdAt)}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Tutor: <span className="font-medium text-brand-950 dark:text-white">{t.tutorName}</span> ({t.tutorEmail})
                  {" · "}
                  {t.isActive ? "Active" : "Closed by tutor"}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatus(t._id, "approved")}
                    disabled={updatingId === t._id || t.approvalStatus === "approved"}
                    className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {updatingId === t._id ? "Updating…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatus(t._id, "rejected")}
                    disabled={updatingId === t._id || t.approvalStatus === "rejected"}
                    className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {updatingId === t._id ? "Updating…" : "Reject"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminTuitionsPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminTuitionsContent />
    </ProtectedRoute>
  );
}

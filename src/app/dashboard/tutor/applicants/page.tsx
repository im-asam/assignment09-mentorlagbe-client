"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getTutorApplications,
  updateApplicationStatus,
  type Application,
  type ApplicationStatus,
} from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import { formatDate, formatFee } from "@/lib/constants";

const STATUS_STYLE: Record<string, string> = {
  accepted: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

function ApplicantsContent() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ApplicationStatus>("all");

  const load = () => {
    setLoading(true);
    setFailed(false);
    getTutorApplications()
      .then(setApps)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id: string, status: ApplicationStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateApplicationStatus(id, status);
      setApps((prev) => prev.map((a) => (a._id === id ? updated : a)));
      toast.success(
        status === "accepted" ? "Application accepted!" : "Application rejected.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update this application.");
    } finally {
      setUpdatingId(null);
    }
  };

  const visible = filter === "all" ? apps : apps.filter((a) => a.status === filter);
  const pendingCount = apps.filter((a) => a.status === "pending").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        Applicants
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Students who applied to your tuitions
        {pendingCount > 0 && ` — ${pendingCount} awaiting your decision`}.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
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
        <Spinner label="Loading applicants…" />
      ) : failed ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load applicants right now.
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
            {apps.length === 0 ? "No applicants yet" : `No ${filter} applications`}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {apps.length === 0
              ? "Once students apply to your approved tuitions, they'll appear here."
              : "Try a different filter to see other applications."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {visible.map((a) => (
            <article
              key={a._id}
              className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6 dark:border-brand-900 dark:bg-[#1b1a35]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-bold text-white">
                    {a.studentName?.slice(0, 1)?.toUpperCase() ?? "S"}
                  </span>
                  <div>
                    <p className="font-bold text-brand-950 dark:text-white">{a.studentName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{a.studentEmail}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 rounded-2xl bg-brand-50/60 p-4 text-sm sm:grid-cols-2 dark:bg-brand-900/40">
                <p>
                  <span className="font-semibold text-brand-950 dark:text-white">Tuition: </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {a.tuitionTitle} ({a.subject} · {formatFee(a.monthlyFee)}/mo)
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-brand-950 dark:text-white">Phone: </span>
                  <span className="text-slate-600 dark:text-slate-400">{a.studentPhone}</span>
                </p>
                <p>
                  <span className="font-semibold text-brand-950 dark:text-white">Preferred schedule: </span>
                  <span className="text-slate-600 dark:text-slate-400">{a.preferredSchedule}</span>
                </p>
                <p>
                  <span className="font-semibold text-brand-950 dark:text-white">Applied: </span>
                  <span className="text-slate-600 dark:text-slate-400">{formatDate(a.appliedAt)}</span>
                </p>
                {a.studentNote && (
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-brand-950 dark:text-white">Note: </span>
                    <span className="text-slate-600 dark:text-slate-400">{a.studentNote}</span>
                  </p>
                )}
              </div>

              {a.status === "pending" && (
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatus(a._id, "rejected")}
                    disabled={updatingId === a._id}
                    className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/40"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatus(a._id, "accepted")}
                    disabled={updatingId === a._id}
                    className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {updatingId === a._id ? "Updating…" : "Accept"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApplicantsPage() {
  return (
    <ProtectedRoute roles={["tutor"]}>
      <ApplicantsContent />
    </ProtectedRoute>
  );
}

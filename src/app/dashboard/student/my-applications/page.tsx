"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { deleteApplication, getMyApplications, type Application } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import ConfirmModal from "@/components/ConfirmModal";
import { formatDate, formatFee } from "@/lib/constants";

const STATUS_STYLE: Record<string, string> = {
  accepted: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

function MyApplicationsContent() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [toDelete, setToDelete] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    setFailed(false);
    getMyApplications()
      .then(setApps)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteApplication(toDelete._id);
      toast.success("Application cancelled.");
      setApps((prev) => prev.filter((a) => a._id !== toDelete._id));
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't cancel this application.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        My Applications
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Every tuition you&apos;ve applied to — cancel a pending one anytime.
      </p>

      {loading ? (
        <Spinner label="Loading your applications…" />
      ) : failed ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load your applications right now.
          </p>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      ) : apps.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-brand-200 p-12 text-center dark:border-brand-800">
          <p className="font-display text-lg font-bold text-brand-950 dark:text-white">
            No applications yet
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Find a tuition you like and apply — it takes about a minute.
          </p>
          <Link
            href="/tuitions"
            className="mt-5 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Browse Tuitions
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {apps.map((a) => (
            <article
              key={a._id}
              className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6 dark:border-brand-900 dark:bg-[#1c1a18]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold text-brand-950 dark:text-white">
                    <Link href={`/tuitions/${a.tuitionId}`} className="transition hover:text-brand-600 dark:hover:text-brand-400">
                      {a.tuitionTitle}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {a.subject} · {formatFee(a.monthlyFee)}/month · Applied {formatDate(a.appliedAt)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 rounded-2xl bg-brand-50/60 p-4 text-sm sm:grid-cols-2 dark:bg-brand-900/40">
                <p>
                  <span className="font-semibold text-brand-950 dark:text-white">Tutor: </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {a.tutorName ?? "—"} ({a.tutorEmail})
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-brand-950 dark:text-white">Schedule: </span>
                  <span className="text-slate-600 dark:text-slate-400">{a.preferredSchedule}</span>
                </p>
                <p>
                  <span className="font-semibold text-brand-950 dark:text-white">Your phone: </span>
                  <span className="text-slate-600 dark:text-slate-400">{a.studentPhone}</span>
                </p>
                {a.studentNote && (
                  <p>
                    <span className="font-semibold text-brand-950 dark:text-white">Note: </span>
                    <span className="text-slate-600 dark:text-slate-400">{a.studentNote}</span>
                  </p>
                )}
              </div>

              {a.status === "pending" && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setToDelete(a)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                  >
                    Cancel Application
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Cancel this application?"
        message={`Your application for "${toDelete?.tuitionTitle ?? ""}" will be removed. You can apply again later if you change your mind.`}
        confirmLabel="Yes, Cancel It"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        busy={deleting}
      />
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <ProtectedRoute roles={["student"]}>
      <MyApplicationsContent />
    </ProtectedRoute>
  );
}

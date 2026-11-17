"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  deleteTuition,
  getMyTuitions,
  updateTuition,
  type Tuition,
  type TuitionInput,
} from "@/lib/api";
import { CLASS_LEVELS, fallbackBanner, formatFee, MODES, SUBJECTS } from "@/lib/constants";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import ConfirmModal from "@/components/ConfirmModal";
import ImageUpload from "@/components/ImageUpload";

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900";

const APPROVAL_STYLE: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

function EditTuitionModal({
  tuition,
  onClose,
  onSaved,
}: {
  tuition: Tuition;
  onClose: () => void;
  onSaved: (t: Tuition) => void;
}) {
  const [form, setForm] = useState<TuitionInput>({
    title: tuition.title,
    subject: tuition.subject,
    classLevel: tuition.classLevel,
    mode: tuition.mode,
    location: tuition.location,
    monthlyFee: tuition.monthlyFee,
    daysPerWeek: tuition.daysPerWeek,
    bannerImage: tuition.bannerImage ?? "",
    description: tuition.description,
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof TuitionInput>(key: K, value: TuitionInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title can't be empty.");
    if (!form.location.trim()) return toast.error("Location can't be empty.");
    if (!form.monthlyFee || form.monthlyFee <= 0) return toast.error("Enter a valid monthly fee.");
    if (form.daysPerWeek < 1 || form.daysPerWeek > 7) return toast.error("Days per week must be 1–7.");
    if (form.description.trim().length < 20) return toast.error("Description needs at least 20 characters.");

    setSaving(true);
    try {
      const updated = await updateTuition(tuition._id, {
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
      });
      toast.success("Tuition updated!");
      onSaved(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update this tuition.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Edit tuition"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8 dark:bg-[#1b1a35]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-bold text-brand-950 dark:text-white">Edit Tuition</h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Title *</label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Subject</label>
              <select value={form.subject} onChange={(e) => set("subject", e.target.value)} className={inputCls}>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Class Level</label>
              <select value={form.classLevel} onChange={(e) => set("classLevel", e.target.value)} className={inputCls}>
                {CLASS_LEVELS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Mode</label>
              <select
                value={form.mode}
                onChange={(e) => set("mode", e.target.value as "Online" | "Offline")}
                className={inputCls}
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Location *</label>
              <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Monthly Fee (৳) *</label>
              <input
                type="number"
                min="1"
                value={form.monthlyFee}
                onChange={(e) => set("monthlyFee", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Days per Week *</label>
              <input
                type="number"
                min="1"
                max="7"
                value={form.daysPerWeek}
                onChange={(e) => set("daysPerWeek", Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>
          <ImageUpload value={form.bannerImage} onChange={(url) => set("bannerImage", url)} label="Banner Image" />
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-brand-800 dark:text-slate-200 dark:hover:bg-brand-900/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MyTuitionsContent() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [editing, setEditing] = useState<Tuition | null>(null);
  const [toDelete, setToDelete] = useState<Tuition | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setFailed(false);
    getMyTuitions()
      .then(setTuitions)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTuition(toDelete._id);
      toast.success("Tuition deleted.");
      setTuitions((prev) => prev.filter((t) => t._id !== toDelete._id));
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete this tuition.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (t: Tuition) => {
    setTogglingId(t._id);
    try {
      const updated = await updateTuition(t._id, { isActive: !t.isActive });
      setTuitions((prev) => prev.map((x) => (x._id === t._id ? updated : x)));
      toast.success(updated.isActive ? "Tuition is now Active." : "Tuition is now Closed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't change the status.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
            My Tuitions
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Edit, delete, or pause any of your listings.
          </p>
        </div>
        <Link
          href="/dashboard/tutor/post-tuition"
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700"
        >
          ＋ Post New Tuition
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading your tuitions…" />
      ) : failed ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load your tuitions right now.
          </p>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      ) : tuitions.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-brand-200 p-12 text-center dark:border-brand-800">
          <p className="font-display text-lg font-bold text-brand-950 dark:text-white">
            No tuitions posted yet
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Your first listing is a few minutes away.
          </p>
          <Link
            href="/dashboard/tutor/post-tuition"
            className="mt-5 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Post Your First Tuition
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {tuitions.map((t) => (
            <article
              key={t._id}
              className="flex flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm dark:border-brand-900 dark:bg-[#1b1a35]"
            >
              <div className="relative aspect-[16/7] w-full bg-brand-50 dark:bg-brand-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.bannerImage || fallbackBanner(t._id)}
                  alt={t.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${APPROVAL_STYLE[t.approvalStatus]}`}>
                    {t.approvalStatus}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      t.isActive
                        ? "bg-brand-600 text-white"
                        : "bg-slate-600 text-white"
                    }`}
                  >
                    {t.isActive ? "Active" : "Closed"}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-lg font-bold leading-snug text-brand-950 dark:text-white">
                  {t.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.subject} · {t.classLevel} · {t.mode} · {formatFee(t.monthlyFee)}/mo
                </p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-brand-900">
                  <button
                    type="button"
                    onClick={() => setEditing(t)}
                    className="rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(t)}
                    disabled={togglingId === t._id}
                    className="rounded-full border border-brand-200 px-4 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-50 disabled:opacity-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
                  >
                    {togglingId === t._id
                      ? "Updating…"
                      : t.isActive
                        ? "Set Closed"
                        : "Set Active"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(t)}
                    className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/tuitions/${t._id}`}
                    className="ml-auto self-center text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
                  >
                    View public page →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <EditTuitionModal
          tuition={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setTuitions((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
            setEditing(null);
          }}
        />
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Delete this tuition?"
        message={`"${toDelete?.title ?? ""}" will be permanently removed, along with its applications. This can't be undone.`}
        confirmLabel="Yes, Delete It"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        busy={deleting}
      />
    </div>
  );
}

export default function MyTuitionsPage() {
  return (
    <ProtectedRoute roles={["tutor"]}>
      <MyTuitionsContent />
    </ProtectedRoute>
  );
}

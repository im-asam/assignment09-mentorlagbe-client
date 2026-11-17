"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { applyForTuition, getTuition, type Tuition } from "@/lib/api";
import { fallbackBanner, formatFee, formatDate } from "@/lib/constants";
import { useSession, type Role } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900";

export default function TuitionDetailsContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showApply, setShowApply] = useState(false);
  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [applying, setApplying] = useState(false);

  const role = (session?.user as { role?: Role } | undefined)?.role;
  const isStudent = role === "student";

  useEffect(() => {
    let alive = true;
    getTuition(id)
      .then((t) => {
        if (alive) setTuition(t);
      })
      .catch((err: Error & { status?: number }) => {
        if (alive && err.status === 404) setNotFound(true);
        if (alive && err.status !== 404) toast.error(err.message || "Could not load this tuition.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!schedule.trim()) {
      toast.error("Please tell the tutor your preferred schedule.");
      return;
    }
    setApplying(true);
    try {
      await applyForTuition({
        tuitionId: id,
        studentPhone: phone.trim(),
        preferredSchedule: schedule.trim(),
        studentNote: note.trim(),
      });
      toast.success("Application sent! The tutor will review it soon.");
      setShowApply(false);
      router.push("/dashboard/student/my-applications");
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 409) {
        toast.error("You've already applied to this tuition.");
      } else {
        toast.error(err instanceof Error ? err.message : "Application failed. Please try again.");
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading tuition…" />
      </div>
    );
  }

  if (notFound || !tuition) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-950 dark:text-white">
          Tuition not found
        </h1>
        <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
          This listing may have been removed or is no longer available.
        </p>
        <Link
          href="/tuitions"
          className="mt-6 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Browse Tuitions
        </Link>
      </div>
    );
  }

  const banner = tuition.bannerImage || fallbackBanner(tuition._id);

  return (
    <div className="pb-8">
      <Link href="/tuitions" className="inline-block pt-2 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
        ← Back to all tuitions
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-sm dark:border-brand-900 dark:bg-[#1c1a18]">
            <div className="relative aspect-[16/8] w-full bg-brand-50 dark:bg-brand-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={banner} alt={tuition.title} className="h-full w-full object-cover" />
              <span
                className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-xs font-bold text-white shadow ${
                  tuition.mode === "Online" ? "bg-brand-600" : "bg-accent-600"
                }`}
              >
                {tuition.mode}
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-brand-50 px-3 py-1.5 text-brand-700 dark:bg-brand-900/70 dark:text-brand-300">
                  {tuition.subject}
                </span>
                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                  {tuition.classLevel}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600 dark:bg-brand-900 dark:text-slate-300">
                  Posted {formatDate(tuition.createdAt)}
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-brand-950 dark:text-white">
                {tuition.title}
              </h1>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Monthly Fee", value: formatFee(tuition.monthlyFee) },
                  { label: "Schedule", value: `${tuition.daysPerWeek} days / week` },
                  { label: "Mode", value: tuition.mode },
                  { label: "Location", value: tuition.location },
                ].map((f) => (
                  <div key={f.label} className="rounded-2xl bg-brand-50/70 px-4 py-3 dark:bg-brand-900/40">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{f.label}</p>
                    <p className="mt-1 truncate text-sm font-bold text-brand-950 dark:text-white" title={f.value}>
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>

              <h2 className="mt-8 font-display text-lg font-bold text-brand-950 dark:text-white">
                About this tuition
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {tuition.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar: tutor + apply */}
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-sm dark:border-brand-900 dark:bg-[#1c1a18]">
            <h2 className="font-display text-lg font-bold text-brand-950 dark:text-white">Your Tutor</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                {tuition.tutorName?.slice(0, 1)?.toUpperCase() ?? "T"}
              </span>
              <div>
                <p className="font-bold text-brand-950 dark:text-white">{tuition.tutorName}</p>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">{tuition.tutorEmail}</p>
              </div>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-5 dark:border-brand-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Monthly fee</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-brand-950 dark:text-white">
                {formatFee(tuition.monthlyFee)}
                <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">/month</span>
              </p>
            </div>

            {/* Apply CTA — role aware */}
            <div className="mt-6">
              {sessionPending ? (
                <span className="block h-12 animate-pulse rounded-full bg-slate-200 dark:bg-brand-900" />
              ) : !session?.user ? (
                <div className="rounded-2xl bg-brand-50 p-4 text-center dark:bg-brand-900/50">
                  <p className="text-sm font-medium text-brand-900 dark:text-brand-100">
                    Sign in as a student to apply for this tuition.
                  </p>
                  <Link
                    href={`/sign-in?next=${encodeURIComponent(`/tuitions/${id}`)}`}
                    className="mt-3 block rounded-full bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
                  >
                    Sign In to Apply
                  </Link>
                </div>
              ) : isStudent ? (
                <button
                  type="button"
                  onClick={() => setShowApply(true)}
                  className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-700"
                >
                  Apply Now
                </button>
              ) : (
                <div className="rounded-2xl bg-amber-50 p-4 text-center dark:bg-amber-950/30">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Only students can apply for tuitions.
                  </p>
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    You&apos;re signed in as a {role}. Tutors manage applicants from
                    their dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Apply modal */}
      {showApply && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/60 p-4 backdrop-blur-sm"
          onClick={() => !applying && setShowApply(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Apply for tuition"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8 dark:bg-[#1c1a18]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-bold text-brand-950 dark:text-white">
              Apply for this tuition
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {tuition.title} — {formatFee(tuition.monthlyFee)}/month
            </p>
            <form onSubmit={handleApply} className="mt-5 space-y-4" noValidate>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
                  Your Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01700-000000"
                  autoComplete="tel"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="schedule" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
                  Preferred Schedule *
                </label>
                <input
                  id="schedule"
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="e.g. Sat, Mon, Wed — 5pm to 6pm"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="note" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
                  Learning Note (optional)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Tell the tutor about your goals, weak areas, or anything else…"
                  className={`${inputCls} resize-none !rounded-2xl`}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowApply(false)}
                  disabled={applying}
                  className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-brand-800 dark:text-slate-200 dark:hover:bg-brand-900/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 rounded-full bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
                >
                  {applying ? "Sending…" : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

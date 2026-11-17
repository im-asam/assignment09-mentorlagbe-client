"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createTuition, getMyTuitions } from "@/lib/api";
import { useSession, type Plan } from "@/lib/auth-client";
import { CLASS_LEVELS, MODES, SUBJECTS } from "@/lib/constants";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageUpload from "@/components/ImageUpload";

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900";

function PostTuitionContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const plan = ((session?.user as { plan?: Plan } | undefined)?.plan ?? "free") as Plan;

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [classLevel, setClassLevel] = useState<string>(CLASS_LEVELS[0]);
  const [mode, setMode] = useState<"Online" | "Offline">("Online");
  const [location, setLocation] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("3");
  const [bannerImage, setBannerImage] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postedCount, setPostedCount] = useState<number | null>(null);

  useEffect(() => {
    getMyTuitions()
      .then((t) => setPostedCount(t.length))
      .catch(() => setPostedCount(null));
  }, []);

  const freeLimitReached = plan === "free" && postedCount !== null && postedCount >= 2;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Please enter a title for your tuition.");
    if (!location.trim()) return toast.error("Please enter a location (or 'Online').");
    const fee = Number(monthlyFee);
    if (!monthlyFee || Number.isNaN(fee) || fee <= 0) {
      return toast.error("Please enter a valid monthly fee.");
    }
    const days = Number(daysPerWeek);
    if (!daysPerWeek || Number.isNaN(days) || days < 1 || days > 7) {
      return toast.error("Days per week must be between 1 and 7.");
    }
    if (description.trim().length < 20) {
      return toast.error("Please write a description of at least 20 characters.");
    }

    setSubmitting(true);
    try {
      await createTuition({
        title: title.trim(),
        subject,
        classLevel,
        mode,
        location: location.trim(),
        monthlyFee: fee,
        daysPerWeek: days,
        bannerImage: bannerImage.trim(),
        description: description.trim(),
      });
      toast.success("Tuition posted! It's pending admin approval.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err) {
      // The server returns 403 with a clear message when the free-plan
      // 2-post limit is hit — show it exactly as-is.
      toast.error(err instanceof Error ? err.message : "Couldn't post this tuition.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        Post a Tuition
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Your listing goes live after admin approval. Be specific — students
        choose tutors who sound prepared.
      </p>

      {plan === "free" && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          {postedCount === null
            ? "Free plan: up to 2 tuition posts. Upgrade to Pro for unlimited posts."
            : freeLimitReached
              ? "You've used both of your free tuition posts (2/2). Upgrade to Pro to post more."
              : `Free plan: ${postedCount}/2 tuition posts used. Upgrade to Pro for unlimited posts.`}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-sm sm:p-8 dark:border-brand-900 dark:bg-[#1b1a35]"
        noValidate
      >
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. HSC Physics — Complete Batch with Weekly Tests"
            className={inputCls}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Subject *
            </label>
            <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls}>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="classLevel" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Class Level *
            </label>
            <select id="classLevel" value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className={inputCls}>
              {CLASS_LEVELS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">Mode *</span>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Mode">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className={`rounded-2xl border-2 px-4 py-3 text-sm font-bold transition ${
                    mode === m
                      ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300"
                      : "border-slate-200 text-slate-600 hover:border-brand-200 dark:border-brand-800 dark:text-slate-300"
                  }`}
                >
                  {m === "Online" ? "💻 Online" : "🏠 Offline"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="location" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Location *
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={mode === "Online" ? "Online (Zoom / Google Meet)" : "e.g. Chattogram, GEC Circle"}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="monthlyFee" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Monthly Fee (৳) *
            </label>
            <input
              id="monthlyFee"
              type="number"
              min="1"
              inputMode="numeric"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              placeholder="e.g. 3000"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="daysPerWeek" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Days per Week *
            </label>
            <input
              id="daysPerWeek"
              type="number"
              min="1"
              max="7"
              inputMode="numeric"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <ImageUpload
          value={bannerImage}
          onChange={setBannerImage}
          label="Banner Image"
          hint="A clear banner gets more applications. Upload a JPG/PNG or paste an image URL."
        />

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="What will students learn? Your experience, teaching style, batch size, materials, exam prep…"
            className={`${inputCls} resize-none`}
          />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            At least 20 characters — {description.trim().length} written.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || freeLimitReached}
          className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Posting…" : freeLimitReached ? "Free Limit Reached — Upgrade to Post More" : "Post Tuition"}
        </button>
      </form>
    </div>
  );
}

export default function PostTuitionPage() {
  return (
    <ProtectedRoute roles={["tutor"]}>
      <PostTuitionContent />
    </ProtectedRoute>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { signUp, type Role } from "@/lib/auth-client";

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setSubmitting(true);
    const { error } = await signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    } as Parameters<typeof signUp.email>[0]);
    setSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Sign-up failed. Please try again.");
      return;
    }

    toast.success(`Welcome to MentorLagbe, ${name.trim().split(" ")[0]}!`);
    router.push(role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center py-10">
      <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-lg dark:border-brand-900 dark:bg-[#1c1a18]">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Join as a student to find tutors, or as a tutor to post your batches.
          Your plan starts Free.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Asam Uddin"
              autoComplete="name"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-brand-950 dark:text-white">
              I am joining as a…
            </span>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Role">
              {(["student", "tutor"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={role === r}
                  onClick={() => setRole(r)}
                  className={`rounded-2xl border-2 px-4 py-3.5 text-left transition ${
                    role === r
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-900/60"
                      : "border-slate-200 hover:border-brand-200 dark:border-brand-800"
                  }`}
                >
                  <span className="block text-base font-bold capitalize text-brand-950 dark:text-white">
                    {r === "student" ? "🎓 Student" : "👩‍🏫 Tutor"}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {r === "student"
                      ? "Find tutors & apply to batches"
                      : "Post tuitions & manage applicants"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

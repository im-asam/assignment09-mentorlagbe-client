"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, useSession, type Role } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900";

const ROLE_HOME: Record<Role, string> = {
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
  admin: "/dashboard/admin",
};

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await signIn.email({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Sign-in failed. Please try again.");
      return;
    }

    toast.success("Welcome back!");
    const next = searchParams.get("next");
    const role = (data?.user as { role?: Role } | undefined)?.role
      ?? (session?.user as { role?: Role } | undefined)?.role
      ?? "student";
    router.push(next && next.startsWith("/") ? next : ROLE_HOME[role]);
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center py-10">
      <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-lg dark:border-brand-900 dark:bg-[#1c1a18]">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sign in to your MentorLagbe account to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          New to MentorLagbe?{" "}
          <Link href="/sign-up" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<Spinner label="Loading sign-in…" />}>
      <SignInForm />
    </Suspense>
  );
}

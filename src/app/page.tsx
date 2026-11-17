"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getTuitions, type Tuition } from "@/lib/api";
import TuitionCard from "@/components/TuitionCard";
import Spinner from "@/components/Spinner";

const TOP_SUBJECTS = [
  { name: "Mathematics", icon: "∑", blurb: "SSC, HSC & admission math" },
  { name: "Physics", icon: "⚛", blurb: "Concepts, not just formulas" },
  { name: "Programming", icon: "</>", blurb: "Python, JS & web dev" },
  { name: "IELTS", icon: "✦", blurb: "Band 7+ speaking & writing" },
  { name: "English", icon: "Aa", blurb: "Grammar to fluency" },
  { name: "Chemistry", icon: "⚗", blurb: "Organic to physical" },
];

const TESTIMONIALS = [
  {
    quote:
      "I found an HSC physics tutor in one evening. Two months later my mock scores jumped from 52 to 81.",
    name: "Rahim Uddin",
    role: "HSC Student, Chattogram",
  },
  {
    quote:
      "As a tutor, MentorLagbe gave me a real pipeline — applications come in with schedules attached. No more random DMs.",
    name: "Nusrat Jahan",
    role: "Math Tutor, Dhaka",
  },
  {
    quote:
      "The IELTS batch I joined was small, focused, and honest about the fee. I hit Band 7.5 on my first attempt.",
    name: "Tanvir Ahmed",
    role: "IELTS Candidate, Sylhet",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Search & compare",
    text: "Filter approved tuitions by subject, class level, and mode — online or offline — with clear monthly fees up front.",
  },
  {
    n: "02",
    title: "Apply in a minute",
    text: "Send your phone number, preferred schedule, and a short note. No awkward calls before you're ready.",
  },
  {
    n: "03",
    title: "Tutor responds",
    text: "The tutor accepts or declines from their dashboard. You track every application in one place.",
  },
  {
    n: "04",
    title: "Start learning",
    text: "Join your batch or 1-on-1 session and keep learning with a mentor who actually fits your goals.",
  },
];

export default function HomePage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getTuitions({ limit: 6 })
      .then((page) => {
        if (alive) setTuitions(page.tuitions ?? []);
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
    <div className="space-y-20 pb-4">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-700 via-brand-600 to-violet-600 px-6 py-14 text-white shadow-xl shadow-brand-600/20 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
            >
              <span className="h-2 w-2 rounded-full bg-accent-400" />
              Smart Tuition &amp; Mentorship Platform
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]"
            >
              Find Your Ideal Tutor or Mentorship Batch Today
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-brand-100 sm:text-lg"
            >
              Verified tutors, transparent monthly fees, and batches for every
              class level — from SSC and HSC to IELTS and programming. Learn
              online or at home, on your schedule.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/tuitions"
                className="rounded-full bg-accent-400 px-7 py-3.5 text-sm font-bold text-brand-950 shadow-lg shadow-accent-500/30 transition hover:bg-accent-300"
              >
                Browse Tuitions →
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Become a Tutor
              </Link>
            </motion.div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm">
              <div>
                <p className="font-display text-2xl font-extrabold">500+</p>
                <p className="text-brand-200">Verified tutors</p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold">2,400+</p>
                <p className="text-brand-200">Students learning</p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold">4.9/5</p>
                <p className="text-brand-200">Average rating</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
              alt="Students learning together with a mentor"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl ring-1 ring-white/30"
            />
            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-5 py-4 text-brand-950 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">This week</p>
              <p className="mt-1 font-display text-lg font-bold">120+ new batches posted</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- Featured tuitions ---------- */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Fresh &amp; approved</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-950 dark:text-white">
              Featured Tuitions
            </h2>
            <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
              The latest admin-approved batches and 1-on-1 mentorships — every
              listing shows its real fee, schedule, and tutor.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
          >
            View all tuitions →
          </Link>
        </div>

        {loading ? (
          <Spinner label="Loading featured tuitions…" />
        ) : failed ? (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900 dark:bg-amber-950/30">
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              Tuitions couldn&apos;t be loaded right now.
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              Please refresh the page in a moment — the listings will be back shortly.
            </p>
          </div>
        ) : tuitions.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-brand-200 p-12 text-center dark:border-brand-800">
            <p className="font-display text-lg font-bold text-brand-950 dark:text-white">
              No approved tuitions yet
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Tutors are posting new batches every day — check back soon, or be
              the first to post one.
            </p>
            <Link
              href="/dashboard/tutor/post-tuition"
              className="mt-5 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700"
            >
              Post a Tuition
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="h-full"
              >
                <TuitionCard tuition={t} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Pricing teaser ---------- */}
      <section className="rounded-[2.5rem] border border-brand-100 bg-white p-8 shadow-sm sm:p-12 dark:border-brand-900 dark:bg-[#1b1a35]">
        <div className="grid items-center gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Go Pro</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-950 dark:text-white">
              Free to start. Pro when you&apos;re ready to grow.
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-slate-600 dark:text-slate-400">
              Free tutors post up to 2 tuitions. Pro tutors post unlimited
              batches with a verified badge — and Pro students get priority
              booking with top mentors. One simple upgrade, no hidden fees.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="rounded-2xl bg-brand-50 px-5 py-4 dark:bg-brand-900/60">
                <p className="text-sm font-semibold text-brand-950 dark:text-white">Tutor Pro</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-brand-700 dark:text-brand-300">
                  $15 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ month</span>
                </p>
              </div>
              <div className="rounded-2xl bg-violet-50 px-5 py-4 dark:bg-violet-950">
                <p className="text-sm font-semibold text-brand-950 dark:text-white">Student Pro</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-violet-700 dark:text-violet-300">
                  $10 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ month</span>
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-violet-600 p-8 text-white shadow-lg shadow-brand-600/25">
              <h3 className="font-display text-xl font-bold">Why go Pro?</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-brand-100">
                <li>✓ Unlimited tuition posts for tutors</li>
                <li>✓ Verified badge on your profile &amp; listings</li>
                <li>✓ Priority booking for students</li>
                <li>✓ Higher visibility in search results</li>
              </ul>
              <Link
                href="/pricing"
                className="mt-6 block rounded-full bg-white py-3 text-center text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                Compare Plans &amp; Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="scroll-mt-24">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Simple by design</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-950 dark:text-white">
            How MentorLagbe Works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-400">
            From searching to your first session — four steps, no confusion.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm dark:border-brand-900 dark:bg-[#1b1a35]"
            >
              <span className="font-display text-4xl font-extrabold text-brand-200 dark:text-brand-800">{step.n}</span>
              <h3 className="mt-3 font-display text-lg font-bold text-brand-950 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Top subjects ---------- */}
      <section>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Popular right now</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-950 dark:text-white">
            Top Subjects
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_SUBJECTS.map((s) => (
            <Link
              key={s.name}
              href={`/tuitions?subject=${encodeURIComponent(s.name)}`}
              className="group flex items-center gap-4 rounded-3xl border border-brand-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-brand-900 dark:bg-[#1b1a35]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 font-display text-lg font-extrabold text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/70 dark:text-brand-300">
                {s.icon}
              </span>
              <span>
                <span className="block font-display font-bold text-brand-950 dark:text-white">{s.name}</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">{s.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Real stories</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-950 dark:text-white">
            Students &amp; Tutors Love MentorLagbe
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-brand-100 bg-white p-6 shadow-sm dark:border-brand-900 dark:bg-[#1b1a35]"
            >
              <span className="text-accent-500" aria-label="5 out of 5 stars">★★★★★</span>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-brand-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-bold text-white">
                  {t.name.slice(0, 1)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-brand-950 dark:text-white">{t.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- CTA band ---------- */}
      <section className="rounded-[2.5rem] bg-brand-950 px-8 py-12 text-center text-white sm:px-12">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Your next mentor is one search away.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-brand-200">
          Join free today — browse approved tuitions, apply in a minute, and
          start learning with a tutor who fits.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/tuitions"
            className="rounded-full bg-accent-400 px-7 py-3 text-sm font-bold text-brand-950 transition hover:bg-accent-300"
          >
            Find a Tutor
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full border border-white/40 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

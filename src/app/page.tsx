"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Check,
  Code,
  FlaskConical,
  Languages,
  Sigma,
  Star,
  type LucideIcon,
} from "lucide-react";
import { getTuitions, type Tuition } from "@/lib/api";
import TuitionCard from "@/components/TuitionCard";
import Spinner from "@/components/Spinner";

const TOP_SUBJECTS: { name: string; icon: LucideIcon; blurb: string }[] = [
  { name: "Mathematics", icon: Sigma, blurb: "SSC, HSC & admission math" },
  { name: "Physics", icon: Atom, blurb: "Concepts, not just formulas" },
  { name: "Programming", icon: Code, blurb: "Python, JS & web dev" },
  { name: "IELTS", icon: Languages, blurb: "Band 7+ speaking & writing" },
  { name: "English", icon: BookOpen, blurb: "Grammar to fluency" },
  { name: "Chemistry", icon: FlaskConical, blurb: "Organic to physical" },
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

/** Demo platform counters (spec Home §5: platform statistics). */
const HERO_STATS = [
  { value: "500+", label: "Verified tutors" },
  { value: "2,400+", label: "Students learning" },
  { value: "4.9/5", label: "Average rating" },
];

/** Demo feedback cards (spec Home §5: testimonials). */
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

const PRO_POINTS = [
  "Unlimited tuition posts for tutors",
  "Verified badge on your profile & listings",
  "Priority booking for students",
  "Higher visibility in search results",
];

/** The signature detail: a hand-drawn underline, used here and nowhere else. */
function Underlined({ children }: { children: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        className="absolute -bottom-1 left-0 h-[0.18em] w-full text-accent-ink"
        viewBox="0 0 120 8"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 6 C 22 2.5, 42 7, 62 4.5 S 100 3, 118 5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

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
    <div className="space-y-20 pb-4 sm:space-y-24">
      {/* ---------- Hero ---------- */}
      <section className="grid items-center gap-12 py-8 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div className="animate-rise">
          <h1 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl">
            Find your ideal <Underlined>tutor</Underlined> or mentorship batch
            today
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary">
            Approved tuitions with transparent monthly fees, for every class
            level — from SSC and HSC to IELTS and programming. Learn online or
            at home, on your schedule.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/tuitions"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-on-accent transition-colors ease-out-expo hover:bg-accent-hover"
            >
              Browse tuitions
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center rounded-lg border border-line-strong bg-card px-5 text-sm font-medium text-ink transition-colors ease-out-expo hover:bg-raised"
            >
              Become a tutor
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-8 border-t border-line pt-6">
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-medium tabular-nums text-ink">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
            alt="Students learning together with a mentor"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-line"
          />
        </div>
      </section>

      {/* ---------- Featured tuitions ---------- */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Fresh and approved</p>
            <h2 className="mt-2 text-3xl font-medium text-ink">
              Featured tuitions
            </h2>
            <p className="mt-2 max-w-xl text-secondary">
              The latest admin-approved batches and 1-on-1 mentorships — every
              listing shows its real fee, schedule, and tutor.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-card px-4 py-2.5 text-sm font-medium text-ink transition-colors ease-out-expo hover:bg-raised"
          >
            View all tuitions
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <Spinner label="Loading featured tuitions…" />
        ) : failed ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900 dark:bg-amber-950/30">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              Tuitions couldn&apos;t be loaded right now.
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              Please refresh the page in a moment — the listings will be back shortly.
            </p>
          </div>
        ) : tuitions.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-12 text-center">
            <p className="text-lg font-medium text-ink">
              No approved tuitions yet
            </p>
            <p className="mt-2 text-sm text-secondary">
              Tutors are posting new batches every day — check back soon, or be
              the first to post one.
            </p>
            <Link
              href="/dashboard/tutor/post-tuition"
              className="mt-5 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-colors ease-out-expo hover:bg-accent-hover"
            >
              Post a tuition
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((t) => (
              <TuitionCard key={t._id} tuition={t} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- Pricing teaser ---------- */}
      <section className="rounded-[1.25rem] border border-line bg-card p-8 sm:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="text-sm font-medium text-muted">Pro plans</p>
            <h2 className="mt-2 text-3xl font-medium text-ink">
              Free to start. Pro when you&apos;re ready to grow.
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-secondary">
              Free tutors post up to 2 tuitions. Pro tutors post unlimited
              batches with a verified badge — and Pro students get priority
              booking with top mentors. One simple upgrade, no hidden fees.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="rounded-2xl bg-raised px-5 py-4">
                <p className="text-sm font-medium text-ink">Tutor Pro</p>
                <p className="mt-1 text-2xl font-medium tabular-nums text-ink">
                  $15{" "}
                  <span className="text-sm font-normal text-muted">/ month</span>
                </p>
              </div>
              <div className="rounded-2xl bg-raised px-5 py-4">
                <p className="text-sm font-medium text-ink">Student Pro</p>
                <p className="mt-1 text-2xl font-medium tabular-nums text-ink">
                  $10{" "}
                  <span className="text-sm font-normal text-muted">/ month</span>
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-raised p-8">
              <h3 className="text-xl font-medium text-ink">Why go Pro?</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-secondary">
                {PRO_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      strokeWidth={1.5}
                      className="mt-0.5 shrink-0 text-accent-ink"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="mt-6 block rounded-lg bg-accent py-3 text-center text-sm font-medium text-on-accent transition-colors ease-out-expo hover:bg-accent-hover"
              >
                Compare plans &amp; subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="scroll-mt-24">
        <div className="text-center">
          <p className="text-sm font-medium text-muted">Simple by design</p>
          <h2 className="mt-2 text-3xl font-medium text-ink">
            How MentorLagbe works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-secondary">
            From searching to your first session — four steps, no confusion.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-line bg-card p-6 shadow-sm"
            >
              <span className="text-2xl font-medium tabular-nums text-muted">
                {step.n}
              </span>
              <h3 className="mt-3 text-lg font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Top subjects ---------- */}
      <section>
        <div className="text-center">
          <p className="text-sm font-medium text-muted">Popular right now</p>
          <h2 className="mt-2 text-3xl font-medium text-ink">
            Top subjects
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_SUBJECTS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.name}
                href={`/tuitions?subject=${encodeURIComponent(s.name)}`}
                className="flex items-center gap-4 rounded-2xl border border-line bg-card p-5 shadow-sm transition-colors ease-out-expo hover:border-line-strong"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-raised text-secondary">
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium text-ink">{s.name}</span>
                  <span className="block text-sm text-muted">{s.blurb}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section>
        <div className="text-center">
          <p className="text-sm font-medium text-muted">Real stories</p>
          <h2 className="mt-2 text-3xl font-medium text-ink">
            Students &amp; tutors love MentorLagbe
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-line bg-card p-6 shadow-sm"
            >
              <span
                className="flex gap-1 text-accent-ink"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    strokeWidth={1.5}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                ))}
              </span>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-secondary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-raised text-sm font-medium text-ink">
                  {t.name.slice(0, 1)}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {t.name}
                  </span>
                  <span className="block text-xs text-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- CTA band ---------- */}
      <section className="rounded-[1.25rem] bg-inverse px-8 py-12 text-center sm:px-12">
        <h2 className="text-3xl font-medium text-on-inverse">
          Your next mentor is one search away
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-on-inverse-muted">
          Join free today — browse approved tuitions, apply in a minute, and
          start learning with a tutor who fits.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/tuitions"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-colors ease-out-expo hover:bg-accent-hover"
          >
            Find a tutor
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg border border-white/25 px-6 py-3 text-sm font-medium text-on-inverse transition-colors ease-out-expo hover:bg-white/10"
          >
            Create free account
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import type { Tuition } from "@/lib/api";
import { fallbackBanner, formatFee } from "@/lib/constants";

/**
 * Equal-height tuition card used on the home page and Browse Tuitions.
 * Image is a fixed aspect ratio; the body flexes so all cards in a row
 * line up and the View Details button sits at the bottom.
 */
export default function TuitionCard({ tuition }: { tuition: Tuition }) {
  const banner = tuition.bannerImage || fallbackBanner(tuition._id);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-600/10 dark:border-brand-900 dark:bg-[#1b1a35]">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-50 dark:bg-brand-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner}
          alt={tuition.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow ${
            tuition.mode === "Online" ? "bg-brand-600" : "bg-accent-600"
          }`}
        >
          {tuition.mode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700 dark:bg-brand-900/70 dark:text-brand-300">
            {tuition.subject}
          </span>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            {tuition.classLevel}
          </span>
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-brand-950 dark:text-white">
          <Link href={`/tuitions/${tuition._id}`} className="transition hover:text-brand-600 dark:hover:text-brand-400">
            {tuition.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {tuition.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-400/20 text-xs font-bold text-accent-600">
            {tuition.tutorName?.slice(0, 1)?.toUpperCase() ?? "T"}
          </span>
          <span className="truncate font-medium">{tuition.tutorName}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="shrink-0">{tuition.daysPerWeek} days/week</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-brand-900">
          <div className="mt-0">
            <p className="text-lg font-extrabold text-brand-950 dark:text-white">
              {formatFee(tuition.monthlyFee)}
              <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">/month</span>
            </p>
          </div>
          <Link
            href={`/tuitions/${tuition._id}`}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

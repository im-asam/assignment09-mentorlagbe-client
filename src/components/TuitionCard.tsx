import Link from "next/link";
import type { Tuition } from "@/lib/api";
import { fallbackBanner, formatFee } from "@/lib/constants";

/**
 * Equal-height tuition card used on the home page and Browse Tuitions.
 * Image is a fixed aspect ratio; the body flexes so all cards in a row
 * line up and the View Details button sits at the bottom. The subject
 * photo carries the color; the chrome stays quiet.
 */
export default function TuitionCard({ tuition }: { tuition: Tuition }) {
  const banner = tuition.bannerImage || fallbackBanner(tuition._id);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-colors ease-out-expo hover:border-line-strong">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-raised">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner}
          alt={tuition.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
          {tuition.mode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="rounded-md bg-raised px-2 py-1 text-secondary">
            {tuition.subject}
          </span>
          <span className="rounded-md bg-raised px-2 py-1 text-secondary">
            {tuition.classLevel}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-medium leading-snug text-ink">
          <Link
            href={`/tuitions/${tuition._id}`}
            className="transition-colors ease-out-expo hover:text-accent-ink"
          >
            {tuition.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">
          {tuition.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-secondary">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-raised text-xs font-medium text-secondary">
            {tuition.tutorName?.slice(0, 1)?.toUpperCase() ?? "T"}
          </span>
          <span className="truncate font-medium">{tuition.tutorName}</span>
          <span className="text-muted">•</span>
          <span className="shrink-0">{tuition.daysPerWeek} days/week</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <p className="text-lg font-medium tabular-nums text-ink">
            {formatFee(tuition.monthlyFee)}
            <span className="ml-1 text-xs font-normal text-muted">/month</span>
          </p>
          <Link
            href={`/tuitions/${tuition._id}`}
            className="rounded-lg border border-line-strong bg-card px-4 py-2 text-sm font-medium text-ink transition-colors ease-out-expo hover:bg-raised"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

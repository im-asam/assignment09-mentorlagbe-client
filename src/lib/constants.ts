/** Shared option lists for tuition forms and filters. */

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Bangla",
  "ICT",
  "Programming",
  "IELTS",
  "Accounting",
  "Economics",
  "Higher Math",
] as const;

export const CLASS_LEVELS = [
  "Class 1-5",
  "Class 6-8",
  "SSC",
  "HSC",
  "Admission",
  "University",
  "IELTS Prep",
  "Job Prep",
] as const;

export const MODES = ["Online", "Offline"] as const;

/** Fallback banner images (Unsplash) used when a tuition has no banner. */
export const FALLBACK_BANNERS = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
];

export function fallbackBanner(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACK_BANNERS[hash % FALLBACK_BANNERS.length];
}

/** Format a monthly fee in BDT with thousands separators. */
export function formatFee(fee: number): string {
  return `৳${Number(fee || 0).toLocaleString("en-US")}`;
}

export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

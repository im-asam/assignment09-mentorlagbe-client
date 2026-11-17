"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getTuitions, type Tuition } from "@/lib/api";
import { CLASS_LEVELS, MODES, SUBJECTS } from "@/lib/constants";
import TuitionCard from "@/components/TuitionCard";
import Spinner from "@/components/Spinner";

const PAGE_SIZE = 9;

const selectCls =
  "w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900";

function BrowseContent() {
  const searchParams = useSearchParams();
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [subject, setSubject] = useState(searchParams.get("subject") ?? "");
  const [classLevel, setClassLevel] = useState("");
  const [mode, setMode] = useState("");

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      setFailed(false);
      try {
        const data = await getTuitions({
          search: search || undefined,
          subject: subject || undefined,
          classLevel: classLevel || undefined,
          mode: mode || undefined,
          page: p,
          limit: PAGE_SIZE,
        });
        setTuitions(data.tuitions ?? []);
        setTotal(data.total ?? data.tuitions?.length ?? 0);
        setPage(data.page ?? p);
        setTotalPages(data.totalPages ?? 1);
      } catch {
        setFailed(true);
        setTuitions([]);
      } finally {
        setLoading(false);
      }
    },
    [search, subject, classLevel, mode],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  // Debounce the search input so we don't hammer the server per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setSubject("");
    setClassLevel("");
    setMode("");
  };

  const hasFilters = Boolean(search || subject || classLevel || mode);

  return (
    <div className="pb-8">
      <div className="pt-4 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl dark:text-white">
          Browse Tuitions
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-400">
          Every listing below is admin-approved and active. Search by title or
          subject, then filter by class level and mode.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mt-8 rounded-3xl border border-brand-100 bg-white p-5 shadow-sm dark:border-brand-900 dark:bg-[#1b1a35]">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or subject…"
            aria-label="Search tuitions"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-white dark:focus:ring-brand-900"
          />
          <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Filter by subject" className={selectCls}>
            <option value="">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} aria-label="Filter by class level" className={selectCls}>
            <option value="">All Class Levels</option>
            {CLASS_LEVELS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={mode} onChange={(e) => setMode(e.target.value)} aria-label="Filter by mode" className={selectCls}>
            <option value="">Online &amp; Offline</option>
            {MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="mt-3 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      {!loading && !failed && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          {total} tuition{total === 1 ? "" : "s"} found
          {totalPages > 1 && ` — page ${page} of ${totalPages}`}
        </p>
      )}

      {loading ? (
        <Spinner label="Loading tuitions…" />
      ) : failed ? (
        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Tuitions couldn&apos;t be loaded right now.
          </p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
            Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => load(1)}
            className="mt-4 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      ) : tuitions.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-brand-200 p-12 text-center dark:border-brand-800">
          <p className="font-display text-lg font-bold text-brand-950 dark:text-white">
            No tuitions match your search
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Try a different keyword or clear the filters to see everything.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((t) => (
              <TuitionCard key={t._id} tuition={t} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
              >
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => {
                  const gap = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <span key={p} className="flex items-center gap-2">
                      {gap && <span className="text-slate-400">…</span>}
                      <button
                        type="button"
                        onClick={() => load(p)}
                        aria-current={p === page ? "page" : undefined}
                        className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                          p === page
                            ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                            : "border border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => load(page + 1)}
                className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default function TuitionsPage() {
  return (
    <Suspense fallback={<Spinner label="Loading tuitions…" />}>
      <BrowseContent />
    </Suspense>
  );
}

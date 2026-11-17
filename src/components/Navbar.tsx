"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut, type Role } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How It Works" },
];

const ROLE_HOME: Record<Role, string> = {
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
  admin: "/dashboard/admin",
};

const ROLE_LABEL: Record<Role, string> = {
  student: "Student",
  tutor: "Tutor",
  admin: "Admin",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const user = session?.user as
    | { name: string; email: string; image?: string | null; role?: Role }
    | undefined;
  const role: Role = user?.role ?? "student";

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    toast.success("Signed out. See you soon!");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur dark:border-brand-900 dark:bg-[#14132a]/90">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-md shadow-brand-600/25">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M12 3 1.5 8.25 12 13.5l10.5-5.25L12 3Zm-6.75 9.6v4.35c0 1.2 3.02 2.85 6.75 2.85s6.75-1.65 6.75-2.85V12.6L12 15.75 5.25 12.6Z" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-brand-950 dark:text-white">
            Mentor<span className="text-brand-600 dark:text-brand-400">Lagbe</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-brand-950 dark:text-slate-300 dark:hover:bg-brand-900/40 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {isPending ? (
            <span className="hidden h-9 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-brand-900 sm:block" />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-brand-100 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-brand-300 dark:border-brand-800 dark:bg-brand-950"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {initials(user.name)}
                  </span>
                )}
                <span className="hidden text-left sm:block">
                  <span className="block max-w-32 truncate text-sm font-semibold leading-tight text-brand-950 dark:text-white">
                    {user.name}
                  </span>
                  <span className="block text-[11px] font-medium leading-tight text-brand-600 dark:text-brand-400">
                    {ROLE_LABEL[role]}
                  </span>
                </span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
                </svg>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-xl dark:border-brand-800 dark:bg-[#1b1a35]"
                  role="menu"
                >
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-brand-800">
                    <p className="truncate text-sm font-semibold text-brand-950 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    <span className="mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                      {ROLE_LABEL[role]}
                    </span>
                  </div>
                  <Link
                    href={ROLE_HOME[role]}
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-brand-900/50"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-brand-900/50"
                    role="menuitem"
                  >
                    Update Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/50"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-100 text-brand-950 lg:hidden dark:border-brand-800 dark:text-white"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <path d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-brand-100 bg-white px-4 py-3 lg:hidden dark:border-brand-900 dark:bg-[#14132a]" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-brand-900/50"
            >
              {link.label}
            </Link>
          ))}
          {!isPending && !user && (
            <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3 dark:border-brand-800">
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full border border-brand-200 px-4 py-2 text-center text-sm font-semibold text-brand-700 dark:border-brand-700 dark:text-brand-300"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

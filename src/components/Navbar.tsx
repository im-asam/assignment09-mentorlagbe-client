"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronDown, GraduationCap, Menu, X } from "lucide-react";
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
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-inverse text-on-inverse">
            <GraduationCap size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="text-xl font-medium text-ink">
            MentorLagbe
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ease-out-expo ${
                pathname === link.href
                  ? "bg-raised text-ink"
                  : "text-secondary hover:bg-raised hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {isPending ? (
            <span className="hidden h-9 w-24 rounded-lg bg-raised sm:block" />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-line bg-card py-1 pl-1 pr-3 transition-colors ease-out-expo hover:border-line-strong"
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-raised text-xs font-medium text-secondary">
                    {initials(user.name)}
                  </span>
                )}
                <span className="hidden text-left sm:block">
                  <span className="block max-w-32 truncate text-sm font-medium leading-tight text-ink">
                    {user.name}
                  </span>
                  <span className="block text-xs leading-tight text-muted">
                    {ROLE_LABEL[role]}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className="hidden text-muted sm:block"
                  aria-hidden="true"
                />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-card p-2 shadow-lg"
                  role="menu"
                >
                  <div className="border-b border-line px-3 py-2.5">
                    <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                    <p className="mt-1 text-xs text-muted">{ROLE_LABEL[role]}</p>
                  </div>
                  <Link
                    href={ROLE_HOME[role]}
                    onClick={() => setUserMenuOpen(false)}
                    className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors ease-out-expo hover:bg-raised hover:text-ink"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors ease-out-expo hover:bg-raised hover:text-ink"
                    role="menuitem"
                  >
                    Update Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors ease-out-expo hover:bg-red-50 dark:hover:bg-red-950/40"
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
                className="rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors ease-out-expo hover:bg-raised hover:text-ink"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors ease-out-expo hover:bg-accent-hover"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-ink transition-colors ease-out-expo hover:bg-raised lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={18} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-line bg-page px-4 py-3 lg:hidden" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-secondary transition-colors ease-out-expo hover:bg-raised hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          {!isPending && !user && (
            <div className="mt-2 flex gap-2 border-t border-line pt-3">
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg border border-line-strong bg-card px-4 py-2 text-center text-sm font-medium text-ink transition-colors ease-out-expo hover:bg-raised"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-on-accent transition-colors ease-out-expo hover:bg-accent-hover"
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

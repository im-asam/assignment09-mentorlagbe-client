"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut, useSession, type Role } from "@/lib/auth-client";
import ProtectedRoute from "@/components/ProtectedRoute";

type NavItem = { href: string; label: string; icon: string };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: "▦" },
    { href: "/dashboard/student/my-applications", label: "My Applications", icon: "✉" },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: "▦" },
    { href: "/dashboard/tutor/post-tuition", label: "Post a Tuition", icon: "＋" },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: "▤" },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: "👥" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: "▦" },
    { href: "/dashboard/admin/users", label: "Users", icon: "👤" },
    { href: "/dashboard/admin/tuitions", label: "Tuitions", icon: "▤" },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: "₿" },
  ],
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}

function DashboardShell({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user as
    | { name: string; email: string; image?: string | null; role?: Role; plan?: string }
    | undefined;
  const role: Role = user?.role ?? "student";
  const nav = NAV_BY_ROLE[role];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out. See you soon!");
    router.push("/");
    router.refresh();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Profile summary */}
      <div className="border-b border-brand-100 px-4 py-5 dark:border-brand-900">
        <div className="flex items-center gap-3">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-800" />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {initials(user?.name ?? "U")}
            </span>
          )}
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-brand-950 dark:text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              <span className="mt-1.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                {ROLE_LABEL[role]} · {(user?.plan ?? "free").toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="slim-scroll flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-brand-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-brand-900/50 dark:hover:text-white"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
          <li className="pt-3">
            <Link
              href="/dashboard/profile"
              onClick={() => setMobileOpen(false)}
              title={collapsed ? "Update Profile" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition ${
                pathname === "/dashboard/profile"
                  ? "bg-brand-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-brand-900/50 dark:hover:text-white"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <span className="text-base leading-none">⚙</span>
              {!collapsed && <span className="truncate">Update Profile</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-brand-100 px-3 py-4 dark:border-brand-900">
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-brand-900/50 dark:hover:text-white ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={collapsed ? "Back to Site" : undefined}
        >
          <span className="text-base leading-none">←</span>
          {!collapsed && <span>Back to Site</span>}
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className={`mt-1 flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40 ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <span className="text-base leading-none">↪</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex gap-6 pb-8">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-24 hidden h-[calc(100vh-7rem)] shrink-0 overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition-all duration-200 lg:block dark:border-brand-900 dark:bg-[#1c1a18] ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-hidden bg-white shadow-2xl dark:bg-[#1c1a18]">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Top bar */}
        <div className="mb-6 flex items-center gap-3 rounded-3xl border border-brand-100 bg-white px-4 py-3 shadow-sm dark:border-brand-900 dark:bg-[#1c1a18]">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-brand-100 text-brand-800 transition hover:bg-brand-50 lg:flex dark:border-brand-800 dark:text-brand-200 dark:hover:bg-brand-900/50"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "→" : "←"}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-100 text-brand-800 lg:hidden dark:border-brand-800 dark:text-brand-200"
            aria-label="Open dashboard menu"
          >
            ☰
          </button>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-brand-950 dark:text-white">
              {ROLE_LABEL[role]} Dashboard
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
            </p>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {user?.plan !== "pro" && (
              <Link
                href="/pricing"
                className="rounded-full bg-accent-400 px-4 py-2 text-xs font-bold text-brand-950 transition hover:bg-accent-300 sm:text-sm"
              >
                Upgrade to Pro
              </Link>
            )}
            <Link
              href="/tuitions"
              className="hidden rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 sm:block dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
            >
              Browse Tuitions
            </Link>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

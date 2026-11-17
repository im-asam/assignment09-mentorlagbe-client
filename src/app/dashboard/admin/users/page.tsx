"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminUsers, updateUserRole, type UserProfile } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import { formatDate } from "@/lib/constants";

const ROLE_STYLE: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  tutor: "bg-brand-50 text-brand-700 dark:bg-brand-900 dark:text-brand-300",
  student: "bg-slate-100 text-slate-700 dark:bg-brand-900 dark:text-slate-300",
};

function AdminUsersContent() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "tutor" | "admin">("all");

  const load = () => {
    setLoading(true);
    setFailed(false);
    getAdminUsers()
      .then(setUsers)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRoleChange = async (id: string, role: "student" | "tutor" | "admin") => {
    setUpdatingId(id);
    try {
      const updated = await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      toast.success(`Role updated to ${role}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update this role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const visible = roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        User Management
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {users.length} registered user{users.length === 1 ? "" : "s"} — change any role from here.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["all", "student", "tutor", "admin"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setRoleFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              roleFilter === f
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "border border-brand-200 text-brand-700 hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading users…" />
      ) : failed ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load users right now.
          </p>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-brand-200 p-12 text-center dark:border-brand-800">
          <p className="font-display text-lg font-bold text-brand-950 dark:text-white">No users found</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Try a different role filter.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-sm dark:border-brand-900 dark:bg-[#1b1a35]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50/60 text-xs uppercase tracking-wide text-slate-500 dark:border-brand-900 dark:bg-brand-900/40 dark:text-slate-400">
                  <th className="px-5 py-3.5 font-bold">User</th>
                  <th className="px-5 py-3.5 font-bold">Plan</th>
                  <th className="px-5 py-3.5 font-bold">Joined</th>
                  <th className="px-5 py-3.5 font-bold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-brand-900">
                {visible.map((u) => (
                  <tr key={u._id} className="transition hover:bg-brand-50/40 dark:hover:bg-brand-900/20">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.image} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                            {u.name?.slice(0, 1)?.toUpperCase() ?? "?"}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-brand-950 dark:text-white">{u.name}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                          u.plan === "pro"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600 dark:bg-brand-900 dark:text-slate-300"
                        }`}
                      >
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${ROLE_STYLE[u.role]}`}>
                          {u.role}
                        </span>
                        <select
                          value={u.role}
                          disabled={updatingId === u._id}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value as "student" | "tutor" | "admin")
                          }
                          aria-label={`Change role for ${u.name}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-950 outline-none transition focus:border-brand-500 disabled:opacity-50 dark:border-brand-800 dark:bg-brand-950 dark:text-white"
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminUsersContent />
    </ProtectedRoute>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getAdminTransactions, type Transaction } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import { formatDate } from "@/lib/constants";

function AdminTransactionsContent() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = () => {
    setLoading(true);
    setFailed(false);
    getAdminTransactions()
      .then(setTxns)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const totalRevenue = txns.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 dark:text-white">
        Transactions
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {txns.length} Pro payment{txns.length === 1 ? "" : "s"} · Total revenue{" "}
        <strong className="text-brand-950 dark:text-white">
          ${totalRevenue.toLocaleString("en-US")}
        </strong>
      </p>

      {loading ? (
        <Spinner label="Loading transactions…" />
      ) : failed ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Couldn&apos;t load transactions right now.
          </p>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      ) : txns.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-brand-200 p-12 text-center dark:border-brand-800">
          <p className="font-display text-lg font-bold text-brand-950 dark:text-white">
            No payments yet
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Stripe Pro subscriptions will appear here as soon as the first
            payment succeeds.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-sm dark:border-brand-900 dark:bg-[#1c1a18]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50/60 text-xs uppercase tracking-wide text-slate-500 dark:border-brand-900 dark:bg-brand-900/40 dark:text-slate-400">
                  <th className="px-5 py-3.5 font-bold">User</th>
                  <th className="px-5 py-3.5 font-bold">Role</th>
                  <th className="px-5 py-3.5 font-bold">Plan</th>
                  <th className="px-5 py-3.5 font-bold">Amount</th>
                  <th className="px-5 py-3.5 font-bold">Transaction ID</th>
                  <th className="px-5 py-3.5 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-brand-900">
                {txns.map((t) => (
                  <tr key={t._id} className="transition hover:bg-brand-50/40 dark:hover:bg-brand-900/20">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-brand-950 dark:text-white">{t.userName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.userEmail}</p>
                    </td>
                    <td className="px-5 py-4 capitalize text-slate-600 dark:text-slate-400">{t.userRole}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                        {t.planName}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-brand-950 dark:text-white">
                      ${Number(t.amount || 0).toLocaleString("en-US")}
                      <span className="ml-1 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                        {t.currency}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-600 dark:text-slate-400" title={t.transactionId}>
                        {t.transactionId?.length > 18
                          ? `${t.transactionId.slice(0, 18)}…`
                          : t.transactionId}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{formatDate(t.paidAt)}</td>
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

export default function AdminTransactionsPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminTransactionsContent />
    </ProtectedRoute>
  );
}

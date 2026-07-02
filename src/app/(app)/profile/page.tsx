"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBudgetData } from "@/lib/useBudgetData";
import LucideIcon from "@/components/LucideIcon";

export default function ProfilePage() {
  const { user, logOut } = useAuth();
  const { totalIncome, totalSpent, totalSavingsCurrent, totalSavingsTarget } = useBudgetData();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 pb-24 sm:px-5 sm:py-6">
      <section className="rounded-[28px] border border-border bg-surface p-5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold text-ink">{user?.email || "Your account"}</p>
            <p className="text-sm text-muted">Budgeting with calm consistency</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-bg p-3 text-center">
            <p className="text-xs text-muted">Income</p>
            <p className="mt-1 text-sm font-semibold text-ink">{totalIncome.toLocaleString()} MAD</p>
          </div>
          <div className="rounded-2xl bg-bg p-3 text-center">
            <p className="text-xs text-muted">Spent</p>
            <p className="mt-1 text-sm font-semibold text-ink">{totalSpent.toLocaleString()} MAD</p>
          </div>
          <div className="rounded-2xl bg-bg p-3 text-center">
            <p className="text-xs text-muted">Saved</p>
            <p className="mt-1 text-sm font-semibold text-ink">{totalSavingsCurrent.toLocaleString()} MAD</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Progress</p>
          <p className="text-sm text-muted">{totalSavingsCurrent.toLocaleString()} / {totalSavingsTarget.toLocaleString()} MAD</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-bg">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${Math.min(100, (totalSavingsCurrent / Math.max(1, totalSavingsTarget)) * 100)}%` }}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-surface p-5 shadow-card">
        <div className="space-y-3">
          <Link href="/dashboard" className="flex items-center justify-between rounded-2xl bg-bg px-3 py-3 text-sm font-medium text-ink">
            <span className="flex items-center gap-2"><LucideIcon name="sparkles" size={16} /> Dashboard</span>
            <span className="text-muted">→</span>
          </Link>
          <Link href="/history" className="flex items-center justify-between rounded-2xl bg-bg px-3 py-3 text-sm font-medium text-ink">
            <span className="flex items-center gap-2"><LucideIcon name="clock" size={16} /> History</span>
            <span className="text-muted">→</span>
          </Link>
          <button
            onClick={() => logOut()}
            className="flex w-full items-center justify-between rounded-2xl bg-bg px-3 py-3 text-left text-sm font-medium text-danger"
          >
            <span className="flex items-center gap-2"><LucideIcon name="alert" size={16} /> Sign out</span>
            <span>→</span>
          </button>
        </div>
      </section>
    </main>
  );
}

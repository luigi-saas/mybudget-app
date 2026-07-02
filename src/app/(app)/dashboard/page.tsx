"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBudgetData } from "@/lib/useBudgetData";
import { seedNotionTemplate } from "@/lib/firestore";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import CategoryCard from "@/components/CategoryCard";
import Icon from "@/components/Icon";
import MonthSwitcher from "@/components/MonthSwitcher";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    fixedCategories,
    variableCategories,
    spentByCategory,
    totalSpent,
    totalSavingsCurrent,
    totalSavingsTarget,
    totalSavedThisMonth,
    totalIncome,
    home,
    wallet,
    alerts,
    remaining,
    daysLeft,
    safeToSpendToday,
  } = useBudgetData();

  const [importing, setImporting] = useState(false);
  const topCategories = [...fixedCategories, ...variableCategories].slice(0, 4);

  async function handleImport() {
    if (!user) return;
    setImporting(true);
    try {
      await seedNotionTemplate(user.uid);
    } finally {
      setImporting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Overview</h1>
          <p className="mt-1 text-sm text-muted">Here&apos;s where this month stands.</p>
        </div>
        <MonthSwitcher />
      </div>

      {/* Budget alerts */}
      {alerts.length > 0 && (
        <div className="mt-5 space-y-2">
          {alerts.map((a) => (
            <div
              key={a.category.id}
              className="flex items-center gap-3 rounded-xl border border-warn/30 bg-warn-light px-4 py-3"
            >
              <Icon name="alert" size={18} className="shrink-0 text-warn" />
              <p className="text-sm text-ink">
                <span className="font-semibold">{a.category.name}</span> is at{" "}
                {Math.round(a.pct)}% of its {a.category.budget.toLocaleString()} MAD budget
                {a.pct >= 100 ? " — over budget." : "."}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Income vs spend */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Income this month" value={`${totalIncome.toLocaleString()} MAD`} icon="wallet" color="success" />
        <StatCard label="Spent so far" value={`${totalSpent.toLocaleString()} MAD`} icon="cart" color="warn" />
        <StatCard
          label="Remaining"
          value={`${remaining.toLocaleString()} MAD`}
          icon="bolt"
          color={remaining < 0 ? "danger" : "primary"}
        />
        <StatCard label="Saved this month" value={`${totalSavedThisMonth.toLocaleString()} MAD`} icon="piggy" color="violet" />
      </div>

      {/* Daily safe-to-spend, only meaningful for the current month */}
      {daysLeft > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Safe to spend, per day</p>
              <p className="mt-1 text-2xl font-bold text-ink">
                {Math.round(safeToSpendToday).toLocaleString()} MAD / day
              </p>
            </div>
            <p className="text-xs text-muted">{daysLeft} days left this month</p>
          </div>
        </div>
      )}

      {/* Home vs Wallet accounts */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary-dark">
              <Icon name="home" size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Home</p>
              <p className="text-xs text-muted">
                {home.income.toLocaleString()} in · {home.spent.toLocaleString()} out
              </p>
            </div>
          </div>
          <p className={`mt-3 text-2xl font-bold ${home.balance < 0 ? "text-danger" : "text-ink"}`}>
            {home.balance.toLocaleString()} MAD
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-light text-violet">
              <Icon name="bank" size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Wallet</p>
              <p className="text-xs text-muted">
                {wallet.income.toLocaleString()} in · {wallet.spent.toLocaleString()} out
              </p>
            </div>
          </div>
          <p className={`mt-3 text-2xl font-bold ${wallet.balance < 0 ? "text-danger" : "text-ink"}`}>
            {wallet.balance.toLocaleString()} MAD
          </p>
        </div>
      </div>

      {/* All-time savings progress + link to full history */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-5 shadow-card">
        <div>
          <p className="text-sm text-muted">All-time savings progress</p>
          <p className="mt-1 text-xl font-bold text-ink">
            {totalSavingsCurrent.toLocaleString()} / {totalSavingsTarget.toLocaleString()} MAD
          </p>
        </div>
        <Link href="/history" className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <Icon name="clock" size={16} /> View monthly history
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Your categories</h2>
        <Link href="/fixed" className="text-sm font-medium text-primary">
          See all
        </Link>
      </div>

      {topCategories.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            No categories yet. Import your original Notion budget in one
            click, or add categories manually from Fixed / Variable.
          </p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {importing ? "Importing…" : "Import Notion template"}
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {topCategories.map((c) => (
            <CategoryCard key={c.id} category={c} spent={spentByCategory[c.id] || 0} />
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import { useBudgetData } from "@/lib/useBudgetData";
import StatCard from "@/components/StatCard";
import CategoryCard from "@/components/CategoryCard";
import Link from "next/link";

export default function DashboardPage() {
  const {
    fixedCategories,
    variableCategories,
    spentByCategory,
    totalFixedBudget,
    totalVariableBudget,
    totalSpent,
    totalSavingsCurrent,
    totalSavingsTarget,
  } = useBudgetData();

  const totalBudget = totalFixedBudget + totalVariableBudget;
  const remaining = totalBudget - totalSpent;
  const topCategories = [...fixedCategories, ...variableCategories].slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-2xl font-bold text-ink">Overview</h1>
      <p className="mt-1 text-sm text-muted">Here&apos;s where your month stands.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Monthly budget" value={`${totalBudget.toLocaleString()} MAD`} icon="sparkles" color="primary" />
        <StatCard label="Spent so far" value={`${totalSpent.toLocaleString()} MAD`} icon="cart" color="warn" />
        <StatCard
          label="Remaining"
          value={`${remaining.toLocaleString()} MAD`}
          icon="bolt"
          color={remaining < 0 ? "danger" : "success"}
        />
        <StatCard
          label="Saved"
          value={`${totalSavingsCurrent.toLocaleString()} / ${totalSavingsTarget.toLocaleString()}`}
          icon="piggy"
          color="violet"
        />
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
            No categories yet. Head to Fixed or Variable to add your first one.
          </p>
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

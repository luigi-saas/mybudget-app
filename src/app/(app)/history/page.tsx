"use client";

import { useMemo, useState } from "react";
import { useBudgetData } from "@/lib/useBudgetData";
import { monthKeyFromDate, monthLabel } from "@/lib/month";
import LucideIcon from "@/components/LucideIcon";

export default function HistoryPage() {
  const { transactions, incomes, contributions, categories } = useBudgetData();
  const [expanded, setExpanded] = useState<string | null>(null);

  const months = useMemo(() => {
    const keys = new Set<string>();
    transactions.forEach((t) => keys.add(monthKeyFromDate(t.date)));
    incomes.forEach((i) => keys.add(monthKeyFromDate(i.date)));
    contributions.forEach((c) => keys.add(c.month));

    return Array.from(keys)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((key) => {
        const monthTx = transactions.filter((t) => monthKeyFromDate(t.date) === key);
        const monthIncome = incomes
          .filter((i) => monthKeyFromDate(i.date) === key)
          .reduce((s, i) => s + i.amount, 0);
        const monthExpenses = monthTx.reduce((s, t) => s + t.amount, 0);
        const monthSaved = contributions
          .filter((c) => c.month === key)
          .reduce((s, c) => s + c.amount, 0);

        const byCategory: Record<string, number> = {};
        monthTx.forEach((t) => {
          byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
        });

        return {
          key,
          income: monthIncome,
          expenses: monthExpenses,
          saved: monthSaved,
          net: monthIncome - monthExpenses - monthSaved,
          byCategory,
        };
      });
  }, [transactions, incomes, contributions]);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-2xl font-bold text-ink">Monthly history</h1>
      <p className="mt-1 text-sm text-muted">
        Every month you've tracked, side by side — income, expenses, and savings.
      </p>

      {months.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            Nothing tracked yet. Once you log income, expenses, or savings, each month shows up here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {months.map((m) => {
            const isOpen = expanded === m.key;
            const categoryRows = Object.entries(m.byCategory)
              .map(([categoryId, amount]) => ({
                category: categories.find((c) => c.id === categoryId),
                amount,
              }))
              .sort((a, b) => b.amount - a.amount);

            return (
              <div key={m.key} className="rounded-xl border border-border bg-surface shadow-card">
                <button
                  onClick={() => setExpanded(isOpen ? null : m.key)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-ink">{monthLabel(m.key)}</span>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-success">+{m.income.toLocaleString()} income</span>
                    <span className="text-warn">-{m.expenses.toLocaleString()} spent</span>
                    <span className="text-violet">{m.saved.toLocaleString()} saved</span>
                    <span className={`font-semibold ${m.net < 0 ? "text-danger" : "text-ink"}`}>
                      {m.net.toLocaleString()} net
                    </span>
                    <LucideIcon
                      name="clock"
                      size={16}
                      className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border px-5 py-4">
                    {categoryRows.length === 0 ? (
                      <p className="text-sm text-muted">No expenses logged this month.</p>
                    ) : (
                      <div className="space-y-2">
                        {categoryRows.map((row) => (
                          <div
                            key={row.category?.id || "uncategorized"}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="flex items-center gap-2 text-ink">
                              <LucideIcon name={row.category?.icon || "sparkles"} size={14} className="text-muted" />
                              {row.category?.name || "Uncategorized"}
                            </span>
                            <span className="font-medium text-ink">
                              {row.amount.toLocaleString()} MAD
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

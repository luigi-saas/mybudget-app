"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth-context";
import { useMonth } from "./month-context";
import { daysLeftInMonth, monthKeyFromDate } from "./month";
import {
  subscribeCategories,
  subscribeContributions,
  subscribeIncomes,
  subscribeSavings,
  subscribeTransactions,
} from "./firestore";
import type {
  Account,
  Category,
  Income,
  SavingsContribution,
  SavingsGoal,
  Transaction,
} from "./types";

export function useBudgetData() {
  const { user } = useAuth();
  const { month } = useMonth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [contributions, setContributions] = useState<SavingsContribution[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeCategories(user.uid, setCategories);
    const unsub2 = subscribeTransactions(user.uid, setTransactions);
    const unsub3 = subscribeSavings(user.uid, setSavings);
    const unsub4 = subscribeIncomes(user.uid, setIncomes);
    const unsub5 = subscribeContributions(user.uid, setContributions);
    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
    };
  }, [user]);

  // --- Scoped to the currently selected month ---
  const monthTransactions = useMemo(
    () => transactions.filter((t) => monthKeyFromDate(t.date) === month),
    [transactions, month]
  );
  const monthIncomes = useMemo(
    () => incomes.filter((i) => monthKeyFromDate(i.date) === month),
    [incomes, month]
  );
  const monthContributions = useMemo(
    () => contributions.filter((c) => c.month === month),
    [contributions, month]
  );

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of monthTransactions) {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    }
    return map;
  }, [monthTransactions]);

  const fixedCategories = useMemo(
    () => categories.filter((c) => c.group === "fixed"),
    [categories]
  );
  const variableCategories = useMemo(
    () => categories.filter((c) => c.group === "variable"),
    [categories]
  );

  const totalFixedBudget = fixedCategories.reduce((s, c) => s + c.budget, 0);
  const totalVariableBudget = variableCategories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = monthTransactions.reduce((s, t) => s + t.amount, 0);
  const totalIncome = monthIncomes.reduce((s, i) => s + i.amount, 0);
  const totalSavedThisMonth = monthContributions.reduce((s, c) => s + c.amount, 0);

  // All-time savings progress (goals persist across months)
  const totalSavingsCurrent = savings.reduce((s, g) => s + g.current, 0);
  const totalSavingsTarget = savings.reduce((s, g) => s + g.target, 0);

  // Home vs Wallet — mirrors the original "3100 HOME / 5400 WALLET" split,
  // scoped to the selected month.
  const byAccount = (account: Account) => {
    const income = monthIncomes
      .filter((i) => i.account === account)
      .reduce((s, i) => s + i.amount, 0);
    const spent = monthTransactions
      .filter((t) => t.account === account)
      .reduce((s, t) => s + t.amount, 0);
    return { income, spent, balance: income - spent };
  };
  const home = byAccount("home");
  const wallet = byAccount("wallet");

  // Budget alerts: categories at or over 90% of their budget, this month
  const alerts = useMemo(
    () =>
      categories
        .filter((c) => c.budget > 0)
        .map((c) => ({
          category: c,
          spent: spentByCategory[c.id] || 0,
          pct: ((spentByCategory[c.id] || 0) / c.budget) * 100,
        }))
        .filter((a) => a.pct >= 90),
    [categories, spentByCategory]
  );

  // "Safe to spend today" — remaining budget spread over the days left in
  // the selected month (0 for past months).
  const remaining = totalIncome - totalSpent;
  const daysLeft = daysLeftInMonth(month);
  const safeToSpendToday = daysLeft > 0 ? Math.max(0, remaining) / daysLeft : 0;

  return {
    // raw, unfiltered (used by the History page to group across all months)
    categories,
    transactions,
    savings,
    incomes,
    contributions,
    // scoped to the selected month
    monthTransactions,
    monthIncomes,
    monthContributions,
    spentByCategory,
    fixedCategories,
    variableCategories,
    totalFixedBudget,
    totalVariableBudget,
    totalSpent,
    totalIncome,
    totalSavedThisMonth,
    totalSavingsCurrent,
    totalSavingsTarget,
    home,
    wallet,
    alerts,
    remaining,
    daysLeft,
    safeToSpendToday,
  };
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth-context";
import {
  subscribeCategories,
  subscribeIncomes,
  subscribeSavings,
  subscribeTransactions,
} from "./firestore";
import type { Account, Category, Income, SavingsGoal, Transaction } from "./types";

export function useBudgetData() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeCategories(user.uid, setCategories);
    const unsub2 = subscribeTransactions(user.uid, setTransactions);
    const unsub3 = subscribeSavings(user.uid, setSavings);
    const unsub4 = subscribeIncomes(user.uid, setIncomes);
    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, [user]);

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of transactions) {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    }
    return map;
  }, [transactions]);

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
  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const totalSavingsCurrent = savings.reduce((s, g) => s + g.current, 0);
  const totalSavingsTarget = savings.reduce((s, g) => s + g.target, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);

  // Home vs Wallet — mirrors the original "3100 HOME / 5400 WALLET" split
  const byAccount = (account: Account) => {
    const income = incomes
      .filter((i) => i.account === account)
      .reduce((s, i) => s + i.amount, 0);
    const spent = transactions
      .filter((t) => t.account === account)
      .reduce((s, t) => s + t.amount, 0);
    return { income, spent, balance: income - spent };
  };
  const home = byAccount("home");
  const wallet = byAccount("wallet");

  // Budget alerts: categories at or over 90% of their budget
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

  return {
    categories,
    transactions,
    savings,
    incomes,
    spentByCategory,
    fixedCategories,
    variableCategories,
    totalFixedBudget,
    totalVariableBudget,
    totalSpent,
    totalSavingsCurrent,
    totalSavingsTarget,
    totalIncome,
    home,
    wallet,
    alerts,
  };
}

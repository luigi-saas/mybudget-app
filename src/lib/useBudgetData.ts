"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth-context";
import {
  subscribeCategories,
  subscribeSavings,
  subscribeTransactions,
} from "./firestore";
import type { Category, SavingsGoal, Transaction } from "./types";

export function useBudgetData() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeCategories(user.uid, setCategories);
    const unsub2 = subscribeTransactions(user.uid, setTransactions);
    const unsub3 = subscribeSavings(user.uid, setSavings);
    return () => {
      unsub1();
      unsub2();
      unsub3();
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

  return {
    categories,
    transactions,
    savings,
    spentByCategory,
    fixedCategories,
    variableCategories,
    totalFixedBudget,
    totalVariableBudget,
    totalSpent,
    totalSavingsCurrent,
    totalSavingsTarget,
  };
}

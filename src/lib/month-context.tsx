"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { currentMonthKey, shiftMonth } from "./month";

interface MonthContextValue {
  month: string; // "2026-06"
  setMonth: (m: string) => void;
  next: () => void;
  prev: () => void;
  isCurrent: boolean;
}

const MonthContext = createContext<MonthContextValue | undefined>(undefined);

const STORAGE_KEY = "budgetly:selected-month";

export function MonthProvider({ children }: { children: ReactNode }) {
  const [month, setMonthState] = useState(currentMonthKey());

  // Hydrate from localStorage after mount to avoid SSR/client mismatch.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMonthState(saved);
  }, []);

  function setMonth(m: string) {
    setMonthState(m);
    localStorage.setItem(STORAGE_KEY, m);
  }

  const value: MonthContextValue = {
    month,
    setMonth,
    next: () => setMonth(shiftMonth(month, 1)),
    prev: () => setMonth(shiftMonth(month, -1)),
    isCurrent: month === currentMonthKey(),
  };

  return <MonthContext.Provider value={value}>{children}</MonthContext.Provider>;
}

export function useMonth() {
  const ctx = useContext(MonthContext);
  if (!ctx) throw new Error("useMonth must be used within MonthProvider");
  return ctx;
}

"use client";

import { useMonth } from "@/lib/month-context";
import { monthLabel } from "@/lib/month";

export default function MonthSwitcher() {
  const { month, next, prev, isCurrent, setMonth } = useMonth();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
      <button
        onClick={prev}
        aria-label="Previous month"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-bg hover:text-ink"
      >
        ‹
      </button>
      <span className="min-w-[9rem] text-center text-sm font-semibold text-ink">
        {monthLabel(month)}
      </span>
      <button
        onClick={next}
        aria-label="Next month"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-bg hover:text-ink"
      >
        ›
      </button>
      {!isCurrent && (
        <button
          onClick={() => setMonth(new Date().toISOString().slice(0, 7))}
          className="ml-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary-light"
        >
          Today
        </button>
      )}
    </div>
  );
}

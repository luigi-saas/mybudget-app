"use client";

import LucideIcon from "./LucideIcon";
import ProgressBar from "./ProgressBar";
import type { SavingsContribution, SavingsGoal } from "@/lib/types";

export default function SavingsCard({
  goal,
  contributions,
  monthHasContribution,
  onAdd,
  onDeleteContribution,
  onDelete,
}: {
  goal: SavingsGoal;
  contributions: SavingsContribution[];
  monthHasContribution: boolean;
  onAdd: () => void;
  onDeleteContribution: (c: SavingsContribution) => void;
  onDelete: () => void;
}) {
  const pct = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
  const achieved = goal.current >= goal.target && goal.target > 0;

  return (
    <div className="rounded-xl bg-surface p-5 shadow-card border border-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full ${
              achieved ? "bg-success-light text-success" : "bg-primary-light text-primary-dark"
            }`}
          >
            <LucideIcon name="piggy" />
          </div>
          <div>
            <p className="font-semibold text-ink">{goal.name}</p>
            <p className="text-sm text-muted">{goal.source}</p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-xs text-muted hover:text-danger"
          aria-label={`Delete ${goal.name}`}
        >
          Delete
        </button>
      </div>

      <div className="mt-4">
        <ProgressBar value={pct} barClass={achieved ? "bg-success" : "bg-primary"} />
        <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
          <span>
            {goal.current.toLocaleString()} / {goal.target.toLocaleString()} MAD
          </span>
          <span className={achieved ? "font-medium text-success" : ""}>
            {achieved ? "Achieved ✓" : `${Math.round(pct)}%`}
          </span>
        </div>
      </div>

      <button
        onClick={onAdd}
        className={`mt-4 w-full rounded-lg py-2 text-sm font-semibold ${
          monthHasContribution
            ? "border border-border text-muted hover:bg-bg"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        {monthHasContribution ? "+ Add another this month" : "+ Add this month's saving"}
      </button>

      {contributions.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
          {contributions.slice(0, 4).map((c) => (
            <div key={c.id} className="flex items-center justify-between text-xs">
              <span className="text-muted">{c.month}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">+{c.amount.toLocaleString()} MAD</span>
                <button
                  onClick={() => onDeleteContribution(c)}
                  className="text-muted hover:text-danger"
                  aria-label="Delete contribution"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

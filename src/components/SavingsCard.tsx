"use client";

import Icon from "./Icon";
import ProgressBar from "./ProgressBar";
import type { SavingsGoal } from "@/lib/types";

export default function SavingsCard({
  goal,
  onToggleAchieved,
  onDelete,
}: {
  goal: SavingsGoal;
  onToggleAchieved: () => void;
  onDelete: () => void;
}) {
  const pct = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;

  return (
    <div className="rounded-xl bg-surface p-5 shadow-card border border-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full ${
              goal.achieved ? "bg-success-light text-success" : "bg-primary-light text-primary-dark"
            }`}
          >
            <Icon name="piggy" />
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
        <ProgressBar
          value={pct}
          barClass={goal.achieved ? "bg-success" : "bg-primary"}
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
          <span>
            {goal.current.toLocaleString()} / {goal.target.toLocaleString()} MAD
          </span>
          <button
            onClick={onToggleAchieved}
            className={`font-medium ${goal.achieved ? "text-success" : "text-primary"}`}
          >
            {goal.achieved ? "Achieved ✓" : "Mark achieved"}
          </button>
        </div>
      </div>
    </div>
  );
}

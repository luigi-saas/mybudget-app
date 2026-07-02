"use client";

import Icon from "./Icon";
import ProgressBar from "./ProgressBar";
import { colorTokens } from "@/lib/colors";
import type { Category } from "@/lib/types";

export default function CategoryCard({
  category,
  spent,
  onEdit,
  onDelete,
}: {
  category: Category;
  spent: number;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const tokens = colorTokens[category.color];
  const pct = category.budget > 0 ? (spent / category.budget) * 100 : 0;
  const over = spent > category.budget && category.budget > 0;

  return (
    <div className="rounded-xl bg-surface p-5 shadow-card border border-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-full ${tokens.bg} ${tokens.text}`}>
            <Icon name={category.icon} />
          </div>
          <div>
            <p className="font-semibold text-ink">{category.name}</p>
            <p className="text-sm text-muted">
              {spent.toLocaleString()} / {category.budget.toLocaleString()} MAD
            </p>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-xs text-muted hover:text-primary"
                aria-label={`Edit ${category.name}`}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-xs text-muted hover:text-danger"
                aria-label={`Delete ${category.name}`}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-4">
        <ProgressBar
          value={pct}
          barClass={over ? "bg-danger" : tokens.bar}
        />
        <p className={`mt-1.5 text-xs ${over ? "text-danger" : "text-muted"}`}>
          {over ? "Over budget" : `${Math.round(pct)}% used`}
        </p>
      </div>
    </div>
  );
}

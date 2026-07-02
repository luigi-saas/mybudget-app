"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBudgetData } from "@/lib/useBudgetData";
import { useMonth } from "@/lib/month-context";
import {
  addCategory,
  addTransaction,
  deleteCategory,
  deleteTransaction,
  seedNotionTemplate,
} from "@/lib/firestore";
import type { Account, CategoryColor, Group, IconKey } from "@/lib/types";
import CategoryCard from "./CategoryCard";
import Modal from "./Modal";
import Icon from "./Icon";
import MonthSwitcher from "./MonthSwitcher";

const ICON_OPTIONS: IconKey[] = [
  "bolt", "water", "home", "wifi", "phone", "cart",
  "food", "fuel", "restaurant", "family", "gift", "car", "shield", "sparkles",
];
const COLOR_OPTIONS: CategoryColor[] = ["primary", "success", "warn", "danger", "violet"];

export default function CategoryGroupView({
  group,
  title,
  subtitle,
}: {
  group: Group;
  title: string;
  subtitle: string;
}) {
  const { user } = useAuth();
  const { month } = useMonth();
  const { fixedCategories, variableCategories, spentByCategory, monthTransactions } =
    useBudgetData();
  const categories = group === "fixed" ? fixedCategories : variableCategories;
  const [search, setSearch] = useState("");
  const groupTransactions = monthTransactions
    .filter((t) => t.group === group)
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [txModalOpen, setTxModalOpen] = useState(false);

  // category form state
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [icon, setIcon] = useState<IconKey>("cart");
  const [color, setColor] = useState<CategoryColor>("primary");

  // transaction form state
  const [txName, setTxName] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txCategoryId, setTxCategoryId] = useState("");
  const [txAccount, setTxAccount] = useState<Account>("wallet");
  const [txDate, setTxDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [txNote, setTxNote] = useState("");
  const [importing, setImporting] = useState(false);

  async function handleAddCategory(e: FormEvent) {
    e.preventDefault();
    if (!user || !name || !budget) return;
    await addCategory(user.uid, {
      name,
      group,
      budget: Number(budget),
      icon,
      color,
    });
    setName("");
    setBudget("");
    setCatModalOpen(false);
  }

  async function handleAddTransaction(e: FormEvent) {
    e.preventDefault();
    if (!user || !txName || !txAmount || !txCategoryId) return;
    await addTransaction(user.uid, {
      name: txName,
      amount: Number(txAmount),
      categoryId: txCategoryId,
      group,
      account: txAccount,
      date: txDate,
      ...(txNote ? { note: txNote } : {}),
    });
    setTxName("");
    setTxAmount("");
    setTxNote("");
    setTxModalOpen(false);
  }

  async function handleImportTemplate() {
    if (!user) return;
    setImporting(true);
    try {
      await seedNotionTemplate(user.uid);
    } finally {
      setImporting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MonthSwitcher />
          <button
            onClick={() => setCatModalOpen(true)}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-bg"
          >
            + Category
          </button>
          <button
            onClick={() => {
              setTxDate(`${month}-01`);
              setTxModalOpen(true);
            }}
            disabled={categories.length === 0}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            + Expense
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            No categories yet. Add one manually, or import your original
            Notion budget template in one click.
          </p>
          <button
            onClick={handleImportTemplate}
            disabled={importing}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {importing ? "Importing…" : "Import Notion template"}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              spent={spentByCategory[c.id] || 0}
              onDelete={() => user && deleteCategory(user.uid, c.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Recent entries</h2>
        <input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-40 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
      </div>
      {groupTransactions.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No expenses logged this month.</p>
      ) : (
        <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
          {groupTransactions.map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId);
            return (
              <div key={t.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg text-muted">
                    <Icon name={cat?.icon || "sparkles"} size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-muted">
                      {cat?.name || "Uncategorized"} · {t.date} ·{" "}
                      <span className="capitalize">{t.account}</span>
                      {t.note ? ` · ${t.note}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">
                    {t.amount.toLocaleString()} MAD
                  </span>
                  <button
                    onClick={() => user && deleteTransaction(user.uid, t.id)}
                    className="text-xs text-muted hover:text-danger"
                    aria-label={`Delete ${t.name}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add category modal */}
      <Modal open={catModalOpen} onClose={() => setCatModalOpen(false)} title="New category">
        <form onSubmit={handleAddCategory} className="space-y-3">
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Monthly budget (MAD)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            min="0"
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted">Icon</p>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    icon === i ? "border-primary bg-primary-light text-primary-dark" : "border-border text-muted"
                  }`}
                >
                  <Icon name={i} size={16} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted">Color</p>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    color === c ? "border-ink" : "border-transparent"
                  }`}
                  style={{
                    backgroundColor:
                      c === "primary" ? "#1CA7EC" :
                      c === "success" ? "#17B26A" :
                      c === "warn" ? "#FF8A3D" :
                      c === "danger" ? "#EF4E5F" : "#7C6CF0",
                  }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Add category
          </button>
        </form>
      </Modal>

      {/* Add transaction modal */}
      <Modal open={txModalOpen} onClose={() => setTxModalOpen(false)} title="New expense">
        <form onSubmit={handleAddTransaction} className="space-y-3">
          <input
            placeholder="What was it for?"
            value={txName}
            onChange={(e) => setTxName(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Amount (MAD)"
            value={txAmount}
            onChange={(e) => setTxAmount(e.target.value)}
            required
            min="0"
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <select
            value={txCategoryId}
            onChange={(e) => setTxCategoryId(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {(["wallet", "home"] as Account[]).map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setTxAccount(a)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize ${
                  txAccount === a
                    ? "border-primary bg-primary-light text-primary-dark"
                    : "border-border text-muted"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={txDate}
            onChange={(e) => setTxDate(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            placeholder="Note (optional)"
            value={txNote}
            onChange={(e) => setTxNote(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Add expense
          </button>
        </form>
      </Modal>
    </main>
  );
}

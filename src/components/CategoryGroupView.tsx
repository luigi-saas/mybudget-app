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
  seedSmartBudgetTemplate,
  updateCategory,
  updateTransaction,
} from "@/lib/firestore";
import type { Account, Category, CategoryColor, Group, IconKey, Transaction } from "@/lib/types";
import CategoryCard from "./CategoryCard";
import Modal from "./Modal";
import LucideIcon from "./LucideIcon";
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
  const { fixedCategories, variableCategories, spentByCategory, monthTransactions, totalIncome } =
    useBudgetData();
  const categories = group === "fixed" ? fixedCategories : variableCategories;
  const [search, setSearch] = useState("");
  const groupTransactions = monthTransactions
    .filter((t) => t.group === group)
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

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
  const [importing, setImporting] = useState<"notion" | "smart" | null>(null);
  const [smartTemplateOpen, setSmartTemplateOpen] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");
  const [incomeName, setIncomeName] = useState("Salary");
  const [fixedShare, setFixedShare] = useState("50");
  const [savingsShare, setSavingsShare] = useState("20");
  const [housingBudget, setHousingBudget] = useState("50");
  const [goalName, setGoalName] = useState("Emergency fund");

  function resetCategoryForm() {
    setName("");
    setBudget("");
    setIcon("cart");
    setColor("primary");
    setEditingCategoryId(null);
  }

  function openNewCategoryModal() {
    resetCategoryForm();
    setCatModalOpen(true);
  }

  function openEditCategoryModal(category: Category) {
    setEditingCategoryId(category.id);
    setName(category.name);
    setBudget(String(category.budget));
    setIcon(category.icon);
    setColor(category.color);
    setCatModalOpen(true);
  }

  async function handleAddCategory(e: FormEvent) {
    e.preventDefault();
    if (!user || !name || !budget) return;
    if (editingCategoryId) {
      await updateCategory(user.uid, editingCategoryId, {
        name,
        budget: Number(budget),
        icon,
        color,
      });
    } else {
      await addCategory(user.uid, {
        name,
        group,
        budget: Number(budget),
        icon,
        color,
      });
    }
    resetCategoryForm();
    setCatModalOpen(false);
  }

  function resetTransactionForm() {
    setTxName("");
    setTxAmount("");
    setTxCategoryId(categories[0]?.id || "");
    setTxAccount("wallet");
    setTxDate(new Date().toISOString().slice(0, 10));
    setTxNote("");
    setEditingTransactionId(null);
  }

  function openNewTransactionModal() {
    resetTransactionForm();
    setTxModalOpen(true);
  }

  function openEditTransactionModal(transaction: Transaction) {
    setEditingTransactionId(transaction.id);
    setTxName(transaction.name);
    setTxAmount(String(transaction.amount));
    setTxCategoryId(transaction.categoryId);
    setTxAccount(transaction.account);
    setTxDate(transaction.date);
    setTxNote(transaction.note || "");
    setTxModalOpen(true);
  }

  async function handleAddTransaction(e: FormEvent) {
    e.preventDefault();
    if (!user || !txName || !txAmount || !txCategoryId) return;
    if (editingTransactionId) {
      await updateTransaction(user.uid, editingTransactionId, {
        name: txName,
        amount: Number(txAmount),
        categoryId: txCategoryId,
        group,
        account: txAccount,
        date: txDate,
        ...(txNote ? { note: txNote } : {}),
      });
    } else {
      await addTransaction(user.uid, {
        name: txName,
        amount: Number(txAmount),
        categoryId: txCategoryId,
        group,
        account: txAccount,
        date: txDate,
        ...(txNote ? { note: txNote } : {}),
      });
    }
    resetTransactionForm();
    setTxModalOpen(false);
  }

  function resetSmartTemplateForm() {
    setIncomeInput(String(totalIncome || 8500));
    setIncomeName("Salary");
    setFixedShare("50");
    setSavingsShare("20");
    setHousingBudget("50");
    setGoalName("Emergency fund");
    setSmartTemplateOpen(false);
  }

  async function handleImportTemplate(template: "notion" | "smart") {
    if (!user) return;
    setImporting(template);
    try {
      if (template === "smart") {
        await seedSmartBudgetTemplate(user.uid, Number(incomeInput || totalIncome || 8500), {
          fixedShare: Number(fixedShare || 50),
          savingsShare: Number(savingsShare || 20),
          housingBudget: Number(housingBudget || 50),
          goalName,
          incomeName,
        });
      } else {
        await seedNotionTemplate(user.uid);
      }
    } finally {
      setImporting(null);
      if (template === "smart") {
        resetSmartTemplateForm();
      }
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="rounded-[28px] border border-border bg-surface p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{title}</h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MonthSwitcher />
            <button
              onClick={openNewCategoryModal}
              className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-bg"
            >
              + Category
            </button>
            <button
              onClick={() => {
                setTxDate(`${month}-01`);
                openNewTransactionModal();
              }}
              disabled={categories.length === 0}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              + Expense
            </button>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-border bg-surface p-8 text-center shadow-card">
          <p className="text-sm text-muted">
            No categories yet. Add one manually, or launch a smarter starter plan based on the 50/30/20 rule.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setIncomeInput(String(totalIncome || 8500));
                setSmartTemplateOpen(true);
              }}
              disabled={importing === "smart"}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {importing === "smart" ? "Creating…" : "Create smart template"}
            </button>
            <button
              onClick={() => handleImportTemplate("notion")}
              disabled={importing === "notion"}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-ink hover:bg-bg disabled:opacity-60"
            >
              {importing === "notion" ? "Importing…" : "Import Notion template"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              spent={spentByCategory[c.id] || 0}
              onEdit={() => openEditCategoryModal(c)}
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
              <div key={t.id} className="flex items-center justify-between px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg text-muted">
                    <LucideIcon name={cat?.icon || "sparkles"} size={16} />
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {t.amount.toLocaleString()} MAD
                  </span>
                  <button
                    onClick={() => openEditTransactionModal(t)}
                    className="text-xs text-muted hover:text-primary"
                    aria-label={`Edit ${t.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => user && deleteTransaction(user.uid, t.id)}
                    className="text-xs text-muted hover:text-danger"
                    aria-label={`Delete ${t.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add category modal */}
      <Modal open={catModalOpen} onClose={() => { setCatModalOpen(false); resetCategoryForm(); }} title={editingCategoryId ? "Edit category" : "New category"}>
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
                  <LucideIcon name={i} size={16} />
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
            {editingCategoryId ? "Save category" : "Add category"}
          </button>
        </form>
      </Modal>

      <Modal open={smartTemplateOpen} onClose={resetSmartTemplateForm} title="Build your smart template">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImportTemplate("smart");
          }}
          className="space-y-3"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Salary / income source</label>
            <input
              value={incomeName}
              onChange={(e) => setIncomeName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Monthly income (MAD)</label>
            <input
              type="number"
              required
              min="0"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Fixed costs share (%)</label>
            <input
              type="number"
              required
              min="20"
              max="70"
              value={fixedShare}
              onChange={(e) => setFixedShare(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Savings share (%)</label>
            <input
              type="number"
              required
              min="5"
              max="40"
              value={savingsShare}
              onChange={(e) => setSavingsShare(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Housing budget share (%)</label>
            <input
              type="number"
              required
              min="10"
              max="80"
              value={housingBudget}
              onChange={(e) => setHousingBudget(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Savings goal name</label>
            <input
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted">
            This follows a practical 50/30/20-style structure with essentials, flexible spending, and savings built from your salary and share targets.
          </p>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Generate template
          </button>
        </form>
      </Modal>

      {/* Add transaction modal */}
      <Modal open={txModalOpen} onClose={() => { setTxModalOpen(false); resetTransactionForm(); }} title={editingTransactionId ? "Edit expense" : "New expense"}>
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
            {editingTransactionId ? "Save expense" : "Add expense"}
          </button>
        </form>
      </Modal>
    </main>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBudgetData } from "@/lib/useBudgetData";
import { addIncome, deleteIncome } from "@/lib/firestore";
import type { Account } from "@/lib/types";
import Modal from "@/components/Modal";
import Icon from "@/components/Icon";
import StatCard from "@/components/StatCard";

export default function IncomePage() {
  const { user } = useAuth();
  const { incomes, totalIncome, home, wallet } = useBudgetData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState<Account>("wallet");
  const [recurring, setRecurring] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!user || !name || !amount) return;
    await addIncome(user.uid, {
      name,
      amount: Number(amount),
      account,
      date,
      recurring,
    });
    setName("");
    setAmount("");
    setOpen(false);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Income</h1>
          <p className="mt-1 text-sm text-muted">
            What comes in, split between Home and Wallet — the same way your
            original budget tracked it.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + Income
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total income" value={`${totalIncome.toLocaleString()} MAD`} icon="wallet" color="primary" />
        <StatCard label="Home balance" value={`${home.balance.toLocaleString()} MAD`} icon="home" color={home.balance < 0 ? "danger" : "success"} />
        <StatCard label="Wallet balance" value={`${wallet.balance.toLocaleString()} MAD`} icon="bank" color={wallet.balance < 0 ? "danger" : "violet"} />
      </div>

      {incomes.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            No income logged yet. Add your salary or side income, or import
            the Notion template from the Fixed page to seed the original
            3,100 Home / 5,400 Wallet split.
          </p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-surface">
          {incomes.map((i) => (
            <div key={i.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-light text-success">
                  <Icon name="wallet" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{i.name}</p>
                  <p className="text-xs text-muted">
                    <span className="capitalize">{i.account}</span> · {i.date}
                    {i.recurring ? " · recurring" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-success">
                  +{i.amount.toLocaleString()} MAD
                </span>
                <button
                  onClick={() => user && deleteIncome(user.uid, i.id)}
                  className="text-xs text-muted hover:text-danger"
                  aria-label={`Delete ${i.name}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New income">
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            placeholder="Source (e.g. Salary, Freelance)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Amount (MAD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            {(["wallet", "home"] as Account[]).map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAccount(a)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize ${
                  account === a
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Repeats every month
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Add income
          </button>
        </form>
      </Modal>
    </main>
  );
}

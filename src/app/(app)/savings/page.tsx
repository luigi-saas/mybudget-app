"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBudgetData } from "@/lib/useBudgetData";
import { useMonth } from "@/lib/month-context";
import {
  addSavingsContribution,
  addSavingsGoal,
  deleteSavingsContribution,
  deleteSavingsGoal,
} from "@/lib/firestore";
import type { SavingsContribution } from "@/lib/types";
import SavingsCard from "@/components/SavingsCard";
import Modal from "@/components/Modal";
import MonthSwitcher from "@/components/MonthSwitcher";
import StatCard from "@/components/StatCard";

export default function SavingsPage() {
  const { user } = useAuth();
  const { month } = useMonth();
  const { savings, contributions, totalSavingsCurrent, totalSavingsTarget, totalSavedThisMonth } =
    useBudgetData();

  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [source, setSource] = useState("Bank");

  const [contribGoalId, setContribGoalId] = useState<string | null>(null);
  const [contribAmount, setContribAmount] = useState("");
  const [contribMonth, setContribMonth] = useState(month);
  const [contribDate, setContribDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function handleAddGoal(e: FormEvent) {
    e.preventDefault();
    if (!user || !name || !target) return;
    await addSavingsGoal(user.uid, {
      name,
      target: Number(target),
      current: 0,
      source,
      achieved: false,
    });
    setName("");
    setTarget("");
    setGoalModalOpen(false);
  }

  function openContribution(goalId: string) {
    setContribGoalId(goalId);
    setContribMonth(month);
    setContribAmount("");
  }

  async function handleAddContribution(e: FormEvent) {
    e.preventDefault();
    if (!user || !contribGoalId || !contribAmount) return;
    await addSavingsContribution(user.uid, {
      goalId: contribGoalId,
      amount: Number(contribAmount),
      month: contribMonth,
      date: contribDate,
    });
    setContribGoalId(null);
    setContribAmount("");
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Savings goals</h1>
          <p className="mt-1 text-sm text-muted">
            Set a target for each goal, then add what you saved every month and watch the sum grow.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MonthSwitcher />
          <button
            onClick={() => setGoalModalOpen(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            + Goal
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Saved this month" value={`${totalSavedThisMonth.toLocaleString()} MAD`} icon="piggy" color="success" />
        <StatCard label="All-time saved" value={`${totalSavingsCurrent.toLocaleString()} MAD`} icon="wallet" color="primary" />
        <StatCard label="Total target" value={`${totalSavingsTarget.toLocaleString()} MAD`} icon="sparkles" color="violet" />
      </div>

      {savings.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">No savings goals yet. Add your first one.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {savings.map((g) => {
            const goalContributions = contributions.filter((c) => c.goalId === g.id);
            const monthHasContribution = goalContributions.some((c) => c.month === month);
            return (
              <SavingsCard
                key={g.id}
                goal={g}
                contributions={goalContributions}
                monthHasContribution={monthHasContribution}
                onAdd={() => openContribution(g.id)}
                onDeleteContribution={(c) => user && deleteSavingsContribution(user.uid, c)}
                onDelete={() => user && deleteSavingsGoal(user.uid, g.id)}
              />
            );
          })}
        </div>
      )}

      {/* New goal modal */}
      <Modal open={goalModalOpen} onClose={() => setGoalModalOpen(false)} title="New savings goal">
        <form onSubmit={handleAddGoal} className="space-y-3">
          <input
            placeholder="Goal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Target amount (MAD)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
            min="0"
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option>Bank</option>
            <option>Home</option>
            <option>Wallet</option>
          </select>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Add goal
          </button>
        </form>
      </Modal>

      {/* Add monthly contribution modal */}
      <Modal
        open={contribGoalId !== null}
        onClose={() => setContribGoalId(null)}
        title="Add this month's saving"
      >
        <form onSubmit={handleAddContribution} className="space-y-3">
          <input
            type="number"
            placeholder="Amount saved (MAD)"
            value={contribAmount}
            onChange={(e) => setContribAmount(e.target.value)}
            required
            min="0"
            autoFocus
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted">For month</p>
            <input
              type="month"
              value={contribMonth}
              onChange={(e) => setContribMonth(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <input
            type="date"
            value={contribDate}
            onChange={(e) => setContribDate(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Save it
          </button>
        </form>
      </Modal>
    </main>
  );
}

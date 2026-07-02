"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBudgetData } from "@/lib/useBudgetData";
import { addSavingsGoal, deleteSavingsGoal, updateSavingsGoal } from "@/lib/firestore";
import SavingsCard from "@/components/SavingsCard";
import Modal from "@/components/Modal";

export default function SavingsPage() {
  const { user } = useAuth();
  const { savings } = useBudgetData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [source, setSource] = useState("Bank");

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!user || !name || !target) return;
    await addSavingsGoal(user.uid, {
      name,
      target: Number(target),
      current: Number(current) || 0,
      source,
      achieved: false,
    });
    setName("");
    setTarget("");
    setCurrent("");
    setOpen(false);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Savings goals</h1>
          <p className="mt-1 text-sm text-muted">Set targets and watch them fill up.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + Goal
        </button>
      </div>

      {savings.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">No savings goals yet. Add your first one.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {savings.map((g) => (
            <SavingsCard
              key={g.id}
              goal={g}
              onToggleAchieved={() =>
                user &&
                updateSavingsGoal(user.uid, g.id, {
                  achieved: !g.achieved,
                  current: !g.achieved ? g.target : g.current,
                })
              }
              onDelete={() => user && deleteSavingsGoal(user.uid, g.id)}
            />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New savings goal">
        <form onSubmit={handleAdd} className="space-y-3">
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
          <input
            type="number"
            placeholder="Current amount saved (optional)"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
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
    </main>
  );
}

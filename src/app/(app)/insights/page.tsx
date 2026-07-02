import Link from "next/link";
import Icon from "@/components/Icon";

const tips = [
  {
    title: "Plan your month from the top",
    text: "Start with income, then map fixed bills, and leave a buffer for variable spending.",
    icon: "shield" as const,
  },
  {
    title: "Review your safe-to-spend number",
    text: "Use the daily target to avoid overspending before the end of the month.",
    icon: "wallet" as const,
  },
  {
    title: "Keep savings visible",
    text: "Treat savings goals like real bills so progress stays steady.",
    icon: "piggy" as const,
  },
];

export default function InsightsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <p className="text-sm font-semibold text-primary">Insights</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">A clearer view of your money habits</h1>
        <p className="mt-2 text-sm text-muted">
          These lightweight insights help you use Budgetly as a weekly decision tool, not just a ledger.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {tips.map((tip) => (
          <div key={tip.title} className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary-dark">
              <Icon name={tip.icon} size={18} />
            </div>
            <h2 className="mt-3 font-semibold text-ink">{tip.title}</h2>
            <p className="mt-1 text-sm text-muted">{tip.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Why this matters</h2>
        <p className="mt-2 text-sm text-muted">
          When your budget is visible in one place, it becomes easier to make calm choices. That means fewer surprises, better habits, and more confidence when money feels tight.
        </p>
        <Link href="/history" className="mt-4 inline-flex text-sm font-semibold text-primary">
          Review your monthly history →
        </Link>
      </div>
    </main>
  );
}

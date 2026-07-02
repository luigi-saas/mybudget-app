import Link from "next/link";
import Icon from "@/components/Icon";

const guides = [
  {
    title: "Start with your fixed bills",
    blurb: "Map rent, subscriptions, and recurring commitments first so your base plan is realistic.",
  },
  {
    title: "Leave room for variable spending",
    blurb: "Food, transport, and household extras are easier to plan when they are tracked weekly.",
  },
  {
    title: "Treat savings as a non-negotiable",
    blurb: "Use monthly contributions to make your goals feel automatic instead of aspirational.",
  },
];

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <p className="text-sm font-semibold text-primary">Guides</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Practical ways to get more out of Budgetly</h1>
        <p className="mt-2 text-sm text-muted">
          These everyday habits make the app feel more valuable over time.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {guides.map((guide) => (
          <div key={guide.title} className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-violet-light text-violet">
                <Icon name="sparkles" size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-ink">{guide.title}</h2>
                <p className="mt-1 text-sm text-muted">{guide.blurb}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5 shadow-card">
        <p className="text-sm font-semibold text-ink">Need a quick start?</p>
        <p className="mt-1 text-sm text-muted">Open your dashboard and review the next best step to turn the plan into action.</p>
        <Link href="/dashboard" className="mt-4 inline-flex text-sm font-semibold text-primary">
          Jump to dashboard →
        </Link>
      </div>
    </main>
  );
}

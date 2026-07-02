import Link from "next/link";
import LucideIcon from "@/components/LucideIcon";
import BrandMark from "@/components/BrandMark";
import pkg from "../../package.json";

const features = [
  {
    icon: "bolt" as const,
    color: "primary" as const,
    title: "Fixed charges",
    text: "Rent, bills, subscriptions — set a monthly cap once and track it automatically.",
  },
  {
    icon: "cart" as const,
    color: "warn" as const,
    title: "Variable spending",
    text: "Groceries, fuel, family, going out — log expenses in two taps as they happen.",
  },
  {
    icon: "piggy" as const,
    color: "success" as const,
    title: "Savings goals",
    text: "Give every goal a target and a source, and watch the progress bar fill up.",
  },
  {
    icon: "sparkles" as const,
    color: "violet" as const,
    title: "One clear overview",
    text: "Budget, spent, remaining, and saved — the four numbers that actually matter.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    tagline: "For one person keeping it simple.",
    features: ["1 account", "Unlimited categories", "Unlimited expenses", "3 savings goals"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Personal",
    price: "$9",
    period: "/month",
    tagline: "For a full household budget.",
    features: [
      "Everything in Starter",
      "Unlimited savings goals",
      "Shared household categories",
      "Priority support",
    ],
    cta: "Start Personal",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    tagline: "For teams tracking shared budgets.",
    features: [
      "Everything in Personal",
      "Multi-user access",
      "Monthly export",
      "Dedicated onboarding",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <main className="bg-bg text-ink">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" />
          <div>
            <span className="text-lg font-bold">Budgetly</span>
            <p className="text-xs text-muted">v{pkg.version}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-ink">
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <div>
          <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            Built for modern finance teams
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            Your next budget app should feel premium from day one.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted md:text-lg">
            Budgetly is designed for people who want clarity, control, and confidence in every financial decision. One dashboard for income, bills, spending, and goals.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
            >
              Launch your budget
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink hover:bg-bg"
            >
              Explore demo
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-card">
              <p className="text-sm font-medium text-muted">Monthly budget tracked</p>
              <p className="mt-3 text-2xl font-bold text-ink">$120K</p>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-card">
              <p className="text-sm font-medium text-muted">Users onboarded</p>
              <p className="mt-3 text-2xl font-bold text-ink">10,400+</p>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-card">
              <p className="text-sm font-medium text-muted">Average savings growth</p>
              <p className="mt-3 text-2xl font-bold text-ink">23%</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.08)]">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Portfolio preview</p>
                <p className="mt-2 text-sm text-muted">December 2025</p>
              </div>
              <span className="rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success">
                On track
              </span>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="text-sm text-muted">Available balance</p>
              <p className="mt-3 text-4xl font-extrabold text-ink">$42,680</p>
              <p className="mt-2 text-sm text-muted">Up 18% vs. last month</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Budget", value: "$82,000", className: "bg-primary-light text-primary-dark" },
                { label: "Spent", value: "$28,500", className: "bg-warn-light text-warn" },
                { label: "Saved", value: "$14,200", className: "bg-success-light text-success" },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl border border-border bg-surface p-4 ${item.className}`}>
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Goals progress</span>
                <span>4/5 complete</span>
              </div>
              <div className="mt-3 space-y-3">
                {[
                  { label: "Emergency fund", pct: 78, color: "bg-primary" },
                  { label: "Travel", pct: 45, color: "bg-violet" },
                  { label: "Home upgrade", pct: 62, color: "bg-success" },
                ].map((step) => (
                  <div key={step.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-ink">{step.label}</span>
                      <span className="text-muted">{step.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-bg">
                      <div className={`h-2 rounded-full ${step.color}`} style={{ width: `${step.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">A premium budgeting experience built for scale.</h2>
            <p className="mt-3 max-w-2xl text-base text-muted">
              Move beyond spreadsheets with an intelligent, mobile-ready workflow that keeps you on track every month.
            </p>
          </div>
          <p className="text-sm text-muted">Fast setup · Real-time clarity · Elegant controls</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg">
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                  f.color === "primary" ? "bg-primary-light text-primary-dark" :
                  f.color === "warn" ? "bg-warn-light text-warn" :
                  f.color === "success" ? "bg-success-light text-success" :
                  "bg-violet-light text-violet"
                }`}
              >
                <LucideIcon name={f.icon} size={20} />
              </div>
              <p className="text-lg font-semibold text-ink">{f.title}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-pop">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Designed for serious money makers</p>
              <h3 className="mt-3 text-3xl font-bold text-ink">Turn monthly planning into dependable results.</h3>
              <p className="mt-4 max-w-xl text-base text-muted">
                Budgetly replaces complex trackers with clear categories, automated rollovers, and built-in savings planning so you can focus on growth.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Track every account", description: "A single source of truth for income, spending, and obligations." },
                { title: "Forecast cash flow", description: "Know what you can safely spend across the whole month." },
                { title: "Protect goals", description: "Keep savings ahead of recurring payments and big events." },
                { title: "Stay notified", description: "Smart alerts for overspending, due dates, and budget gaps." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16" id="pricing">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">Premium pricing for professionals.</h2>
            <p className="mt-3 max-w-2xl text-base text-muted">
              Start with the free plan, then upgrade when your budget requires smarter insights and team-ready tools.
            </p>
          </div>
          <div className="text-sm text-muted">No hidden fees · Cancel anytime · Secure by default</div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-[2rem] border p-6 ${
                p.highlighted
                  ? "border-primary bg-gradient-to-br from-primary/10 via-white to-surface shadow-pop"
                  : "border-border bg-surface shadow-card"
              }`}
            >
              {p.highlighted && (
                <span className="mb-4 inline-flex rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
                  Most popular
                </span>
              )}
              <p className="text-lg font-bold text-ink">{p.name}</p>
              <p className="mt-1 text-sm text-muted">{p.tagline}</p>
              <p className="mt-6 text-4xl font-extrabold text-ink">
                {p.price}
                <span className="text-base font-medium text-muted">{p.period}</span>
              </p>
              <ul className="mt-5 space-y-3 text-sm text-ink">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold ${
                  p.highlighted
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "border border-border text-ink hover:bg-bg"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} Budgetly. Install it from your browser's "Add to Home Screen" menu.
      </footer>
    </main>
  );
}

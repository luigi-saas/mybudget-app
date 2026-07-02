import Link from "next/link";
import LucideIcon from "@/components/LucideIcon";
import BrandMark from "@/components/BrandMark";

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
    <main className="bg-bg">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" />
          <span className="text-lg font-bold text-ink">Budgetly</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-ink">
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            Replaces your budget spreadsheet
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            A sharper way to manage <br /> every dollar you earn.
          </h1>
          <p className="mt-4 text-base text-muted md:text-lg">
            Budgetly combines fixed bills, daily spending, income, and savings in one calm dashboard — so you can make smart money moves without opening a spreadsheet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Create your dashboard
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink hover:bg-bg"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Signature element: a live-feeling preview card, flat colors, no gradients */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-pop">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">This month</p>
            <span className="rounded-full bg-success-light px-2.5 py-1 text-xs font-semibold text-success">
              On track
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-bg p-4">
              <p className="text-xs text-muted">Budget</p>
              <p className="text-xl font-bold text-ink">8,500 MAD</p>
            </div>
            <div className="rounded-lg bg-bg p-4">
              <p className="text-xs text-muted">Remaining</p>
              <p className="text-xl font-bold text-success">2,140 MAD</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Location", pct: 98, color: "bg-primary" },
              { name: "Alimentation", pct: 33, color: "bg-warn" },
              { name: "Projet x — savings", pct: 100, color: "bg-success" },
            ].map((row) => (
              <div key={row.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink">{row.name}</span>
                  <span className="text-muted">{row.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-bg">
                  <div className={`h-2 rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-bold text-ink">Everything your spreadsheet was doing manually</h2>
          <p className="text-sm text-muted">Now faster, calmer, and built for your phone.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
                  f.color === "primary" ? "bg-primary-light text-primary-dark" :
                  f.color === "warn" ? "bg-warn-light text-warn" :
                  f.color === "success" ? "bg-success-light text-success" :
                  "bg-violet-light text-violet"
                }`}
              >
                <LucideIcon name={f.icon} size={18} />
              </div>
              <p className="font-semibold text-ink">{f.title}</p>
              <p className="mt-1 text-sm text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Built for real life</p>
              <h3 className="mt-2 text-2xl font-bold text-ink">More clarity, less mental load.</h3>
              <p className="mt-2 text-sm text-muted">
                See what is safe to spend today, track progress toward goals, and stay ahead of overspending without juggling multiple apps.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-bg p-4">
              <ul className="space-y-3 text-sm text-ink">
                <li className="flex items-center gap-2"><span className="text-success">✓</span> One-stop view for income, bills, and savings</li>
                <li className="flex items-center gap-2"><span className="text-success">✓</span> Simple alerts before a category gets out of hand</li>
                <li className="flex items-center gap-2"><span className="text-success">✓</span> Mobile-first experience that feels like a real app</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16" id="pricing">
        <h2 className="text-2xl font-bold text-ink">Simple pricing</h2>
        <p className="mt-1 text-sm text-muted">Start free. Upgrade when your budget grows with you.</p>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${
                p.highlighted
                  ? "border-primary bg-surface shadow-pop"
                  : "border-border bg-surface shadow-card"
              }`}
            >
              {p.highlighted && (
                <span className="mb-3 inline-block rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary-dark">
                  Most popular
                </span>
              )}
              <p className="text-lg font-bold text-ink">{p.name}</p>
              <p className="mt-1 text-sm text-muted">{p.tagline}</p>
              <p className="mt-4 text-3xl font-extrabold text-ink">
                {p.price}
                <span className="text-base font-medium text-muted">{p.period}</span>
              </p>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink">
                    <span className="text-success">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
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

"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import LucideIcon from "@/components/LucideIcon";
import BrandMark from "@/components/BrandMark";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import pkg from "../../package.json";

const features = [
  {
    icon: "bolt" as const,
    color: "primary" as const,
    titleKey: "feature.fixed.title",
    textKey: "feature.fixed.text",
  },
  {
    icon: "cart" as const,
    color: "warn" as const,
    titleKey: "feature.variable.title",
    textKey: "feature.variable.text",
  },
  {
    icon: "piggy" as const,
    color: "success" as const,
    titleKey: "feature.savings.title",
    textKey: "feature.savings.text",
  },
  {
    icon: "sparkles" as const,
    color: "violet" as const,
    titleKey: "feature.overview.title",
    textKey: "feature.overview.text",
  },
];

const stats = [
  { labelKey: "stats.monthlyBudget", value: "$120K" },
  { labelKey: "stats.onboardedUsers", value: "10,400+" },
  { labelKey: "stats.savingsGrowth", value: "23%" },
];

const promoItems = [
  { titleKey: "promo.track", descriptionKey: "promo.trackText" },
  { titleKey: "promo.forecast", descriptionKey: "promo.forecastText" },
  { titleKey: "promo.protect", descriptionKey: "promo.protectText" },
  { titleKey: "promo.notify", descriptionKey: "promo.notifyText" },
];

const plans = [
  {
    nameKey: "plan.starter",
    price: "Free",
    period: "",
    taglineKey: "plan.starter.tagline",
    features: [
      "plan.starter.feature1",
      "plan.starter.feature2",
      "plan.starter.feature3",
      "plan.starter.feature4",
    ],
    ctaKey: "plan.cta.start",
    highlighted: false,
  },
  {
    nameKey: "plan.personal",
    price: "$9",
    period: "/month",
    taglineKey: "plan.personal.tagline",
    features: [
      "plan.personal.feature1",
      "plan.personal.feature2",
      "plan.personal.feature3",
      "plan.personal.feature4",
    ],
    ctaKey: "plan.cta.personal",
    highlighted: true,
  },
  {
    nameKey: "plan.business",
    price: "$29",
    period: "/month",
    taglineKey: "plan.business.tagline",
    features: [
      "plan.business.feature1",
      "plan.business.feature2",
      "plan.business.feature3",
      "plan.business.feature4",
    ],
    ctaKey: "plan.cta.business",
    highlighted: false,
  },
];

const localeLabels: Record<string, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export default function LandingPage() {
  const locale = useLocale();
  const t = useTranslations();

  const otherLocales = ["en", "fr", "ar"];

  return (
    <main className="bg-bg text-ink">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" />
          <div>
            <span className="text-lg font-bold">{t("brand.name")}</span>
            <p className="text-xs text-muted">{t("brand.tagline")}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Link href="/login" className="text-sm font-medium text-muted hover:text-ink">
            {t("header.signIn")}
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
          >
            {t("header.getStarted")}
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <div>
          <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            {t("hero.badge")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted md:text-lg">{t("hero.description")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
            >
              {t("hero.launch")}
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink hover:bg-bg"
            >
              {t("hero.demo")}
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.labelKey} className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-card">
                <p className="text-sm font-medium text-muted">{t(item.labelKey)}</p>
                <p className="mt-3 text-2xl font-bold text-ink">{item.value}</p>
              </div>
            ))}
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
              <span className="rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success">On track</span>
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
            <h2 className="text-3xl font-bold text-ink">{t("section.headline")}</h2>
            <p className="mt-3 max-w-2xl text-base text-muted">{t("section.subline")}</p>
          </div>
          <p className="text-sm text-muted">{t("section.meta")}</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.titleKey} className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg">
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                  feature.color === "primary"
                    ? "bg-primary-light text-primary-dark"
                    : feature.color === "warn"
                    ? "bg-warn-light text-warn"
                    : feature.color === "success"
                    ? "bg-success-light text-success"
                    : "bg-violet-light text-violet"
                }`}
              >
                <LucideIcon name={feature.icon} size={20} />
              </div>
              <p className="text-lg font-semibold text-ink">{t(feature.titleKey)}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{t(feature.textKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-pop">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Designed for serious money makers</p>
              <h3 className="mt-3 text-3xl font-bold text-ink">{t("promo.headline")}</h3>
              <p className="mt-4 max-w-xl text-base text-muted">{t("promo.text")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {promoItems.map((item) => (
                <div key={item.titleKey} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                  <p className="font-semibold text-ink">{t(item.titleKey)}</p>
                  <p className="mt-2 text-sm text-muted">{t(item.descriptionKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16" id="pricing">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">{t("pricing.headline")}</h2>
            <p className="mt-3 max-w-2xl text-base text-muted">{t("pricing.text")}</p>
          </div>
          <div className="text-sm text-muted">{t("pricing.meta")}</div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.nameKey}
              className={`rounded-[1.75rem] border p-6 shadow-card transition ${
                plan.highlighted ? "border-primary bg-primary/5" : "border-border bg-surface"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{t(plan.nameKey)}</p>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-bold text-ink">{plan.price}</p>
                <span className="pb-1 text-sm text-muted">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted">{t(plan.taglineKey)}</p>
              <ul className="mt-6 space-y-3 text-sm text-ink">
                {plan.features.map((featureKey) => (
                  <li key={featureKey} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                    <span>{t(featureKey)}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-8 w-full rounded-full py-3 text-sm font-semibold text-white transition ${
                  plan.highlighted ? "bg-primary" : "bg-ink"
                }`}
              >
                {t(plan.ctaKey)}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 pb-10 text-center text-sm text-muted">
        {t("footer.copy", { year: new Date().getFullYear() })} • {t("version.label", { version: pkg.version })}
      </footer>
    </main>
  );
}

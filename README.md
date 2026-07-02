# Budgetly

A responsive Next.js + Firebase budget tracker, installable as a PWA. Rebuilt
from a Notion budget (Fixed Charges / Variable Charges / Savings) into a real
app, styled with a flat, gradient-free brand system (blue/green/orange/violet
on white, matching the reference mobile UI's card language).

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Firebase Auth (email/password + Google) and Firestore (realtime)
- Web App Manifest + Service Worker → installable on iOS/Android/desktop

## 1. Firebase setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. In the project, go to **Build → Authentication → Sign-in method** and enable
   **Email/Password** and **Google**.
3. Go to **Build → Firestore Database → Create database** (start in production mode).
4. Deploy the included `firestore.rules` (or paste its contents into the
   Firestore **Rules** tab) — this scopes every document to
   `request.auth.uid`, so users can only ever read/write their own data.
5. Go to **Project settings → General → Your apps → Web app**, register an
   app, and copy the config values.
6. Copy `.env.local.example` to `.env.local` and fill in the six
   `NEXT_PUBLIC_FIREBASE_*` values from step 5.

## 2. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 3. Data model (Firestore)

```
users/{uid}/categories/{id}           { name, group: "fixed" | "variable", budget, color, icon, recurring, createdAt }
users/{uid}/transactions/{id}         { name, amount, categoryId, group, account: "home" | "wallet", date, note?, createdAt }
users/{uid}/incomes/{id}              { name, amount, account, date, recurring, createdAt }
users/{uid}/savings/{id}              { name, target, current, source, achieved, createdAt }
users/{uid}/savingsContributions/{id} { goalId, amount, month, date, createdAt }
```

Every screen (Overview, Income, Fixed, Variable, Savings) is scoped to a
selected month (top-right month switcher, persisted locally) so you see one
month's numbers at a time — a category's "spent" is only that month's
transactions, not a running lifetime total. The **History** page groups
everything by month so you can compare past months side by side.

Savings goals are **not** reset monthly — `current` is a running total kept
in sync via Firestore's atomic `increment()` every time you log a monthly
contribution in `savingsContributions`, so the goal's progress bar always
reflects the sum of everything you've ever put toward it, while History
shows how much went in during any given month.

## 4. Install as an app (PWA)

- **iOS Safari**: Share → Add to Home Screen
- **Android Chrome**: menu (⋮) → Install app
- **Desktop Chrome/Edge**: install icon in the address bar

The manifest (`public/manifest.json`) and service worker (`public/sw.js`)
make this installable and give it basic offline app-shell caching.

## 5. Deploy

Any Next.js host works (Vercel is the path of least resistance):

```bash
npm run build
```

Set the same `NEXT_PUBLIC_FIREBASE_*` env vars in your hosting provider's
dashboard.

## Notes on turning this into a paid SaaS

This scaffold gives you the product surface (auth, data, install, pricing
page) but **not** billing. To actually charge the $9/$29 plans shown on the
landing page, wire in Stripe Checkout + a webhook that writes a `plan` field
onto `users/{uid}`, then gate features (e.g. unlimited savings goals) behind
that field. Happy to build that next if useful.

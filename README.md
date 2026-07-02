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
users/{uid}/categories/{id}   { name, group: "fixed" | "variable", budget, color, icon, createdAt }
users/{uid}/transactions/{id} { name, amount, categoryId, group, date, createdAt }
users/{uid}/savings/{id}      { name, target, current, source, achieved, createdAt }
```

This mirrors the original Notion structure (Charge Fix / Charge Variable /
Saving, grouped by type with a budget "Base" and spent "Total") but as live,
queryable records instead of static CSV rows.

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

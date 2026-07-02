import type { Account, CategoryColor, Group, IconKey } from "./types";

// Parsed directly from the uploaded Notion export (Summary June - Charge Fix/Variable,
// June -Saving). Budgets = the "Base" column; savings current/achieved = the "État" column.

export const SEED_FIXED_CATEGORIES: {
  name: string;
  budget: number;
  icon: IconKey;
  color: CategoryColor;
}[] = [
  { name: "Facture (Eau & Électricité)", budget: 120, icon: "bolt", color: "primary" },
  { name: "Internet", budget: 500, icon: "wifi", color: "violet" },
  { name: "Téléphone", budget: 250, icon: "phone", color: "warn" },
  { name: "Location", budget: 3500, icon: "home", color: "danger" },
  { name: "AI", budget: 50, icon: "sparkles", color: "success" },
];

export const SEED_VARIABLE_CATEGORIES: {
  name: string;
  budget: number;
  icon: IconKey;
  color: CategoryColor;
}[] = [
  { name: "Alimentation", budget: 3000, icon: "food", color: "success" },
  { name: "Gazoil", budget: 700, icon: "fuel", color: "warn" },
  { name: "Restaurant", budget: 500, icon: "restaurant", color: "primary" },
  { name: "Sortie", budget: 500, icon: "sparkles", color: "violet" },
  { name: "Beauté", budget: 500, icon: "gift", color: "danger" },
  { name: "Famille", budget: 600, icon: "family", color: "primary" },
  { name: "Queen", budget: 800, icon: "gift", color: "violet" },
  { name: "King", budget: 800, icon: "car", color: "warn" },
  { name: "Shopping", budget: 1500, icon: "cart", color: "success" },
];

export const SEED_SAVINGS: {
  name: string;
  target: number;
  current: number;
  source: string;
  achieved: boolean;
}[] = [
  { name: "Projet X", target: 8000, current: 8000, source: "Bank", achieved: true },
  { name: "Voyage", target: 1000, current: 1000, source: "Home", achieved: true },
  { name: "Urgence", target: 1000, current: 1000, source: "Home", achieved: true },
  { name: "Voiture", target: 400, current: 400, source: "Home", achieved: true },
  { name: "Aid", target: 500, current: 0, source: "Home", achieved: false },
  { name: "Cadeau", target: 200, current: 0, source: "Home", achieved: false },
];

// From the original page note: "8500 = 3100 HOME + 5400 WALLET"
export const SEED_INCOME: { name: string; amount: number; account: Account }[] = [
  { name: "Monthly income — Home", amount: 3100, account: "home" },
  { name: "Monthly income — Wallet", amount: 5400, account: "wallet" },
];

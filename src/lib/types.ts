export type Group = "fixed" | "variable";

export type Account = "home" | "wallet";

export interface Category {
  id: string;
  name: string;
  group: Group;
  budget: number;
  color: CategoryColor;
  icon: IconKey;
  recurring?: boolean;
  createdAt: number;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  group: Group;
  account: Account;
  date: string; // ISO date, e.g. 2026-06-23
  note?: string;
  createdAt: number;
}

export interface Income {
  id: string;
  name: string;
  amount: number;
  account: Account;
  date: string;
  recurring: boolean;
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  source: string; // e.g. "Bank", "Home"
  achieved: boolean;
  createdAt: number;
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  month: string; // "2026-06"
  date: string;
  createdAt: number;
}

export interface MonthSettings {
  id: string; // "2026-06"
  totalBudget: number;
  homeAmount: number;
  walletAmount: number;
}

export type CategoryColor =
  | "primary"
  | "success"
  | "warn"
  | "danger"
  | "violet";

export type IconKey =
  | "bolt"
  | "water"
  | "home"
  | "wifi"
  | "phone"
  | "cart"
  | "food"
  | "fuel"
  | "restaurant"
  | "family"
  | "gift"
  | "sparkles"
  | "car"
  | "piggy"
  | "plane"
  | "shield"
  | "wallet"
  | "bank"
  | "alert"
  | "clock";

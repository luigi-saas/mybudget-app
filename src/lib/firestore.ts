import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Category,
  Income,
  MonthSettings,
  SavingsContribution,
  SavingsGoal,
  Transaction,
} from "./types";
import {
  SEED_FIXED_CATEGORIES,
  SEED_INCOME,
  SEED_SAVINGS,
  SEED_VARIABLE_CATEGORIES,
} from "./notionSeedData";

// All data lives under /users/{uid}/... so each account only ever sees its own data.

const categoriesRef = (uid: string) => collection(db, "users", uid, "categories");
const transactionsRef = (uid: string) => collection(db, "users", uid, "transactions");
const savingsRef = (uid: string) => collection(db, "users", uid, "savings");
const contributionsRef = (uid: string) =>
  collection(db, "users", uid, "savingsContributions");
const incomesRef = (uid: string) => collection(db, "users", uid, "incomes");
const monthRef = (uid: string, monthId: string) =>
  doc(db, "users", uid, "months", monthId);

// --- Categories ---

export function subscribeCategories(
  uid: string,
  cb: (items: Category[]) => void
) {
  const q = query(categoriesRef(uid), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)));
  });
}

export function addCategory(uid: string, data: Omit<Category, "id" | "createdAt">) {
  return addDoc(categoriesRef(uid), { ...data, createdAt: Date.now() });
}

export function updateCategory(uid: string, id: string, data: Partial<Category>) {
  return updateDoc(doc(db, "users", uid, "categories", id), data);
}

export function deleteCategory(uid: string, id: string) {
  return deleteDoc(doc(db, "users", uid, "categories", id));
}

// --- Transactions ---

export function subscribeTransactions(
  uid: string,
  cb: (items: Transaction[]) => void
) {
  const q = query(transactionsRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction)));
  });
}

export function addTransaction(
  uid: string,
  data: Omit<Transaction, "id" | "createdAt">
) {
  return addDoc(transactionsRef(uid), { ...data, createdAt: Date.now() });
}

export function updateTransaction(uid: string, id: string, data: Partial<Transaction>) {
  return updateDoc(doc(db, "users", uid, "transactions", id), data);
}

export function deleteTransaction(uid: string, id: string) {
  return deleteDoc(doc(db, "users", uid, "transactions", id));
}

// --- Savings goals ---

export function subscribeSavings(uid: string, cb: (items: SavingsGoal[]) => void) {
  const q = query(savingsRef(uid), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavingsGoal)));
  });
}

export function addSavingsGoal(
  uid: string,
  data: Omit<SavingsGoal, "id" | "createdAt">
) {
  return addDoc(savingsRef(uid), { ...data, createdAt: Date.now() });
}

export function updateSavingsGoal(
  uid: string,
  id: string,
  data: Partial<SavingsGoal>
) {
  return updateDoc(doc(db, "users", uid, "savings", id), data);
}

export function deleteSavingsGoal(uid: string, id: string) {
  return deleteDoc(doc(db, "users", uid, "savings", id));
}

// --- Monthly savings contributions ---
// Each contribution is a "I put X aside this month for goal Y" entry.
// goal.current is kept in sync via atomic increment/decrement so the total
// never has to be recomputed by summing every contribution on read.

export function subscribeContributions(
  uid: string,
  cb: (items: SavingsContribution[]) => void
) {
  const q = query(contributionsRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavingsContribution)));
  });
}

export async function addSavingsContribution(
  uid: string,
  data: Omit<SavingsContribution, "id" | "createdAt">
) {
  const batch = writeBatch(db);
  const ref = doc(contributionsRef(uid));
  batch.set(ref, { ...data, createdAt: Date.now() });
  batch.update(doc(db, "users", uid, "savings", data.goalId), {
    current: increment(data.amount),
  });
  await batch.commit();
}

export async function deleteSavingsContribution(
  uid: string,
  contribution: SavingsContribution
) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "users", uid, "savingsContributions", contribution.id));
  batch.update(doc(db, "users", uid, "savings", contribution.goalId), {
    current: increment(-contribution.amount),
  });
  await batch.commit();
}

// --- Income ---

export function subscribeIncomes(uid: string, cb: (items: Income[]) => void) {
  const q = query(incomesRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Income)));
  });
}

export function addIncome(uid: string, data: Omit<Income, "id" | "createdAt">) {
  return addDoc(incomesRef(uid), { ...data, createdAt: Date.now() });
}

export function deleteIncome(uid: string, id: string) {
  return deleteDoc(doc(db, "users", uid, "incomes", id));
}

// --- One-click import of the original Notion budget template ---
// Creates the Fixed/Variable categories, savings goals, and starting income
// entries exactly as they existed in the source Notion pages, so a new user
// doesn't have to recreate a spreadsheet's worth of setup by hand.

export async function seedNotionTemplate(uid: string) {
  const batch = writeBatch(db);
  const now = Date.now();

  SEED_FIXED_CATEGORIES.forEach((c, i) => {
    const ref = doc(categoriesRef(uid));
    batch.set(ref, {
      name: c.name,
      group: "fixed",
      budget: c.budget,
      icon: c.icon,
      color: c.color,
      recurring: true,
      createdAt: now + i,
    });
  });

  SEED_VARIABLE_CATEGORIES.forEach((c, i) => {
    const ref = doc(categoriesRef(uid));
    batch.set(ref, {
      name: c.name,
      group: "variable",
      budget: c.budget,
      icon: c.icon,
      color: c.color,
      recurring: false,
      createdAt: now + 100 + i,
    });
  });

  SEED_SAVINGS.forEach((s, i) => {
    const ref = doc(savingsRef(uid));
    batch.set(ref, {
      name: s.name,
      target: s.target,
      current: s.current,
      source: s.source,
      achieved: s.achieved,
      createdAt: now + 200 + i,
    });
  });

  const today = new Date().toISOString().slice(0, 10);
  SEED_INCOME.forEach((inc, i) => {
    const ref = doc(incomesRef(uid));
    batch.set(ref, {
      name: inc.name,
      amount: inc.amount,
      account: inc.account,
      date: today,
      recurring: true,
      createdAt: now + 300 + i,
    });
  });

  await batch.commit();
}

export async function seedSmartBudgetTemplate(
  uid: string,
  baseIncome: number,
  preferences: {
    fixedShare: number;
    savingsShare: number;
    housingBudget: number;
    goalName: string;
    incomeName: string;
  }
) {
  const batch = writeBatch(db);
  const now = Date.now();
  const safeIncome = Math.max(0, baseIncome || 8500);
  const today = new Date().toISOString().slice(0, 10);

  const fixedBudget = Math.round(safeIncome * (preferences.fixedShare / 100));
  const savingsBudget = Math.round(safeIncome * (preferences.savingsShare / 100));
  const flexibleBudget = Math.max(1, safeIncome - fixedBudget - savingsBudget);

  const fixedCategories = [
    { name: "Housing", budget: Math.max(1, Math.round(fixedBudget * (preferences.housingBudget / 100))), icon: "home", color: "primary" as const },
    { name: "Utilities", budget: Math.max(1, Math.round(fixedBudget * 0.18)), icon: "water", color: "success" as const },
    { name: "Insurance", budget: Math.max(1, Math.round(fixedBudget * 0.12)), icon: "shield", color: "violet" as const },
    { name: "Phone & Internet", budget: Math.max(1, Math.round(fixedBudget * 0.1)), icon: "wifi", color: "primary" as const },
    { name: "Debt Payments", budget: Math.max(1, Math.round(fixedBudget * 0.12)), icon: "bank", color: "danger" as const },
    { name: "Subscriptions", budget: Math.max(1, Math.round(fixedBudget * 0.08)), icon: "bolt", color: "warn" as const },
  ];

  const variableCategories = [
    { name: "Groceries", budget: Math.max(1, Math.round(flexibleBudget * 0.3)), icon: "food", color: "warn" as const },
    { name: "Transport", budget: Math.max(1, Math.round(flexibleBudget * 0.15)), icon: "car", color: "primary" as const },
    { name: "Household", budget: Math.max(1, Math.round(flexibleBudget * 0.12)), icon: "home", color: "success" as const },
    { name: "Dining Out", budget: Math.max(1, Math.round(flexibleBudget * 0.1)), icon: "restaurant", color: "violet" as const },
    { name: "Health", budget: Math.max(1, Math.round(flexibleBudget * 0.08)), icon: "shield", color: "success" as const },
    { name: "Personal Care", budget: Math.max(1, Math.round(flexibleBudget * 0.08)), icon: "gift", color: "warn" as const },
    { name: "Entertainment", budget: Math.max(1, Math.round(flexibleBudget * 0.08)), icon: "sparkles", color: "violet" as const },
    { name: "Shopping", budget: Math.max(1, Math.round(flexibleBudget * 0.09)), icon: "cart", color: "primary" as const },
  ];

  fixedCategories.forEach((c, i) => {
    const ref = doc(categoriesRef(uid));
    batch.set(ref, {
      name: c.name,
      group: "fixed",
      budget: c.budget,
      icon: c.icon,
      color: c.color,
      recurring: true,
      createdAt: now + i,
    });
  });

  variableCategories.forEach((c, i) => {
    const ref = doc(categoriesRef(uid));
    batch.set(ref, {
      name: c.name,
      group: "variable",
      budget: c.budget,
      icon: c.icon,
      color: c.color,
      recurring: false,
      createdAt: now + 100 + i,
    });
  });

  batch.set(doc(savingsRef(uid)), {
    name: preferences.goalName || "Emergency fund",
    target: savingsBudget,
    current: 0,
    source: "Bank",
    achieved: false,
    createdAt: now + 200,
  });

  batch.set(doc(incomesRef(uid)), {
    name: preferences.incomeName || "Salary",
    amount: safeIncome,
    account: "home",
    date: today,
    recurring: true,
    createdAt: now + 300,
  });

  await batch.commit();
}

// --- Month settings (total budget / home vs wallet split) ---

export function subscribeMonth(
  uid: string,
  monthId: string,
  cb: (data: MonthSettings | null) => void
) {
  return onSnapshot(monthRef(uid, monthId), (snap) => {
    cb(snap.exists() ? ({ id: snap.id, ...snap.data() } as MonthSettings) : null);
  });
}

export function saveMonth(uid: string, data: MonthSettings) {
  return setDoc(monthRef(uid, data.id), data, { merge: true });
}

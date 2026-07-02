import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Category, Income, MonthSettings, SavingsGoal, Transaction } from "./types";
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

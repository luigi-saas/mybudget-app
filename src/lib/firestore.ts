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
} from "firebase/firestore";
import { db } from "./firebase";
import type { Category, MonthSettings, SavingsGoal, Transaction } from "./types";

// All data lives under /users/{uid}/... so each account only ever sees its own data.

const categoriesRef = (uid: string) => collection(db, "users", uid, "categories");
const transactionsRef = (uid: string) => collection(db, "users", uid, "transactions");
const savingsRef = (uid: string) => collection(db, "users", uid, "savings");
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

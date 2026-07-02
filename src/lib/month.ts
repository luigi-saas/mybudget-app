export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

export function monthKeyFromDate(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function daysInMonth(key: string): number {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function daysLeftInMonth(key: string): number {
  const today = new Date();
  const isCurrentMonth = key === currentMonthKey();
  if (!isCurrentMonth) return 0;
  return Math.max(1, daysInMonth(key) - today.getDate() + 1);
}

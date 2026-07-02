"use client";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-4 shadow-card ${className}`}>
      {children}
    </div>
  );
}

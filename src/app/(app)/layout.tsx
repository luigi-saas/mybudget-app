"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MonthProvider } from "@/lib/month-context";
import AppNav from "@/components/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <MonthProvider>
      <div className="flex min-h-screen bg-bg">
        <AppNav />
        <div className="flex-1 pb-20 md:pb-0">{children}</div>
      </div>
    </MonthProvider>
  );
}

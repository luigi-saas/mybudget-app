"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import type { IconKey } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

const links: { href: string; label: string; icon: IconKey }[] = [
  { href: "/dashboard", label: "Overview", icon: "sparkles" },
  { href: "/income", label: "Income", icon: "wallet" },
  { href: "/fixed", label: "Fixed", icon: "bolt" },
  { href: "/variable", label: "Variable", icon: "cart" },
  { href: "/savings", label: "Savings", icon: "piggy" },
  { href: "/history", label: "History", icon: "clock" },
];

// Mobile bottom bar keeps to 5 slots (standard tab-bar limit); History is
// reachable from the desktop sidebar and from a link on the Overview page.
const mobileLinks = links.filter((l) => l.href !== "/history");

export default function AppNav() {
  const pathname = usePathname();
  const { logOut, user } = useAuth();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface p-5 md:flex md:flex-col">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <Icon name="piggy" size={18} />
          </div>
          <span className="text-lg font-bold text-ink">Budgetly</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-light text-primary-dark"
                    : "text-muted hover:bg-bg hover:text-ink"
                }`}
              >
                <Icon name={l.icon} size={18} />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border pt-4">
          <p className="truncate px-2 text-xs text-muted">{user?.email}</p>
          <button
            onClick={logOut}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted hover:bg-bg hover:text-danger"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]">
        {mobileLinks.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                active ? "text-primary" : "text-muted"
              }`}
            >
              <Icon name={l.icon} size={20} />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

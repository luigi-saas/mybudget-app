"use client";

import * as Lucide from "lucide-react";

export default function LucideIcon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const map: Record<string, string> = {
    home: "Home",
    wallet: "CreditCard",
    clock: "Clock",
    cart: "ShoppingCart",
    piggy: "PiggyBank",
    bolt: "Zap",
    sparkles: "Sparkles",
    bank: "Bank",
    shield: "Shield",
    gift: "Gift",
    settings: "Settings",
    chart: "BarChart",
    users: "Users",
    user: "User",
    plus: "Plus",
    minus: "Minus",
  };

  const iconName = map[name] || (name.charAt(0).toUpperCase() + name.slice(1));
  const Comp = (Lucide as any)[iconName] || (Lucide as any)["Circle"];
  return <Comp size={size} className={className} />;
}

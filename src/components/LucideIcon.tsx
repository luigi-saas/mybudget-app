"use client";

import { useEffect, useState } from "react";
import FallbackIcon from "./Icon";

export default function LucideIcon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const [Comp, setComp] = useState<null | ((props: any) => JSX.Element)>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // dynamic import so app still runs if lucide-react is not installed
        // @ts-ignore: optional dependency, may not be installed in every environment
        const lib = await import("lucide-react");
        // map a few common names to lucide exports
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
        };
        const iconName = map[name] || (name.charAt(0).toUpperCase() + name.slice(1));
        const IconComp = (lib as any)[iconName];
        if (mounted && IconComp) setComp(() => IconComp);
      } catch (err) {
        // leave Comp null and fallback to local icons
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [name]);

  if (Comp) return <Comp size={size} className={className} />;
  // fallback to existing inline icon set
  // `FallbackIcon` expects `name` matching IconKey types, cast to any
  return <FallbackIcon name={name as any} size={size} className={className} />;
}

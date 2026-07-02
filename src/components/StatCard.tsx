import LucideIcon from "./LucideIcon";
import type { CategoryColor, IconKey } from "@/lib/types";
import { colorTokens } from "@/lib/colors";

export default function StatCard({
  label,
  value,
  icon,
  color = "primary",
}: {
  label: string;
  value: string;
  icon: IconKey;
  color?: CategoryColor;
}) {
  const tokens = colorTokens[color];
  return (
    <div className="rounded-2xl bg-surface p-5 shadow-card border border-border">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tokens.bg} ${tokens.text}`}> 
        <LucideIcon name={icon} size={20} />
      </div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-ink leading-tight">{value}</p>
    </div>
  );
}

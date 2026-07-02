import Icon from "./Icon";
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
    <div className="rounded-xl bg-surface p-5 shadow-card border border-border">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${tokens.bg} ${tokens.text}`}>
        <Icon name={icon} size={18} />
      </div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

export default function ProgressBar({
  value,
  barClass = "bg-primary",
  trackClass = "bg-bg",
}: {
  value: number; // 0-100
  barClass?: string;
  trackClass?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full rounded-full ${trackClass}`}>
      <div
        className={`h-2 rounded-full ${barClass} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function ChartCard({
  title = "Spending breakdown",
  data,
}: {
  title?: string;
  data?: { label: string; value: number }[];
}) {
  const items = (data || []).filter((d) => d.value > 0).slice(0, 8);
  const total = items.reduce((s, i) => s + i.value, 0) || 0;
  const colors = ["#2563EB", "#16A34A", "#F59E0B", "#7C3AED", "#EF4444", "#06B6D4", "#F472B6", "#A78BFA"];

  const chartData = items.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: colors[index % colors.length],
  }));

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-muted">Total {Math.round(total).toLocaleString()}</p>
      </div>

      <div className="mt-4 h-64">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border bg-bg text-sm text-muted">
            No spending data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={4}
                stroke="transparent"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") {
                    return [`${value.toLocaleString()}`, "Amount"];
                  }
                  return ["—", "Amount"];
                }}
                contentStyle={{
                  background: "#fff",
                  borderRadius: 16,
                  borderColor: "#E5E7EB",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: 16 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

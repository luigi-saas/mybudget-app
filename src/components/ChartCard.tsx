"use client";

import React from "react";

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y, "L", cx, cy, "Z"].join(" ");
  return d;
}

export default function ChartCard({ data }: { data?: { label: string; value: number }[] }) {
  const items = (data || []).filter((d) => d.value > 0).slice(0, 8);
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const colors = ["#2563EB", "#16A34A", "#F59E0B", "#7C3AED", "#EF4444", "#06B6D4", "#F472B6", "#A78BFA"];

  let angle = 0;
  const arcs = items.map((it, idx) => {
    const valuePct = (it.value / total) * 360;
    const start = angle;
    const end = angle + valuePct;
    angle = end;
    return { d: describeArc(60, 60, 50, start, end), color: colors[idx % colors.length], label: it.label, value: it.value };
  });

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
      <p className="text-sm text-muted">Spending breakdown</p>
      <div className="mt-3 flex items-center gap-4">
        <svg width={140} height={120} viewBox="0 0 140 120">
          <g transform="translate(10,10)">
            {arcs.map((a, i) => (
              <path key={i} d={a.d} fill={a.color} stroke="#fff" strokeWidth={1} />
            ))}
            <circle cx={60} cy={60} r={28} fill="#fff" />
            <text x={60} y={64} textAnchor="middle" className="text-xs" style={{ fontSize: 12, fill: "#0F172A" }}>
              {Math.round(total).toLocaleString()}
            </text>
          </g>
        </svg>

        <div className="flex-1">
          {arcs.map((a, i) => (
            <div key={i} className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{ backgroundColor: a.color }} className="h-3 w-3 rounded-full inline-block" />
                <span className="text-sm text-ink">{a.label}</span>
              </div>
              <span className="text-sm font-medium text-ink">{a.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

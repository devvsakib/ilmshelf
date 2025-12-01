// src/components/AnalyticsPage.jsx
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Simple no-deps chart helpers (SVG)
 */

/* horizontal bar chart for money by shelf */
function MoneyByShelf({ data }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.name}>
          <div className="flex justify-between text-sm mb-1">
            <div className="font-medium text-slate-700">{d.name}</div>
            <div className="text-sm text-slate-600">৳{d.total}</div>
          </div>
          <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-emerald-600"
              style={{ width: `${(d.total / max) * 100}%`, transition: "width .4s" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* simple pie chart using path arcs */
function PieChart({ data, size = 160, inner = 40 }) {
  const radius = size / 2;
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  let cumulative = 0;

  function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  }

  const colors = ["#16a34a", "#0ea5a3", "#2563eb", "#c026d3", "#f59e0b", "#ef4444"];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {data.map((d, i) => {
        const value = d.value || 0;
        const startAngle = (cumulative / total) * 360;
        cumulative += value;
        const endAngle = (cumulative / total) * 360;
        const path = describeArc(radius, radius, radius - 2, startAngle, endAngle);
        return <path key={d.name} d={path} fill={colors[i % colors.length]} stroke="white" strokeWidth="1" />;
      })}
      {/* donut hole */}
      <circle cx={radius} cy={radius} r={inner} fill="#ffffff" />
    </svg>
  );
}

/* simple vertical bar chart for average pages */
function VerticalBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.avg), 1);
  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((d) => (
        <div key={d.name} className="flex-1 text-center">
          <div
            className="mx-auto bg-sky-600 rounded-t transition-all"
            style={{ height: `${(d.avg / max) * 100}%`, width: 24 }}
            title={`${d.name}: ${d.avg}`}
          />
          <div className="text-xs mt-2 text-slate-600 truncate">{d.name}</div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage({ books = [], shelves = [] }) {
  const moneyByShelf = useMemo(() => {
    const map = {};
    shelves.forEach((s) => (map[s.id] = { name: s.name, total: 0 }));
    books.forEach((b) => {
      const sid = b.shelfId || "unsorted";
      if (!map[sid]) map[sid] = { name: sid, total: 0 };
      map[sid].total += Number(b.price) || 0;
    });
    return Object.values(map);
  }, [books, shelves]);

  const byStatus = useMemo(() => {
    const map = {};
    books.forEach((b) => {
      const s = b.readStatus || "UNKNOWN";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([k, v]) => ({ name: k.replace("_", " "), value: v }));
  }, [books]);

  const avgPagesByShelf = useMemo(() => {
    const map = {};
    shelves.forEach((s) => (map[s.id] = { name: s.name, totalPages: 0, count: 0 }));
    books.forEach((b) => {
      const sid = b.shelfId || "unsorted";
      if (!map[sid]) map[sid] = { name: sid, totalPages: 0, count: 0 };
      map[sid].totalPages += Number(b.pages) || 0;
      map[sid].count += 1;
    });
    return Object.values(map).map((m) => ({ name: m.name, avg: m.count ? Math.round(m.totalPages / m.count) : 0 }));
  }, [books, shelves]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm font-medium">Money spent by shelf</div>
              <div className="text-sm text-slate-600">Total: ৳{moneyByShelf.reduce((s, x) => s + x.total, 0)}</div>
            </div>
            <MoneyByShelf data={moneyByShelf} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm font-medium mb-3">Books by reading status</div>
            <div className="flex items-center justify-center">
              <PieChart data={byStatus} size={200} inner={50} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {byStatus.map((s, i) => (
                <div key={s.name} className="text-sm flex items-center gap-2">
                  <span style={{ width: 12, height: 12, background: ["#16a34a", "#0ea5a3", "#2563eb", "#c026d3", "#f59e0b", "#ef4444"][i % 6] }} className="inline-block rounded-sm" />
                  <span className="text-slate-600">{s.name} — {s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent>
            <div className="text-sm font-medium mb-3">Average pages per book (by shelf)</div>
            <VerticalBarChart data={avgPagesByShelf} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

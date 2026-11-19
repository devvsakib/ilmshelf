import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Archival SVG palette matching index.css design tokens
const ARCHIVAL_CHART_COLORS = [
  '#1B4332', // Botanical Forest
  '#9A6B26', // Burnished Ochre
  '#334E68', // Slate Indigo
  '#9E2A2B', // Terracotta
  '#5C6B54', // Olive Stone
  '#7F5539', // Warm Umber
];

/* Horizontal bar chart for expenditure by shelf */
function MoneyByShelf({ data, isAdmin = false }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  if (!data.length) {
    return <p className="text-xs text-muted-foreground py-8 text-center">No shelf data available.</p>;
  }

  return (
    <div className="space-y-3.5">
      {data.map((d) => (
        <div key={d.name}>
          <div className="flex justify-between items-baseline text-sm mb-1.5 gap-2">
            <span className="font-bn-body font-medium text-foreground truncate">
              {d.name}
            </span>
            <span className="font-mono text-xs font-semibold text-foreground tabular-nums shrink-0">
              {isAdmin ? `৳${d.total.toLocaleString()}` : '--'}
            </span>
          </div>
          <div className="bg-secondary border border-border/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: isAdmin ? `${(d.total / max) * 100}%` : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Donut chart using SVG path arcs with CSS-token center cutout */
function DonutChart({ data, size = 180, inner = 52 }) {
  const radius = size / 2;
  const total = data.reduce((s, d) => s + (d.value || 0), 0);

  if (total === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground">
        No books indexed yet
      </div>
    );
  }

  let cumulative = 0;

  function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  function describeArc(cx, cy, r, startAngle, endAngle) {
    // Handle 100% single-slice edge case cleanly
    if (endAngle - startAngle >= 359.99) {
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
    }
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  }

  return (
    <div className="relative inline-flex items-center justify-center mx-auto">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const value = d.value || 0;
          if (value === 0) return null;
          const startAngle = (cumulative / total) * 360;
          cumulative += value;
          const endAngle = (cumulative / total) * 360;
          const path = describeArc(radius, radius, radius - 2, startAngle, endAngle);
          return (
            <path
              key={d.name}
              d={path}
              fill={ARCHIVAL_CHART_COLORS[i % ARCHIVAL_CHART_COLORS.length]}
              stroke="var(--card)"
              strokeWidth="2"
            />
          );
        })}
        <circle cx={radius} cy={radius} r={inner} fill="var(--card)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-xl font-bold text-foreground tabular-nums">
          {total}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Volumes
        </span>
      </div>
    </div>
  );
}

/* Vertical bar chart for average pages per volume */
function VerticalBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.avg), 1);

  if (!data.length) {
    return <p className="text-xs text-muted-foreground py-8 text-center">No page data available.</p>;
  }

  return (
    <div className="flex items-end gap-4 h-44 pt-6 border-b border-border px-2">
      {data.map((d) => {
        const heightPct = Math.max(4, Math.round((d.avg / max) * 100));
        return (
          <div key={d.name} className="flex-1 flex flex-col items-center h-full justify-end group">
            <span className="font-mono text-[11px] font-medium text-muted-foreground group-hover:text-foreground tabular-nums mb-1.5 transition-colors">
              {d.avg}p
            </span>
            <div
              className="w-7 sm:w-9 bg-ochre/85 group-hover:bg-ochre rounded-t-[4px] transition-all duration-300"
              style={{ height: `${heightPct}%` }}
              title={`${d.name}: ${d.avg} pages avg`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage({ books = [], shelves = [], isAdmin = false }) {
  const moneyByShelf = useMemo(() => {
    const map = {};
    shelves.forEach((s) => (map[s.id] = { name: s.name, total: 0 }));
    books.forEach((b) => {
      const sid = b.shelfId || 'unsorted';
      if (!map[sid]) map[sid] = { name: sid, total: 0 };
      map[sid].total += Number(b.price) || 0;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [books, shelves]);

  const byStatus = useMemo(() => {
    const labels = {
      COMPLETED: 'Completed',
      IN_PROGRESS: 'In Progress',
      NOT_STARTED: 'Not Started',
    };
    const map = {};
    books.forEach((b) => {
      const raw = (b.readStatus || 'NOT_STARTED').toUpperCase();
      const label = labels[raw] || raw.replace('_', ' ');
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [books]);

  const avgPagesByShelf = useMemo(() => {
    const map = {};
    shelves.forEach((s) => (map[s.id] = { name: s.name, totalPages: 0, count: 0 }));
    books.forEach((b) => {
      const sid = b.shelfId || 'unsorted';
      if (!map[sid]) map[sid] = { name: sid, totalPages: 0, count: 0 };
      map[sid].totalPages += Number(b.pages) || 0;
      map[sid].count += 1;
    });
    return Object.values(map).map((m) => ({
      name: m.name,
      avg: m.count ? Math.round(m.totalPages / m.count) : 0,
    }));
  }, [books, shelves]);

  const totalSpent = moneyByShelf.reduce((s, x) => s + x.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Editorial Header */}
      <header className="pb-5 border-b border-border">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Collection Insights
        </p>
        <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mt-1">
          Library Analytics
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expenditure by Shelf */}
        <Card className="bg-card border-border shadow-2xs rounded-lg">
          <CardContent className="p-5 sm:p-6">
            <div className="flex justify-between items-baseline pb-3 mb-4 border-b border-border">
              <div>
                <h3 className="font-editorial text-base font-semibold text-foreground">
                  Expenditure by Shelf
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Acquisition spend across categories
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                Total: {isAdmin ? `৳${totalSpent.toLocaleString()}` : '--'}
              </span>
            </div>
            <MoneyByShelf data={moneyByShelf} isAdmin={isAdmin} />
          </CardContent>
        </Card>

        {/* Status Donut Distribution */}
        <Card className="bg-card border-border shadow-2xs rounded-lg">
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between">
            <div className="pb-3 mb-4 border-b border-border">
              <h3 className="font-editorial text-base font-semibold text-foreground">
                Volumes by Reading Status
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Share of completed, active, and unread books
              </p>
            </div>

            <div className="flex items-center justify-center py-2">
              <DonutChart data={byStatus} size={184} inner={54} />
            </div>

            <div className="mt-4 pt-3 border-t border-border flex flex-wrap justify-center gap-x-5 gap-y-2">
              {byStatus.map((s, i) => (
                <div key={s.name} className="text-xs flex items-center gap-2">
                  <span
                    style={{
                      backgroundColor:
                        ARCHIVAL_CHART_COLORS[i % ARCHIVAL_CHART_COLORS.length],
                    }}
                    className="w-2.5 h-2.5 inline-block rounded-[2px]"
                  />
                  <span className="text-muted-foreground">{s.name}:</span>
                  <span className="font-mono font-semibold text-foreground tabular-nums">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average Pages per Book */}
        <Card className="md:col-span-2 bg-card border-border shadow-2xs rounded-lg">
          <CardContent className="p-5 sm:p-6">
            <div className="pb-3 mb-2 border-b border-border">
              <h3 className="font-editorial text-base font-semibold text-foreground">
                Average Volume Length by Shelf
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mean page count per book within each shelf
              </p>
            </div>

            <VerticalBarChart data={avgPagesByShelf} />

            {/* X-Axis Labels */}
            {avgPagesByShelf.length > 0 && (
              <div className="flex gap-4 px-2 pt-2.5">
                {avgPagesByShelf.map((d) => (
                  <div
                    key={d.name}
                    className="flex-1 text-center font-bn-body text-xs text-muted-foreground truncate"
                    title={d.name}
                  >
                    {d.name}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
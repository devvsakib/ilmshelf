import {
    IconBooks,
    IconCoin,
    IconFileText,
    IconBookmark,
    IconCheck,
    IconClock,
    IconCircleDashed,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

function SummaryPage({ books = [] }) {
    const totalBooks = books.length;
    const totalSpent = books.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    const totalPages = books.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);
    const avgPrice = totalBooks > 0 ? Math.round(totalSpent / totalBooks) : 0;

    const byStatus = books.reduce((acc, b) => {
        const status = (b.readStatus || 'NOT_STARTED').toUpperCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const completedCount = byStatus['COMPLETED'] || 0;
    const inProgressCount = byStatus['IN_PROGRESS'] || 0;
    const notStartedCount = byStatus['NOT_STARTED'] || 0;

    const statusRows = [
        {
            label: 'Completed',
            sublabel: 'Finished reading & archived',
            value: completedCount,
            barClass: 'bg-primary',
            dotClass: 'bg-primary',
            icon: IconCheck,
        },
        {
            label: 'In Progress',
            sublabel: 'Currently active on the desk',
            value: inProgressCount,
            barClass: 'bg-ochre',
            dotClass: 'bg-ochre',
            icon: IconClock,
        },
        {
            label: 'Not Started',
            sublabel: 'Queued in library shelves',
            value: notStartedCount,
            barClass: 'bg-muted-foreground/45',
            dotClass: 'bg-muted-foreground/50',
            icon: IconCircleDashed,
        },
    ];

    // Top publishers breakdown for archival insight
    const topPublishers = Object.entries(
        books.reduce((acc, b) => {
            const pub = b.authors?.publisher?.trim();
            if (pub) acc[pub] = (acc[pub] || 0) + 1;
            return acc;
        }, {})
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const kpiMetrics = [
        {
            label: 'Total Indexed',
            value: totalBooks.toLocaleString(),
            caption: `${completedCount} completed · ${inProgressCount} active`,
            icon: IconBooks,
            accent: false,
        },
        {
            label: 'Archive Valuation',
            value: `৳${totalSpent.toLocaleString()}`,
            caption: `Avg ৳${avgPrice.toLocaleString()} per volume`,
            icon: IconCoin,
            accent: true,
        },
        {
            label: 'Total Extent',
            value: totalPages.toLocaleString(),
            caption: totalBooks > 0 ? `Avg ${Math.round(totalPages / totalBooks)} pages/vol` : '0 pages',
            icon: IconFileText,
            accent: false,
        },
        {
            label: 'Completion Rate',
            value: `${totalBooks > 0 ? Math.round((completedCount / totalBooks) * 100) : 0}%`,
            caption: `${completedCount} of ${totalBooks} volumes read`,
            icon: IconBookmark,
            accent: false,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Editorial Header */}
            <header className="pb-5 border-b border-border">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Archive Ledger
                </p>
                <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mt-1">
                    Collection Summary
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Reading progress, total page extent, and acquisition valuation across your personal library.
                </p>
            </header>

            {/* Hairline KPI Grid */}
            <section
                aria-label="Key archive metrics"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-card border border-border rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-border shadow-2xs"
            >
                {kpiMetrics.map(({ label, value, caption, icon: Icon, accent }) => (
                    <div key={label} className="p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                {label}
                            </span>
                            <Icon size={16} stroke={1.75} className="text-muted-foreground/75" />
                        </div>
                        <div
                            className={cn(
                                'font-mono text-2xl sm:text-3xl font-bold tabular-nums mt-3',
                                accent ? 'text-primary' : 'text-foreground'
                            )}
                        >
                            {value}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 tabular-nums">
                            {caption}
                        </p>
                    </div>
                ))}
            </section>

            {/* Two-Column Breakdown: Reading Progress & Top Publishers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reading Progress Ledger */}
                <section className="lg:col-span-2 bg-card border border-border rounded-lg p-5 sm:p-6 space-y-5">
                    <div className="flex items-baseline justify-between pb-3 border-b border-border">
                        <div>
                            <h2 className="font-editorial text-lg font-semibold text-foreground">
                                Reading Progress
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Distribution of volumes by study status
                            </p>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            {totalBooks} total
                        </span>
                    </div>

                    {/* Segmented Proportional Bar */}
                    {totalBooks > 0 && (
                        <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden flex gap-0.5 p-0.5 border border-border/70">
                            {statusRows.map((row) => {
                                const pct = (row.value / totalBooks) * 100;
                                if (pct <= 0) return null;
                                return (
                                    <div
                                        key={row.label}
                                        style={{ width: `${pct}%` }}
                                        className={cn('h-full rounded-full transition-all duration-500', row.barClass)}
                                        title={`${row.label}: ${row.value}`}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Detailed Status Rows */}
                    <div className="divide-y divide-border">
                        {statusRows.map((row) => {
                            const percentage =
                                totalBooks > 0 ? ((row.value / totalBooks) * 100).toFixed(1) : '0.0';
                            return (
                                <div
                                    key={row.label}
                                    className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', row.dotClass)} />
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-foreground">
                                                {row.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {row.sublabel}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0 tabular-nums">
                                        <span className="font-mono text-sm font-semibold text-foreground">
                                            {row.value}
                                        </span>
                                        <span className="font-mono text-xs text-muted-foreground ml-2">
                                            ({percentage}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Top Publishers Ledger */}
                <section className="bg-card border border-border rounded-lg p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="pb-3 mb-4 border-b border-border">
                            <h2 className="font-editorial text-lg font-semibold text-foreground">
                                Top Publishers
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Most represented houses in your archive
                            </p>
                        </div>

                        {topPublishers.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-8 text-center">
                                Add publisher details to volumes to see distribution here.
                            </p>
                        ) : (
                            <ul className="divide-y divide-border">
                                {topPublishers.map(([publisher, count], idx) => (
                                    <li
                                        key={publisher}
                                        className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="font-mono text-[11px] text-muted-foreground tabular-nums w-4">
                                                {idx + 1}.
                                            </span>
                                            <span className="font-bn-body text-sm text-foreground truncate">
                                                {publisher}
                                            </span>
                                        </div>
                                        <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-secondary border border-border text-foreground tabular-nums shrink-0">
                                            {count}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SummaryPage;
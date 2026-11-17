import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  IconBookmark,
  IconBooks,
  IconArrowUpRight,
  IconCheck,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// Explicit Tailwind-safe accents so dynamic color names never break in production builds
const SHELF_ACCENTS = {
  emerald: {
    dot: 'bg-primary',
    badge: 'bg-primary/10 text-primary border-primary/25',
  },
  amber: {
    dot: 'bg-ochre',
    badge: 'bg-ochre/12 text-ochre border-ochre/30',
  },
  blue: {
    dot: 'bg-[#1E3A5F]',
    badge: 'bg-[#1E3A5F]/10 text-[#1E3A5F] dark:text-[#7FA6D6] border-[#1E3A5F]/25',
  },
  rose: {
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive border-destructive/25',
  },
  slate: {
    dot: 'bg-foreground/70',
    badge: 'bg-secondary text-foreground border-border',
  },
};

function getShelfAccent(color) {
  return SHELF_ACCENTS[color?.toLowerCase()] || SHELF_ACCENTS.emerald;
}

function ShelvesPage({ shelves = [], books = [] }) {
  const navigate = useNavigate();

  const totalCatalogBooks = books.length;
  const totalCatalogValue = books.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Editorial Section Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-border">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Library Taxonomy
          </p>
          <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mt-1">
            Curated Shelves
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize volumes by subject, discipline, or study track.
          </p>
        </div>

        {/* Aggregate Summary Strip */}
        <div className="flex items-center gap-6 text-xs sm:text-sm bg-card border border-border rounded-md px-4 py-2.5 self-start sm:self-auto">
          <div>
            <span className="text-muted-foreground">Shelves: </span>
            <span className="font-mono font-semibold text-foreground tabular-nums">
              {shelves.length}
            </span>
          </div>
          <span className="h-3.5 w-px bg-border" />
          <div>
            <span className="text-muted-foreground">Indexed: </span>
            <span className="font-mono font-semibold text-foreground tabular-nums">
              {totalCatalogBooks}
            </span>
          </div>
          <span className="h-3.5 w-px bg-border" />
          <div>
            <span className="text-muted-foreground">Valuation: </span>
            <span className="font-mono font-semibold text-primary tabular-nums">
              ৳{totalCatalogValue.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Shelves Grid */}
      {!shelves.length ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/60 border border-dashed border-border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground mb-4">
            <IconBooks size={22} stroke={1.6} />
          </div>
          <h2 className="font-editorial text-lg font-medium text-foreground">
            No shelves configured yet
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Create subject shelves to categorize your library volumes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {shelves.map((shelf, idx) => {
            const shelfBooks = books.filter((b) => b.shelfId === shelf.id);
            const totalValue = shelfBooks.reduce(
              (sum, b) => sum + (Number(b.price) || 0),
              0
            );
            const completedCount = shelfBooks.filter(
              (b) => (b.readStatus || '').toUpperCase() === 'COMPLETED'
            ).length;
            const completionPct =
              shelfBooks.length > 0
                ? Math.round((completedCount / shelfBooks.length) * 100)
                : 0;

            const accent = getShelfAccent(shelf.color);
            const shelfNo = String(idx + 1).padStart(2, '0');

            return (
              <motion.article
                key={shelf.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                onClick={() => navigate(`/shelf/${shelf.id}`)}
                className="group flex flex-col justify-between bg-card border border-border hover:border-primary/45 rounded-lg p-5 transition-all duration-200 hover:shadow-[0_6px_20px_-6px_rgba(28,25,23,0.12)] cursor-pointer"
              >
                {/* Top: Shelf Index, Icon & Description */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] tracking-wider text-muted-foreground tabular-nums">
                      SHELF · {shelfNo}
                    </span>

                    <div
                      className={cn(
                        'w-8 h-8 rounded-md border flex items-center justify-center transition-transform duration-200 group-hover:scale-105',
                        accent.badge
                      )}
                    >
                      <IconBookmark size={16} stroke={1.8} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bn-title text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {shelf.name}
                    </h2>
                    <IconArrowUpRight
                      size={16}
                      className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
                    />
                  </div>

                  {shelf.description && (
                    <p className="font-bn-body text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {shelf.description}
                    </p>
                  )}
                </div>

                {/* Bottom: Completion Hairline & Ledger Metrics */}
                <div className="mt-5 pt-4 border-t border-border space-y-3">
                  {/* Subtle Reading Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <IconCheck size={12} className="text-primary" />
                        <span>
                          {completedCount} of {shelfBooks.length} read
                        </span>
                      </span>
                      <span className="font-mono tabular-nums">
                        {completionPct}%
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Volume Count & Valuation */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="font-mono text-xl font-bold text-foreground tabular-nums">
                        {shelfBooks.length}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        {shelfBooks.length === 1 ? 'volume' : 'volumes'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-base font-semibold text-primary tabular-nums">
                        ৳{totalValue.toLocaleString()}
                      </span>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                        Value
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShelvesPage;
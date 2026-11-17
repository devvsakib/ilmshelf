import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconArrowLeft,
    IconBookmark,
    IconLoader2,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import BookList from './BookList';

function ShelfDetail({ books = [], shelves = [], shelfId, onOpen, isCoverHidden, isLoading = false }) {
    const navigate = useNavigate();
    const [hydrationTimedOut, setHydrationTimedOut] = useState(false);

    const shelf = shelves.find((s) => s.id === shelfId);

    // Prevent premature "Shelf not found" flash while parent store hydrates
    useEffect(() => {
        if (shelf) {
            setHydrationTimedOut(false);
            return;
        }
        const timer = setTimeout(() => setHydrationTimedOut(true), 2500);
        return () => clearTimeout(timer);
    }, [shelf, shelfId]);

    if (!shelf && (isLoading || (!hydrationTimedOut && shelves.length === 0))) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-muted-foreground gap-2.5">
                <IconLoader2 size={22} className="animate-spin text-primary" />
                <span className="font-mono text-xs uppercase tracking-widest">
                    Loading Shelf Archive...
                </span>
            </div>
        );
    }

    if (!shelf) {
        return (
            <div className="max-w-xl mx-auto my-16 px-4">
                <div className="bg-card border border-border rounded-lg p-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                        <IconBookmark size={22} stroke={1.6} />
                    </div>
                    <h2 className="font-editorial text-xl font-medium text-foreground">
                        Shelf not found
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 mb-6">
                        This shelf does not exist or may have been removed.
                    </p>
                    <Button
                        onClick={() => navigate('/shelves')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Back to All Shelves
                    </Button>
                </div>
            </div>
        );
    }

    const shelfBooks = books.filter((b) => b.shelfId === shelfId);
    const totalValue = shelfBooks.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    const totalPages = shelfBooks.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);
    const completedCount = shelfBooks.filter(
        (b) => (b.readStatus || '').toUpperCase() === 'COMPLETED'
    ).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Back Navigation */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => navigate('/shelves')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <IconArrowLeft size={16} />
                    <span>All Shelves</span>
                </button>
            </div>

            {/* Editorial Shelf Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 mb-6 border-b border-border">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary mb-1.5">
                        <IconBookmark size={13} />
                        <span>Shelf Collection</span>
                    </div>
                    <h1 className="font-bn-title text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        {shelf.name}
                    </h1>
                    {shelf.description && (
                        <p className="font-bn-body text-sm text-muted-foreground mt-1.5 leading-relaxed">
                            {shelf.description}
                        </p>
                    )}
                </div>

                {/* Hairline Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 bg-card border border-border rounded-md divide-x divide-y sm:divide-y-0 divide-border self-start lg:self-auto">
                    <div className="px-4 py-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Volumes
                        </div>
                        <div className="font-mono text-base font-bold text-foreground tabular-nums mt-0.5">
                            {shelfBooks.length}
                        </div>
                    </div>

                    <div className="px-4 py-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Completed
                        </div>
                        <div className="font-mono text-base font-bold text-foreground tabular-nums mt-0.5">
                            {completedCount}/{shelfBooks.length}
                        </div>
                    </div>

                    <div className="px-4 py-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Total Pages
                        </div>
                        <div className="font-mono text-base font-bold text-foreground tabular-nums mt-0.5">
                            {totalPages.toLocaleString()}
                        </div>
                    </div>

                    <div className="px-4 py-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Valuation
                        </div>
                        <div className="font-mono text-base font-bold text-primary tabular-nums mt-0.5">
                            ৳{totalValue.toLocaleString()}
                        </div>
                    </div>
                </div>
            </header>

            {/* Shelf Volumes (inherits Shelf Grid + Catalog Ledger toggle from BookList) */}
            <BookList books={shelfBooks} onOpen={onOpen} isCoverHidden={isCoverHidden} />
        </div>
    );
}

export default ShelfDetail;
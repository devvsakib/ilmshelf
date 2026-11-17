import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    IconBooks,
    IconLayoutGrid,
    IconListDetails,
    IconBookmark,
    IconChevronRight,
    IconLock,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import BookCard from './BookCard';

function BookList({ books = [], onOpen, isCoverHidden }) {
    const [viewMode, setViewMode] = useState('shelf'); // 'shelf' | 'ledger'

    // Press "G" outside inputs to toggle between Shelf Grid and Catalog Ledger
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                (e.key === 'g' || e.key === 'G') &&
                !e.metaKey &&
                !e.ctrlKey &&
                !e.altKey &&
                !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
            ) {
                e.preventDefault();
                setViewMode((prev) => (prev === 'shelf' ? 'ledger' : 'shelf'));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!books?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/60 border border-dashed border-border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4 border border-border">
                    <IconBooks size={22} stroke={1.6} />
                </div>
                <h3 className="font-editorial text-lg font-medium text-foreground">
                    No volumes found in this view
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Try adjusting your search query, clearing active shelf filters, or cataloging a new book.
                </p>
            </div>
        );
    }

    return (
        <section aria-label="Book Catalog" className="space-y-4">
            {/* Compact Sub-Toolbar: Count & View Mode Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="tabular-nums font-medium text-foreground">
                        {books.length}
                    </span>
                    <span>{books.length === 1 ? 'volume indexed' : 'volumes indexed'}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-muted-foreground mr-1">
                        Press
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-secondary border border-border rounded">
                            G
                        </kbd>
                        to switch view
                    </span>

                    <div
                        role="group"
                        aria-label="View mode"
                        className="inline-flex items-center p-0.5 rounded-md bg-secondary/80 border border-border"
                    >
                        <button
                            type="button"
                            onClick={() => setViewMode('shelf')}
                            className={cn(
                                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-medium transition-all',
                                viewMode === 'shelf'
                                    ? 'bg-card text-foreground shadow-2xs border border-border/80'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <IconLayoutGrid size={14} stroke={1.8} />
                            <span>Shelf</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('ledger')}
                            className={cn(
                                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-medium transition-all',
                                viewMode === 'ledger'
                                    ? 'bg-card text-foreground shadow-2xs border border-border/80'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <IconListDetails size={14} stroke={1.8} />
                            <span>Ledger</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* View 1: Cloth-Bound Shelf Grid */}
            {viewMode === 'shelf' ? (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {books.map((book, idx) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                index={idx + 1}
                                onOpen={onOpen}
                                isCoverHidden={isCoverHidden}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                /* View 2: Archival Catalog Ledger Table */
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-secondary/45 text-[11px] uppercase tracking-[0.08em] text-muted-foreground font-medium">
                                    <th className="py-2.5 pl-4 pr-2 w-14">No.</th>
                                    <th className="py-2.5 px-3">Title & Author</th>
                                    <th className="py-2.5 px-3 hidden md:table-cell">Shelf</th>
                                    <th className="py-2.5 px-3 hidden sm:table-cell text-right">Pages</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 pl-2 pr-4 w-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm">
                                {books.map((book, idx) => {
                                    const catalogNo = String(idx + 1).padStart(3, '0');
                                    const primaryTitle =
                                        typeof book.title === 'object'
                                            ? book.title?.bn || book.title?.en
                                            : book.title;
                                    const secondarySlug =
                                        typeof book.title === 'object' && book.title?.bn && book.title?.en
                                            ? book.title.en
                                            : null;

                                    const writer = book.authors?.writter || book.authors?.writer;
                                    const translator = book.authors?.translator;
                                    const totalPages = Number(book.pages || 0);
                                    const currentPage = Number(book.currentPage || 0);
                                    const progressPct =
                                        totalPages > 0 && currentPage > 0
                                            ? Math.min(100, Math.round((currentPage / totalPages) * 100))
                                            : 0;

                                    const status = (book.readStatus || 'NOT_STARTED').toUpperCase();
                                    const isCompleted = status === 'COMPLETED';
                                    const isReading = status === 'IN_PROGRESS';

                                    return (
                                        <tr
                                            key={book.id}
                                            onClick={() => onOpen?.(book)}
                                            className="group hover:bg-secondary/40 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 pl-4 pr-2 font-mono text-xs text-muted-foreground tabular-nums align-top">
                                                #{catalogNo}
                                            </td>

                                            <td className="py-3 px-3 align-top">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bn-title font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                        {primaryTitle}
                                                    </span>
                                                    {book.private && (
                                                        <IconLock
                                                            size={13}
                                                            className="text-muted-foreground shrink-0"
                                                            title="Private volume"
                                                        />
                                                    )}
                                                </div>

                                                {secondarySlug && (
                                                    <div className="font-mono text-[11px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                                                        {secondarySlug}
                                                    </div>
                                                )}

                                                {(writer || translator) && (
                                                    <div className="font-bn-body text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                        {writer}
                                                        {translator ? ` · অনুবাদ: ${translator}` : ''}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-3 px-3 hidden md:table-cell align-top">
                                                {book.shelfId ? (
                                                    <span className="inline-flex items-center gap-1 text-xs capitalize text-muted-foreground bg-secondary/70 border border-border px-2 py-0.5 rounded">
                                                        <IconBookmark size={11} />
                                                        {book.shelfId}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/50">—</span>
                                                )}
                                            </td>

                                            <td className="py-3 px-3 hidden sm:table-cell text-right font-mono text-xs text-muted-foreground tabular-nums align-top">
                                                {totalPages > 0 ? (
                                                    <div>
                                                        <span className="text-foreground font-medium">
                                                            {currentPage > 0 ? `${currentPage}/` : ''}
                                                            {totalPages}p
                                                        </span>
                                                        {progressPct > 0 && (
                                                            <div className="text-[10px] text-primary">
                                                                {progressPct}%
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>

                                            <td className="py-3 px-3 align-top">
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded border whitespace-nowrap',
                                                        isCompleted
                                                            ? 'bg-primary/10 text-primary border-primary/25'
                                                            : isReading
                                                                ? 'bg-ochre/12 text-ochre border-ochre/30'
                                                                : 'bg-secondary text-muted-foreground border-border'
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'w-1.5 h-1.5 rounded-full',
                                                            isCompleted
                                                                ? 'bg-primary'
                                                                : isReading
                                                                    ? 'bg-ochre'
                                                                    : 'bg-muted-foreground/50'
                                                        )}
                                                    />
                                                    {isCompleted
                                                        ? 'Completed'
                                                        : isReading
                                                            ? 'In Progress'
                                                            : 'Not Started'}
                                                </span>
                                            </td>

                                            <td className="py-3 pl-2 pr-4 text-right align-middle">
                                                <IconChevronRight
                                                    size={15}
                                                    className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}

export default BookList;
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import {
    IconX,
    IconUsers,
    IconPlus,
    IconTrash,
    IconCheck,
    IconLoader2,
    IconSearch,
    IconChevronDown,
} from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'ilmshelf_loans';

function sanitizeName(value = '') {
    return String(value || '')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * API-Ready Persistence Adapter
 * Swap localStorage calls with your REST/FastAPI endpoints when ready.
 */
const lendingService = {
    async list() {
        // Future API: const res = await fetch('/api/loans'); return res.json();
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    },
    async create(loan) {
        // Future API: const res = await fetch('/api/loans', { method: 'POST', body: JSON.stringify(loan) }); return res.json();
        const current = await this.list();
        const next = [loan, ...current];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return loan;
    },
    async markReturned(id) {
        // Future API: const res = await fetch(`/api/loans/${id}/return`, { method: 'PATCH' }); return res.json();
        const returnDate = new Date().toISOString();
        const current = await this.list();
        const next = current.map((l) => (l.id === id ? { ...l, returnDate } : l));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return returnDate;
    },
    async remove(id) {
        // Future API: await fetch(`/api/loans/${id}`, { method: 'DELETE' });
        const current = await this.list();
        const next = current.filter((l) => l.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return id;
    },
};

/* Searchable Book Selector for large 100+ volume catalogs */
function SearchableBookSelect({ books = [], value, onChange }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const ref = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    useEffect(() => {
        if (open) {
            setQuery('');
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [open]);

    const selectedBook = books.find((b) => b.id === value);
    const selectedTitle = selectedBook
        ? selectedBook.title?.bn || selectedBook.title?.en
        : '';

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return books;
        return books.filter((b) => {
            const bn = (b.title?.bn || '').toLowerCase();
            const en = (b.title?.en || '').toLowerCase();
            const writer = (b.authors?.writter || '').toLowerCase();
            return bn.includes(q) || en.includes(q) || writer.includes(q);
        });
    }, [books, query]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className={cn(
                    'w-full h-9 px-3 pr-8 rounded-md border border-border bg-card hover:bg-secondary/40 text-left text-sm font-bn-body flex items-center justify-between transition-colors',
                    open && 'border-primary/60 ring-2 ring-primary/10',
                    !selectedTitle ? 'text-muted-foreground/75' : 'text-foreground'
                )}
            >
                <span className="truncate">
                    {selectedTitle || 'বই নির্বাচন করুন (Select volume)'}
                </span>
                <IconChevronDown
                    size={14}
                    className={cn(
                        'absolute right-2.5 text-muted-foreground transition-transform',
                        open && 'rotate-180'
                    )}
                />
            </button>

            {open && (
                <div className="absolute z-50 left-0 right-0 mt-1.5 bg-popover border border-border rounded-md shadow-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-2.5 py-2 border-b border-border bg-background/70">
                        <IconSearch size={14} className="text-muted-foreground shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="বই বা লেখকের নাম খুঁজুন..."
                            className="w-full bg-transparent text-xs font-bn-body text-foreground placeholder:text-muted-foreground/70 outline-none"
                        />
                    </div>

                    <div className="max-h-48 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-2 text-xs text-muted-foreground">
                                কোনো বই পাওয়া যায়নি
                            </p>
                        ) : (
                            filtered.map((b) => {
                                const title = b.title?.bn || b.title?.en || 'Untitled';
                                const isSelected = b.id === value;
                                return (
                                    <button
                                        key={b.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(b.id);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            'w-full px-3 py-1.5 text-left text-xs font-bn-body flex items-center justify-between gap-2 transition-colors',
                                            isSelected
                                                ? 'bg-primary/10 text-primary font-semibold'
                                                : 'text-foreground hover:bg-secondary'
                                        )}
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate">{title}</div>
                                            {b.authors?.writter && (
                                                <div className="text-[10px] text-muted-foreground truncate">
                                                    {b.authors.writter}
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <IconCheck size={13} className="text-primary shrink-0" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function LendingTracker({ books = [], onClose }) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [busyId, setBusyId] = useState(null);
    const [form, setForm] = useState({
        bookId: '',
        borrowerName: '',
        lentDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        let active = true;
        lendingService
            .list()
            .then((data) => {
                if (active) setLoans(data);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const addLoan = async (e) => {
        e?.preventDefault();
        const cleanBorrower = sanitizeName(form.borrowerName);
        if (!form.bookId || !cleanBorrower || submitting) return;

        const newLoan = {
            id: 'l' + Date.now(),
            bookId: form.bookId,
            borrowerName: cleanBorrower,
            lentDate: form.lentDate,
            returnDate: null,
        };

        try {
            setSubmitting(true);
            const saved = await lendingService.create(newLoan);
            setLoans((prev) => [saved, ...prev]);
            setForm({
                bookId: '',
                borrowerName: '',
                lentDate: new Date().toISOString().split('T')[0],
            });
        } finally {
            setSubmitting(false);
        }
    };

    const markReturned = async (id) => {
        if (busyId) return;
        try {
            setBusyId(id);
            const returnDate = await lendingService.markReturned(id);
            setLoans((prev) =>
                prev.map((loan) => (loan.id === id ? { ...loan, returnDate } : loan))
            );
        } finally {
            setBusyId(null);
        }
    };

    const deleteLoan = async (id) => {
        if (busyId) return;
        try {
            setBusyId(id);
            await lendingService.remove(id);
            setLoans((prev) => prev.filter((loan) => loan.id !== id));
        } finally {
            setBusyId(null);
        }
    };

    const activeLoans = loans.filter((l) => !l.returnDate);
    const returnedLoans = loans.filter((l) => l.returnDate);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.97, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.97, opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="px-6 py-4 bg-background border-b border-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-ochre/12 border border-ochre/25 text-ochre flex items-center justify-center">
                            <IconUsers size={17} stroke={1.9} />
                        </div>
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                Circulation Log
                            </p>
                            <h2 className="font-editorial text-xl font-semibold text-foreground leading-tight">
                                Lending Tracker
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                        aria-label="Close lending tracker"
                    >
                        <IconX size={18} />
                    </button>
                </header>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
                    {/* Hairline Summary Strip */}
                    <div className="grid grid-cols-2 bg-background border border-border rounded-md divide-x divide-border">
                        <div className="px-4 py-3">
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                                Currently Lent Out
                            </div>
                            <div className="font-mono text-2xl font-bold text-ochre tabular-nums mt-0.5">
                                {activeLoans.length}
                                <span className="font-sans text-xs font-normal text-muted-foreground ml-1.5">
                                    {activeLoans.length === 1 ? 'volume' : 'volumes'}
                                </span>
                            </div>
                        </div>
                        <div className="px-4 py-3">
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                                Returned to Shelf
                            </div>
                            <div className="font-mono text-2xl font-bold text-primary tabular-nums mt-0.5">
                                {returnedLoans.length}
                            </div>
                        </div>
                    </div>

                    {/* Record New Loan Form */}
                    <form
                        onSubmit={addLoan}
                        className="bg-background/80 border border-border rounded-md p-4 space-y-3"
                    >
                        <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                            Record New Loan
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                            <div className="sm:col-span-5">
                                <SearchableBookSelect
                                    books={books}
                                    value={form.bookId}
                                    onChange={(bookId) =>
                                        setForm((prev) => ({ ...prev, bookId }))
                                    }
                                />
                            </div>

                            <div className="sm:col-span-4">
                                <Input
                                    placeholder="গ্রহীতার নাম (Borrower) *"
                                    value={form.borrowerName}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            borrowerName: e.target.value,
                                        }))
                                    }
                                    className="font-bn-body h-9 bg-card border-border text-sm"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <Input
                                    type="date"
                                    value={form.lentDate}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, lentDate: e.target.value }))
                                    }
                                    className="h-9 bg-card border-border text-xs tabular-nums"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <Button
                                type="submit"
                                disabled={!form.bookId || !form.borrowerName.trim() || submitting}
                                className="h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium gap-1.5"
                            >
                                {submitting ? (
                                    <IconLoader2 size={14} className="animate-spin" />
                                ) : (
                                    <IconPlus size={14} />
                                )}
                                <span>Record Loan</span>
                            </Button>
                        </div>
                    </form>

                    {/* Active & Returned Circulation Lists */}
                    {loading ? (
                        <div className="py-10 flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <IconLoader2 size={20} className="animate-spin text-primary" />
                            <span className="font-mono text-xs">Loading circulation log...</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activeLoans.length > 0 && (
                                <section className="space-y-2.5">
                                    <h3 className="text-[11px] uppercase tracking-wider font-medium text-ochre">
                                        Currently Lent ({activeLoans.length})
                                    </h3>

                                    <div className="border border-border rounded-md divide-y divide-border bg-background/50 overflow-hidden">
                                        {activeLoans.map((loan) => {
                                            const book = books.find((b) => b.id === loan.bookId);
                                            const title =
                                                book?.title?.bn || book?.title?.en || 'Unknown Volume';
                                            const daysOut = Math.max(
                                                0,
                                                Math.floor(
                                                    (new Date() - new Date(loan.lentDate)) /
                                                    (1000 * 60 * 60 * 24)
                                                )
                                            );
                                            const isBusy = busyId === loan.id;

                                            return (
                                                <div
                                                    key={loan.id}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors"
                                                >
                                                    <div className="min-w-0">
                                                        <div className="font-bn-title text-sm font-semibold text-foreground truncate">
                                                            {title}
                                                        </div>
                                                        <div className="font-bn-body text-xs text-muted-foreground mt-0.5">
                                                            Borrowed by{' '}
                                                            <span className="font-semibold text-foreground">
                                                                {loan.borrowerName}
                                                            </span>
                                                            <span className="mx-1.5 text-border">•</span>
                                                            <span className="font-mono text-[11px] tabular-nums">
                                                                {new Date(
                                                                    loan.lentDate
                                                                ).toLocaleDateString()}{' '}
                                                                ({daysOut}d out)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={isBusy}
                                                            onClick={() => markReturned(loan.id)}
                                                            className="h-7 px-2.5 bg-card border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground text-xs gap-1"
                                                        >
                                                            <IconCheck size={13} />
                                                            <span>Returned</span>
                                                        </Button>

                                                        <button
                                                            type="button"
                                                            disabled={isBusy}
                                                            onClick={() => deleteLoan(loan.id)}
                                                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                            title="Delete record"
                                                        >
                                                            <IconTrash size={15} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {returnedLoans.length > 0 && (
                                <section className="space-y-2.5">
                                    <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                        Returned History ({returnedLoans.length})
                                    </h3>

                                    <div className="border border-border rounded-md divide-y divide-border bg-background/30 overflow-hidden">
                                        {returnedLoans.map((loan) => {
                                            const book = books.find((b) => b.id === loan.bookId);
                                            const title =
                                                book?.title?.bn || book?.title?.en || 'Unknown Volume';
                                            return (
                                                <div
                                                    key={loan.id}
                                                    className="flex items-center justify-between gap-3 px-4 py-2.5 opacity-80 hover:opacity-100 transition-opacity"
                                                >
                                                    <div className="min-w-0">
                                                        <div className="font-bn-title text-sm font-medium text-foreground truncate">
                                                            {title}
                                                        </div>
                                                        <div className="font-bn-body text-xs text-muted-foreground">
                                                            {loan.borrowerName}
                                                            <span className="mx-1.5 text-border">•</span>
                                                            <span className="text-primary font-mono text-[11px] tabular-nums">
                                                                Returned{' '}
                                                                {new Date(
                                                                    loan.returnDate
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={busyId === loan.id}
                                                        onClick={() => deleteLoan(loan.id)}
                                                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
                                                        title="Delete record"
                                                    >
                                                        <IconTrash size={15} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {loans.length === 0 && (
                                <div className="py-10 px-4 text-center border border-dashed border-border rounded-md bg-background/40">
                                    <IconUsers
                                        size={28}
                                        stroke={1.5}
                                        className="mx-auto mb-2 text-muted-foreground/50"
                                    />
                                    <p className="font-editorial text-sm font-medium text-foreground">
                                        No circulation records yet
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Log borrowed volumes above to keep track of who has your books.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default LendingTracker;
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
    IconX,
    IconBookmarkPlus,
    IconPlus,
    IconTrash,
    IconLoader2,
    IconHeart,
} from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'ilmshelf_wishlist';

// Strip hyphens (-), collapse extra spaces, and trim whitespace
function sanitizeName(value = '') {
    return String(value || '')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * API-Ready Data Adapter
 * Swap these localStorage calls with your REST/FastAPI endpoints when ready.
 */
const wishlistService = {
    async list() {
        // Future API: const res = await fetch('/api/wishlist'); return res.json();
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    },
    async create(item) {
        // Future API: const res = await fetch('/api/wishlist', { method: 'POST', body: JSON.stringify(item) }); return res.json();
        const current = await this.list();
        const next = [item, ...current];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return item;
    },
    async remove(id) {
        // Future API: await fetch(`/api/wishlist/${id}`, { method: 'DELETE' });
        const current = await this.list();
        const next = current.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return id;
    },
};

const PRIORITY_STYLES = {
    HIGH: {
        label: 'High Priority',
        short: 'High',
        dot: 'bg-destructive',
        badge: 'bg-destructive/10 text-destructive border-destructive/25',
    },
    MEDIUM: {
        label: 'Medium Priority',
        short: 'Medium',
        dot: 'bg-ochre',
        badge: 'bg-ochre/12 text-ochre border-ochre/30',
    },
    LOW: {
        label: 'Low Priority',
        short: 'Low',
        dot: 'bg-primary',
        badge: 'bg-primary/10 text-primary border-primary/25',
    },
};

function Wishlist({ onClose }) {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [form, setForm] = useState({
        title: '',
        author: '',
        price: '',
        priority: 'MEDIUM',
    });

    // Hydrate wishlist via service adapter
    useEffect(() => {
        let active = true;
        wishlistService
            .list()
            .then((items) => {
                if (active) setWishlist(items);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const addItem = async (e) => {
        e?.preventDefault();
        const cleanTitle = sanitizeName(form.title);
        if (!cleanTitle || submitting) return;

        const newItem = {
            id: 'w' + Date.now(),
            title: cleanTitle,
            author: sanitizeName(form.author),
            price: Number(form.price) || 0,
            priority: form.priority || 'MEDIUM',
            addedDate: new Date().toISOString(),
        };

        try {
            setSubmitting(true);
            const savedItem = await wishlistService.create(newItem);
            setWishlist((prev) => [savedItem, ...prev]);
            setForm({ title: '', author: '', price: '', priority: 'MEDIUM' });
        } finally {
            setSubmitting(false);
        }
    };

    const deleteItem = async (id) => {
        if (deletingId) return;
        try {
            setDeletingId(id);
            await wishlistService.remove(id);
            setWishlist((prev) => prev.filter((item) => item.id !== id));
        } finally {
            setDeletingId(null);
        }
    };

    const filteredWishlist = useMemo(() => {
        if (priorityFilter === 'ALL') return wishlist;
        return wishlist.filter((item) => (item.priority || 'MEDIUM') === priorityFilter);
    }, [wishlist, priorityFilter]);

    const totalWishlistPrice = useMemo(
        () => wishlist.reduce((sum, item) => sum + (Number(item.price) || 0), 0),
        [wishlist]
    );

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
                className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <header className="px-6 py-4 bg-background border-b border-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                            <IconBookmarkPlus size={17} stroke={1.9} />
                        </div>
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                Future Acquisitions
                            </p>
                            <h2 className="font-editorial text-xl font-semibold text-foreground leading-tight">
                                Reading Wishlist
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                        aria-label="Close wishlist"
                    >
                        <IconX size={18} />
                    </button>
                </header>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
                    {/* Hairline Summary Ledger */}
                    <div className="grid grid-cols-2 bg-background border border-border rounded-md divide-x divide-border">
                        <div className="px-4 py-3">
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                                Queued Volumes
                            </div>
                            <div className="font-mono text-2xl font-bold text-foreground tabular-nums mt-0.5">
                                {wishlist.length}
                                <span className="font-sans text-xs font-normal text-muted-foreground ml-1.5">
                                    {wishlist.length === 1 ? 'book' : 'books'}
                                </span>
                            </div>
                        </div>
                        <div className="px-4 py-3">
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                                Estimated Budget
                            </div>
                            <div className="font-mono text-2xl font-bold text-primary tabular-nums mt-0.5">
                                ৳{totalWishlistPrice.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Quick Acquisition Form */}
                    <form
                        onSubmit={addItem}
                        className="bg-background/80 border border-border rounded-md p-4 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                Add Volume to Queue
                            </h3>
                            <span className="text-[11px] text-muted-foreground">
                                Bengali or English
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                            <div className="sm:col-span-12">
                                <Input
                                    placeholder="বইয়ের নাম বা শিরোনাম (Book title) *"
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    className="font-bn-title h-9 bg-card border-border text-sm"
                                />
                            </div>

                            <div className="sm:col-span-5">
                                <Input
                                    placeholder="লেখক / প্রকাশনী (Author)"
                                    value={form.author}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, author: e.target.value }))
                                    }
                                    className="font-bn-body h-9 bg-card border-border text-sm"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="দাম (৳)"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, price: e.target.value }))
                                    }
                                    className="h-9 bg-card border-border text-sm tabular-nums"
                                />
                            </div>

                            <div className="sm:col-span-4">
                                <Select
                                    value={form.priority}
                                    onValueChange={(val) =>
                                        setForm((prev) => ({ ...prev, priority: val }))
                                    }
                                >
                                    <SelectTrigger className="w-full h-9 bg-card border-border text-xs font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="HIGH">High Priority</SelectItem>
                                        <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                                        <SelectItem value="LOW">Low Priority</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <Button
                                type="submit"
                                disabled={!form.title.trim() || submitting}
                                className="h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium gap-1.5"
                            >
                                {submitting ? (
                                    <IconLoader2 size={14} className="animate-spin" />
                                ) : (
                                    <IconPlus size={14} />
                                )}
                                <span>Add to Wishlist</span>
                            </Button>
                        </div>
                    </form>

                    {/* Filter Pills + Wishlist Ledger */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                Saved Titles ({filteredWishlist.length})
                            </span>

                            <div className="flex items-center gap-1">
                                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriorityFilter(p)}
                                        className={cn(
                                            'px-2 py-0.5 rounded text-[11px] font-medium transition-colors border',
                                            priorityFilter === p
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background text-muted-foreground border-border hover:text-foreground'
                                        )}
                                    >
                                        {p === 'ALL' ? 'All' : PRIORITY_STYLES[p].short}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-10 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                <IconLoader2 size={20} className="animate-spin text-primary" />
                                <span className="font-mono text-xs">Loading wishlist...</span>
                            </div>
                        ) : filteredWishlist.length === 0 ? (
                            <div className="py-10 px-4 text-center border border-dashed border-border rounded-md bg-background/40">
                                <IconHeart
                                    size={28}
                                    stroke={1.5}
                                    className="mx-auto mb-2 text-muted-foreground/50"
                                />
                                <p className="font-editorial text-sm font-medium text-foreground">
                                    {wishlist.length === 0
                                        ? 'Your acquisition queue is empty'
                                        : 'No titles match this priority filter'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Add books above to track titles you plan to purchase next.
                                </p>
                            </div>
                        ) : (
                            <div className="border border-border rounded-md divide-y divide-border bg-background/40 overflow-hidden">
                                {filteredWishlist.map((item, idx) => {
                                    const pStyle =
                                        PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.MEDIUM;
                                    const isDeleting = deletingId === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/45 transition-colors"
                                        >
                                            <div className="flex items-start gap-3 min-w-0">
                                                <span className="font-mono text-[11px] text-muted-foreground tabular-nums pt-1">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>

                                                <div className="min-w-0">
                                                    <div className="font-bn-title text-sm font-semibold text-foreground truncate">
                                                        {item.title}
                                                    </div>
                                                    {item.author && (
                                                        <div className="font-bn-body text-xs text-muted-foreground truncate mt-0.5">
                                                            {item.author}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        {Number(item.price) > 0 && (
                                                            <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                                                                ৳{Number(item.price).toLocaleString()}
                                                            </span>
                                                        )}
                                                        <span
                                                            className={cn(
                                                                'inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded border',
                                                                pStyle.badge
                                                            )}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    'w-1.5 h-1.5 rounded-full',
                                                                    pStyle.dot
                                                                )}
                                                            />
                                                            {pStyle.short}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={() => deleteItem(item.id)}
                                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
                                                title="Remove from wishlist"
                                            >
                                                {isDeleting ? (
                                                    <IconLoader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <IconTrash size={16} />
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Wishlist;
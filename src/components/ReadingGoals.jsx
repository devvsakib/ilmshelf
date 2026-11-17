import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    IconX,
    IconTarget,
    IconCheck,
    IconLoader2,
} from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'ilmshelf_reading_goals';

/**
 * API-Ready Persistence Adapter
 * Swap localStorage calls with your REST/FastAPI endpoints when ready.
 */
const goalsService = {
    async get(year) {
        // Future API: const res = await fetch(`/api/goals?year=${year}`); return res.json();
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { yearlyTarget: 24, year };
    },
    async save(payload) {
        // Future API: const res = await fetch('/api/goals', { method: 'PUT', body: JSON.stringify(payload) }); return res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return payload;
    },
};

function ReadingGoals({ books = [], onClose }) {
    const currentYear = new Date().getFullYear();
    const [goals, setGoals] = useState({ yearlyTarget: 24, year: currentYear });
    const [targetInput, setTargetInput] = useState('24');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let active = true;
        goalsService
            .get(currentYear)
            .then((data) => {
                if (active && data) {
                    setGoals(data);
                    setTargetInput(String(data.yearlyTarget || 24));
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [currentYear]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSaveTarget = async (e) => {
        e?.preventDefault();
        const parsedTarget = Math.max(1, Number(targetInput) || 1);
        const updated = { ...goals, yearlyTarget: parsedTarget, year: currentYear };
        try {
            setSaving(true);
            const saved = await goalsService.save(updated);
            setGoals(saved);
            setTargetInput(String(saved.yearlyTarget));
        } finally {
            setSaving(false);
        }
    };

    const completedThisYear = books.filter((b) => {
        if ((b.readStatus || '').toUpperCase() !== 'COMPLETED') return false;
        if (!b.completedDate) return true; // Count completed books even if completedDate wasn't logged
        return new Date(b.completedDate).getFullYear() === currentYear;
    }).length;

    const target = Math.max(1, Number(goals.yearlyTarget) || 1);
    const rawPct = (completedThisYear / target) * 100;
    const progress = rawPct.toFixed(1);
    const remaining = Math.max(0, target - completedThisYear);
    const monthsLeft = Math.max(1, 12 - new Date().getMonth());
    const booksPerMonth = remaining > 0 ? (remaining / monthsLeft).toFixed(1) : '0.0';
    const isGoalReached = completedThisYear >= target;

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
                className="bg-card border border-border rounded-lg w-full max-w-md overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="px-6 py-4 bg-background border-b border-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                            <IconTarget size={17} stroke={1.9} />
                        </div>
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                Annual Milestone · {currentYear}
                            </p>
                            <h2 className="font-editorial text-xl font-semibold text-foreground leading-tight">
                                Reading Goals
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                        aria-label="Close reading goals"
                    >
                        <IconX size={18} />
                    </button>
                </header>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <IconLoader2 size={20} className="animate-spin text-primary" />
                            <span className="font-mono text-xs">Loading goal...</span>
                        </div>
                    ) : (
                        <>
                            {/* Progress Ledger Card */}
                            <div className="bg-background border border-border rounded-md p-5 space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <div>
                                        <span className="font-mono text-4xl font-bold text-primary tabular-nums">
                                            {completedThisYear}
                                        </span>
                                        <span className="text-sm text-muted-foreground ml-2 tabular-nums">
                                            of {target} volumes read
                                        </span>
                                    </div>
                                    <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
                                        {progress}%
                                    </span>
                                </div>

                                <div className="h-2.5 w-full rounded-full bg-secondary border border-border/70 overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, rawPct)}%` }}
                                    />
                                </div>

                                {/* Hairline Pace Breakdown */}
                                <div className="grid grid-cols-2 pt-3 border-t border-border divide-x divide-border">
                                    <div className="pr-3">
                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                            Remaining
                                        </div>
                                        <div className="font-mono text-lg font-bold text-foreground tabular-nums mt-0.5">
                                            {remaining}
                                            <span className="font-sans text-xs font-normal text-muted-foreground ml-1">
                                                books
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pl-4">
                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                            Required Pace
                                        </div>
                                        <div className="font-mono text-lg font-bold text-ochre tabular-nums mt-0.5">
                                            {booksPerMonth}
                                            <span className="font-sans text-xs font-normal text-muted-foreground ml-1">
                                                / month
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Milestone Reached Callout */}
                            {isGoalReached && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-primary/10 border border-primary/25 text-primary">
                                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                        <IconCheck size={15} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold">
                                            Annual target achieved
                                        </p>
                                        <p className="text-[11px] opacity-85">
                                            You have completed your {currentYear} reading milestone.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Update Target Form */}
                            <form onSubmit={handleSaveTarget} className="space-y-2">
                                <label
                                    htmlFor="yearly-target-input"
                                    className="block text-[11px] uppercase tracking-wider font-medium text-muted-foreground"
                                >
                                    Adjust {currentYear} Target
                                </label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="yearly-target-input"
                                        type="number"
                                        min="1"
                                        max="1000"
                                        value={targetInput}
                                        onChange={(e) => setTargetInput(e.target.value)}
                                        className="h-9 bg-background border-border font-mono font-semibold text-sm tabular-nums"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium shrink-0 gap-1.5"
                                    >
                                        {saving ? (
                                            <IconLoader2 size={14} className="animate-spin" />
                                        ) : (
                                            <IconCheck size={14} />
                                        )}
                                        <span>Update Goal</span>
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ReadingGoals;
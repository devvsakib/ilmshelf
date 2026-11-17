import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconSearch,
    IconX,
    IconFeather,
    IconBook2,
    IconChevronDown,
    IconArrowUpRight,
} from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function getInitials(name = '') {
    const cleaned = String(name || '').trim();
    if (!cleaned) return '—';
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2);
    return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

const Writters = ({ books = [] }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'WRITER' | 'TRANSLATOR'
    const [expandedAuthor, setExpandedAuthor] = useState(null);

    // Build unified index of Writers & Translators with their associated books
    const authorDirectory = useMemo(() => {
        const map = new Map();

        const ensureEntry = (rawName) => {
            const name = String(rawName || '').trim();
            if (!name) return null;
            if (!map.has(name)) {
                map.set(name, {
                    name,
                    isWriter: false,
                    isTranslator: false,
                    writtenBooks: [],
                    translatedBooks: [],
                });
            }
            return map.get(name);
        };

        books.forEach((book) => {
            const writerName = book.authors?.writter?.trim();
            if (writerName) {
                const entry = ensureEntry(writerName);
                if (entry) {
                    entry.isWriter = true;
                    if (!entry.writtenBooks.some((b) => b.id === book.id)) {
                        entry.writtenBooks.push(book);
                    }
                }
            }

            const translatorsRaw = book.authors?.translator || '';
            translatorsRaw
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
                .forEach((translatorName) => {
                    const entry = ensureEntry(translatorName);
                    if (entry) {
                        entry.isTranslator = true;
                        if (!entry.translatedBooks.some((b) => b.id === book.id)) {
                            entry.translatedBooks.push(book);
                        }
                    }
                });
        });

        return Array.from(map.values())
            .map((entry) => {
                const uniqueBooksMap = new Map();
                [...entry.writtenBooks, ...entry.translatedBooks].forEach((b) =>
                    uniqueBooksMap.set(b.id, b)
                );
                return {
                    ...entry,
                    allBooks: Array.from(uniqueBooksMap.values()),
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name, 'bn'));
    }, [books]);

    const filteredAuthors = useMemo(() => {
        const q = search.trim().toLowerCase();
        return authorDirectory.filter((author) => {
            if (roleFilter === 'WRITER' && !author.isWriter) return false;
            if (roleFilter === 'TRANSLATOR' && !author.isTranslator) return false;
            if (q && !author.name.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [authorDirectory, roleFilter, search]);

    const writerCount = authorDirectory.filter((a) => a.isWriter).length;
    const translatorCount = authorDirectory.filter((a) => a.isTranslator).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Editorial Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-border">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Bibliographic Index
                    </p>
                    <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mt-1">
                        Writers &amp; Translators
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 tabular-nums">
                        <span className="font-mono font-semibold text-foreground">{writerCount}</span>{' '}
                        {writerCount === 1 ? 'writer' : 'writers'} ·{' '}
                        <span className="font-mono font-semibold text-foreground">{translatorCount}</span>{' '}
                        {translatorCount === 1 ? 'translator' : 'translators'} indexed across{' '}
                        <span className="font-mono font-semibold text-foreground">{books.length}</span> volumes
                    </p>
                </div>

                {/* Search & Role Filter Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="relative w-full sm:w-64">
                        <IconSearch
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="লেখক বা অনুবাদক খুঁজুন..."
                            className="font-bn-body h-9 pl-8 pr-8 bg-card border-border text-xs"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label="Clear search"
                            >
                                <IconX size={13} />
                            </button>
                        )}
                    </div>

                    <div className="inline-flex items-center p-0.5 rounded-md bg-secondary border border-border self-start sm:self-auto">
                        {[
                            { id: 'ALL', label: `All (${authorDirectory.length})` },
                            { id: 'WRITER', label: `Writers (${writerCount})` },
                            { id: 'TRANSLATOR', label: `Translators (${translatorCount})` },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setRoleFilter(tab.id)}
                                className={cn(
                                    'px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors tabular-nums',
                                    roleFilter === tab.id
                                        ? 'bg-card text-foreground shadow-2xs border border-border/80'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Directory Grid */}
            {filteredAuthors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/60 border border-dashed border-border rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground mb-4">
                        <IconFeather size={22} stroke={1.6} />
                    </div>
                    <h2 className="font-editorial text-lg font-medium text-foreground">
                        {authorDirectory.length === 0
                            ? 'No writers or translators indexed yet'
                            : 'No matching names found'}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1">
                        {authorDirectory.length === 0
                            ? 'Add writer or translator credits when cataloging volumes to populate this directory.'
                            : 'Try adjusting your search query or role filter.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {filteredAuthors.map((author) => {
                        const isExpanded = expandedAuthor === author.name;
                        const bookCount = author.allBooks.length;

                        return (
                            <article
                                key={author.name}
                                className={cn(
                                    'bg-card border rounded-lg transition-all duration-200 overflow-hidden',
                                    isExpanded
                                        ? 'border-primary/50 shadow-sm'
                                        : 'border-border hover:border-primary/40'
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedAuthor((prev) =>
                                            prev === author.name ? null : author.name
                                        )
                                    }
                                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-secondary/35 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Archival Monogram Badge */}
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-bn-title text-xs font-bold flex items-center justify-center shrink-0">
                                            {getInitials(author.name)}
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="font-bn-title text-sm sm:text-base font-semibold text-foreground truncate">
                                                {author.name}
                                            </h2>

                                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                {author.isWriter && (
                                                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                                                        Writer
                                                    </span>
                                                )}
                                                {author.isTranslator && (
                                                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-ochre/12 text-ochre border border-ochre/25">
                                                        Translator
                                                    </span>
                                                )}
                                                <span className="font-mono text-[11px] text-muted-foreground tabular-nums ml-0.5">
                                                    · {bookCount} {bookCount === 1 ? 'vol' : 'vols'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <IconChevronDown
                                        size={16}
                                        className={cn(
                                            'text-muted-foreground shrink-0 transition-transform duration-200',
                                            isExpanded && 'rotate-180 text-primary'
                                        )}
                                    />
                                </button>

                                {/* Expandable Bibliography List */}
                                {isExpanded && (
                                    <div className="px-4 pb-3.5 pt-2 border-t border-border bg-background/60 space-y-1.5">
                                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                                            Cataloged Works
                                        </p>
                                        <ul className="divide-y divide-border/70">
                                            {author.allBooks.map((b) => {
                                                const title =
                                                    b.title?.bn || b.title?.en || 'Untitled';
                                                return (
                                                    <li key={b.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/book/${b.id}`)}
                                                            className="w-full py-1.5 text-left flex items-center justify-between gap-2 group/book"
                                                        >
                                                            <span className="inline-flex items-center gap-1.5 font-bn-body text-xs text-foreground group-hover/book:text-primary truncate transition-colors">
                                                                <IconBook2
                                                                    size={13}
                                                                    className="text-muted-foreground shrink-0"
                                                                />
                                                                <span className="truncate">{title}</span>
                                                            </span>
                                                            <IconArrowUpRight
                                                                size={13}
                                                                className="text-muted-foreground/60 group-hover/book:text-primary shrink-0"
                                                            />
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Writters;
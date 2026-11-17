import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    IconArrowLeft,
    IconEdit,
    IconTrash,
    IconShare,
    IconEye,
    IconEyeOff,
    IconBook2,
    IconBookmark,
    IconCheck,
    IconNotes,
    IconLoader2,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const BINDING_PALETTES = [
    { bg: 'bg-[#1B4332]', border: 'border-[#2D6A4F]', text: 'text-[#F6F4EF]', accent: 'text-[#D4A373]' },
    { bg: 'bg-[#2C241E]', border: 'border-[#4A3B32]', text: 'text-[#F6F4EF]', accent: 'text-[#C69C6D]' },
    { bg: 'bg-[#3D2B24]', border: 'border-[#5C4033]', text: 'text-[#FAF6F0]', accent: 'text-[#E2B47D]' },
    { bg: 'bg-[#1E2D3B]', border: 'border-[#334A5E]', text: 'text-[#F4F6F8]', accent: 'text-[#C9A86A]' },
    { bg: 'bg-[#4A2525]', border: 'border-[#6B3737]', text: 'text-[#FAF5F5]', accent: 'text-[#DFB78C]' },
];

function getBindingTheme(id = '') {
    const hash = String(id)
        .split('')
        .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return BINDING_PALETTES[hash % BINDING_PALETTES.length];
}

function StudyFolioSkeleton() {
    return (
        <div
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse"
            aria-busy="true"
            aria-label="Loading volume details"
        >
            {/* Top Breadcrumb Bar Skeleton */}
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-border">
                <div className="h-4 w-32 rounded bg-secondary" />
                <div className="flex items-center gap-2">
                    <div className="h-8 w-20 rounded-md bg-secondary" />
                    <div className="h-8 w-16 rounded-md bg-secondary" />
                </div>
            </div>

            {/* Study Folio Card Skeleton */}
            <div className="bg-card border border-border rounded-lg p-5 sm:p-8 shadow-2xs">
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] gap-7 lg:gap-10 items-start">
                    {/* 2:3 Book Cover Placeholder */}
                    <div className="w-44 sm:w-48 md:w-full mx-auto md:mx-0 space-y-3">
                        <div className="aspect-[2/3] w-full rounded-[6px] bg-secondary border border-border flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <IconLoader2 size={22} className="animate-spin text-primary/70" />
                            <span className="font-mono text-[10px] uppercase tracking-widest">
                                Retrieving Volume
                            </span>
                        </div>
                        <div className="h-7 w-full rounded-md bg-secondary/70 border border-border" />
                    </div>

                    {/* Metadata & Controls Placeholder */}
                    <div className="space-y-6">
                        <div className="pb-5 border-b border-border space-y-3">
                            <div className="h-3 w-28 rounded bg-secondary" />
                            <div className="h-8 w-3/4 rounded bg-secondary" />
                            <div className="h-4 w-1/3 rounded bg-secondary/80" />
                            <div className="pt-2 space-y-2">
                                <div className="h-4 w-52 rounded bg-secondary/70" />
                                <div className="h-4 w-44 rounded bg-secondary/70" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <div className="h-3 w-24 rounded bg-secondary" />
                                <div className="h-9 w-full rounded-md bg-secondary/80 border border-border" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-3 w-28 rounded bg-secondary" />
                                <div className="h-9 w-full rounded-md bg-secondary/80 border border-border" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="h-14 rounded-md bg-secondary/60 border border-border" />
                            <div className="h-14 rounded-md bg-secondary/60 border border-border" />
                            <div className="h-14 rounded-md bg-secondary/60 border border-border" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-3 w-36 rounded bg-secondary" />
                            <div className="h-24 w-full rounded-md bg-secondary/50 border border-border" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BookDetail({ books = [], setBooks, deleteBook, openEdit, isLoading = false }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hydrationTimedOut, setHydrationTimedOut] = useState(false);

    const book = books?.find((x) => x.id === id);

    // Grace period while parent store/API hydrates `books` on initial load or hard refresh
    useEffect(() => {
        if (book) {
            setHydrationTimedOut(false);
            return;
        }
        const timer = setTimeout(() => {
            setHydrationTimedOut(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, [book, id]);

    // Show archival skeleton loader while explicitly loading OR before hydration settles
    if (!book && (isLoading || (!hydrationTimedOut && books.length === 0))) {
        return <StudyFolioSkeleton />;
    }

    if (!book) {
        return (
            <div className="max-w-xl mx-auto py-16 px-4">
                <div className="bg-card border border-border rounded-lg p-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                        <IconBook2 size={22} stroke={1.6} />
                    </div>
                    <h2 className="font-editorial text-xl font-medium text-foreground">
                        Volume not found
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 mb-6">
                        This record may have been removed or the catalog link is outdated.
                    </p>
                    <Button
                        onClick={() => navigate('/')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Return to Catalog
                    </Button>
                </div>
            </div>
        );
    }

    const bnTitle = typeof book.title === 'object' ? book.title?.bn : book.title;
    const enTitle = typeof book.title === 'object' ? book.title?.en : null;
    const displayTitle = bnTitle || enTitle || 'Untitled Volume';

    const updateStatus = (status) => {
        setBooks((prev) =>
            prev.map((x) => (x.id === book.id ? { ...x, readStatus: status } : x))
        );
    };

    const togglePrivacy = () => {
        setBooks((prev) =>
            prev.map((x) => (x.id === book.id ? { ...x, private: !x.private } : x))
        );
    };

    const updateNotes = (value) => {
        setBooks((prev) =>
            prev.map((x) => (x.id === book.id ? { ...x, notes: value } : x))
        );
    };

    const share = async () => {
        const url = `${window.location.origin}/book/${book.id}`;
        const shareData = {
            title: displayTitle,
            text: `Check out "${displayTitle}" on IlmShelf`,
            url,
        };

        try {
            if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Remove "${displayTitle}" from your archive?`)) {
            await deleteBook(book.id);
            navigate('/');
        }
    };

    const binding = getBindingTheme(book.id || displayTitle);
    const showFallbackCover =
        !book.cover || imgError || book.cover.includes('via.placeholder.com');

    const metadataItems = [
        {
            label: 'Acquisition Price',
            value: book.price !== undefined && book.price !== '' ? `৳${book.price}` : null,
            mono: true,
        },
        {
            label: 'Extent',
            value: book.pages > 0 ? `${book.pages} pages` : null,
            mono: true,
        },
        {
            label: 'Published',
            value: book.publishedYear || null,
            mono: true,
        },
        {
            label: 'ISBN',
            value: book.isbn || null,
            mono: true,
        },
        {
            label: 'Purchased',
            value: book.purchaseDate || null,
            mono: true,
        },
        {
            label: 'Reading Duration',
            value: book.readingTime || null,
            mono: false,
        },
    ].filter((item) => item.value);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Top Breadcrumb / Action Bar */}
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-border">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <IconArrowLeft size={16} />
                    <span>Back to Catalog</span>
                </button>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={share}
                        className="h-8 px-3 bg-card border-border text-xs gap-1.5"
                    >
                        {copied ? (
                            <>
                                <IconCheck size={14} className="text-primary" />
                                <span className="text-primary">Link Copied</span>
                            </>
                        ) : (
                            <>
                                <IconShare size={14} />
                                <span>Share</span>
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(book.id)}
                        className="h-8 px-3 bg-card border-border text-xs gap-1.5"
                    >
                        <IconEdit size={14} />
                        <span>Edit</span>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className="h-8 px-2.5 bg-card border-border text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                        title="Delete volume"
                    >
                        <IconTrash size={14} />
                    </Button>
                </div>
            </div>

            {/* Main Study Folio Sheet */}
            <article className="bg-card border border-border rounded-lg p-5 sm:p-8 shadow-2xs">
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] gap-7 lg:gap-10 items-start">
                    {/* Left Column: Tactile 2:3 Book Cover + Shelf Tag */}
                    <div className="w-44 sm:w-48 md:w-full mx-auto md:mx-0 space-y-3">
                        <div className="aspect-[2/3] w-full rounded-[6px] overflow-hidden book-spine-effect border border-border bg-secondary">
                            {!showFallbackCover ? (
                                <img
                                    src={book.cover}
                                    alt={displayTitle}
                                    onError={() => setImgError(true)}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className={cn(
                                        'w-full h-full p-5 flex flex-col justify-between select-none',
                                        binding.bg,
                                        binding.text
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'border-t border-b py-4 text-center my-auto',
                                            binding.border
                                        )}
                                    >
                                        <p className="font-bn-title text-base font-semibold leading-relaxed">
                                            {displayTitle}
                                        </p>
                                        {book.authors?.writter && (
                                            <p className="font-bn-body text-xs opacity-80 mt-2">
                                                {book.authors.writter}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] opacity-75">
                                        <IconBook2 size={14} className={binding.accent} />
                                        <span className="font-mono uppercase tracking-widest">
                                            IlmShelf
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {book.shelfId && (
                            <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md bg-secondary/70 border border-border text-xs text-muted-foreground capitalize">
                                <IconBookmark size={13} className="text-primary" />
                                <span>Shelf:</span>
                                <span className="font-medium text-foreground">{book.shelfId}</span>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Bibliographic Record, Status & Notes */}
                    <div className="min-w-0 space-y-6">
                        <header className="pb-5 border-b border-border">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                                    Catalog ID · {book.id}
                                </span>
                                {book.private && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                                        <IconEyeOff size={11} />
                                        Private Volume
                                    </span>
                                )}
                            </div>

                            <h1 className="font-bn-title text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                {displayTitle}
                            </h1>

                            {enTitle && bnTitle && (
                                <p className="font-mono text-xs sm:text-sm text-muted-foreground mt-1.5">
                                    {enTitle}
                                </p>
                            )}

                            <dl className="mt-4 space-y-1.5 text-sm">
                                {book.authors?.writter && (
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <dt className="font-bn-body text-xs text-muted-foreground w-20 shrink-0">
                                            লেখক
                                        </dt>
                                        <dd className="font-bn-body font-semibold text-foreground">
                                            {book.authors.writter}
                                        </dd>
                                    </div>
                                )}
                                {book.authors?.translator && (
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <dt className="font-bn-body text-xs text-muted-foreground w-20 shrink-0">
                                            অনুবাদক
                                        </dt>
                                        <dd className="font-bn-body font-medium text-foreground/90">
                                            {book.authors.translator}
                                        </dd>
                                    </div>
                                )}
                                {book.authors?.publisher && (
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <dt className="font-bn-body text-xs text-muted-foreground w-20 shrink-0">
                                            প্রকাশনী
                                        </dt>
                                        <dd className="font-bn-body text-muted-foreground">
                                            {book.authors.publisher}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </header>

                        {/* Interactive Status & Visibility Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5">
                                    Reading Status
                                </label>
                                <Select value={book.readStatus} onValueChange={updateStatus}>
                                    <SelectTrigger className="w-full h-9 bg-background border-border text-sm font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="NOT_STARTED">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                                                Not Started
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="IN_PROGRESS">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-ochre" />
                                                In Progress
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="COMPLETED">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary" />
                                                Completed
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5">
                                    Archive Visibility
                                </label>
                                <button
                                    type="button"
                                    onClick={togglePrivacy}
                                    className={cn(
                                        'w-full h-9 px-3 border rounded-md flex items-center justify-between text-sm font-medium transition-colors',
                                        book.private
                                            ? 'bg-secondary/80 border-border text-foreground'
                                            : 'bg-background border-border text-foreground hover:bg-secondary/50'
                                    )}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        {book.private ? (
                                            <IconEyeOff size={15} className="text-muted-foreground" />
                                        ) : (
                                            <IconEye size={15} className="text-primary" />
                                        )}
                                        {book.private ? 'Private Record' : 'Public Record'}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        Toggle
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Bibliographic Metadata Hairline Ledger */}
                        {metadataItems.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 border border-border rounded-md divide-y sm:divide-y-0 divide-border bg-background/60 overflow-hidden">
                                {metadataItems.map((item, idx) => (
                                    <div
                                        key={item.label}
                                        className={cn(
                                            'p-3',
                                            idx % 2 === 0 ? 'border-r border-border sm:border-r-0' : '',
                                            idx % 3 !== 2 ? 'sm:border-r sm:border-border' : '',
                                            idx >= 3 ? 'sm:border-t sm:border-border' : ''
                                        )}
                                    >
                                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                                            {item.label}
                                        </div>
                                        <div
                                            className={cn(
                                                'text-sm font-semibold text-foreground mt-0.5 tabular-nums truncate',
                                                item.mono && 'font-mono'
                                            )}
                                        >
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Synopsis / Description */}
                        {book.description && (
                            <section className="space-y-1.5">
                                <h2 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                    Synopsis & Edition Notes
                                </h2>
                                <p className="font-bn-body text-sm text-foreground/90 leading-relaxed bg-secondary/45 border border-border rounded-md p-4">
                                    {book.description}
                                </p>
                            </section>
                        )}

                        {/* Editable Study Margin Notes */}
                        <section className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="study-margin-notes"
                                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium text-muted-foreground"
                                >
                                    <IconNotes size={13} className="text-ochre" />
                                    <span>Personal Study Notes</span>
                                </label>
                                <span className="text-[11px] text-muted-foreground">
                                    Auto-saved
                                </span>
                            </div>
                            <textarea
                                id="study-margin-notes"
                                rows={3}
                                value={book.notes || ''}
                                onChange={(e) => updateNotes(e.target.value)}
                                placeholder="Record key takeaways, chapter references, or reflections..."
                                className="w-full font-bn-body text-sm text-foreground bg-background border border-border focus:border-primary/60 focus:ring-2 focus:ring-primary/10 rounded-md p-3.5 outline-none transition-all resize-y placeholder:text-muted-foreground/60"
                            />
                        </section>
                    </div>
                </div>
            </article>
        </div>
    );
}

export default BookDetail;
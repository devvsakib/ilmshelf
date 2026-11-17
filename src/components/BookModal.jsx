import { useState, useEffect, useMemo, useRef } from 'react';
import {
    IconCheck,
    IconEyeOff,
    IconUpload,
    IconBook2,
    IconAlertCircle,
    IconLoader2,
    IconX,
    IconChevronDown,
    IconSearch,
    IconPlus,
} from '@tabler/icons-react';
import { uid } from '@/App';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Strip hyphens (-), collapse extra spaces, and trim leading/trailing whitespace
function sanitizeName(value = '') {
    return String(value || '')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Default seed options (expandable via custom input or existing catalog books)
const DEFAULT_WRITERS = [
    'আব্দুল হামীদ ফাইযী আল-মাদানী',
    'মুহাম্মদ ইবনে ইবরাহীম আততুওয়াইজিরী',
];

const DEFAULT_TRANSLATORS = [
    'ড. আবু বকর মুহাম্মাদ যাকারিয়া',
    'ড. মোহাম্মদ মানজুরে ইলাহী',
];

const DEFAULT_PUBLISHERS = [
    'মাকতাবাতুস সুন্নাহ',
    'ওয়াহীদিয়া ইসলামিয়া লাইব্রেরী',
];

const CUSTOM_META_STORAGE_KEY = 'ilmshelf_custom_bibliographic_options_v1';

function loadSavedCustomOptions() {
    try {
        const raw = localStorage.getItem(CUSTOM_META_STORAGE_KEY);
        return raw ? JSON.parse(raw) : { writers: [], translators: [], publishers: [] };
    } catch {
        return { writers: [], translators: [], publishers: [] };
    }
}

function saveCustomOption(category, value) {
    const cleaned = sanitizeName(value);
    if (!cleaned) return;
    try {
        const current = loadSavedCustomOptions();
        const existing = current[category] || [];
        if (!existing.includes(cleaned)) {
            current[category] = [cleaned, ...existing];
            localStorage.setItem(CUSTOM_META_STORAGE_KEY, JSON.stringify(current));
        }
    } catch {
        // Ignore storage quota issues
    }
}

/**
 * Searchable + Creatable Dropdown for লেখক, অনুবাদক, and প্রকাশনী
 */
function SearchableCreatableCombobox({
    label,
    placeholder,
    searchPlaceholder = 'নাম খুঁজুন বা নতুন লিখুন...',
    value,
    options = [],
    onChange,
    onCreateOption,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleOutsideClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [open]);

    useEffect(() => {
        if (open) {
            setQuery('');
            setTimeout(() => searchInputRef.current?.focus(), 10);
        }
    }, [open]);

    const normalizedQuery = sanitizeName(query);

    const filteredOptions = useMemo(() => {
        if (!normalizedQuery) return options;
        const qLower = normalizedQuery.toLowerCase();
        return options.filter((opt) => opt.toLowerCase().includes(qLower));
    }, [options, normalizedQuery]);

    const exactMatchExists = useMemo(() => {
        if (!normalizedQuery) return true;
        return options.some(
            (opt) => sanitizeName(opt).toLowerCase() === normalizedQuery.toLowerCase()
        );
    }, [options, normalizedQuery]);

    const handleSelect = (selectedVal) => {
        onChange(selectedVal);
        setOpen(false);
        setQuery('');
    };

    const handleAddCustom = () => {
        if (!normalizedQuery) return;
        onCreateOption?.(normalizedQuery);
        onChange(normalizedQuery);
        setOpen(false);
        setQuery('');
    };

    return (
        <div ref={containerRef} className="relative">
            <label className="block font-bn-body text-xs text-muted-foreground mb-1">
                {label}
            </label>

            <div className="relative flex items-center">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className={cn(
                        'w-full h-9 px-3 pr-8 rounded-md border border-border bg-background hover:bg-secondary/40 text-left text-sm font-bn-body flex items-center justify-between transition-colors',
                        open && 'border-primary/60 ring-2 ring-primary/10',
                        !value ? 'text-muted-foreground/70' : 'text-foreground'
                    )}
                >
                    <span className="truncate">{value || placeholder}</span>
                </button>

                {value ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('');
                        }}
                        className="absolute right-2.5 p-0.5 text-muted-foreground hover:text-foreground rounded"
                        title="Clear selection"
                    >
                        <IconX size={13} />
                    </button>
                ) : (
                    <IconChevronDown
                        size={14}
                        className={cn(
                            'absolute right-2.5 text-muted-foreground pointer-events-none transition-transform duration-150',
                            open && 'rotate-180'
                        )}
                    />
                )}
            </div>

            {open && (
                <div className="absolute z-50 left-0 right-0 mt-1.5 bg-popover border border-border rounded-md shadow-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-2.5 py-2 border-b border-border bg-background/70">
                        <IconSearch size={14} className="text-muted-foreground shrink-0" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (filteredOptions.length === 1 && exactMatchExists) {
                                        handleSelect(filteredOptions[0]);
                                    } else if (!exactMatchExists && normalizedQuery) {
                                        handleAddCustom();
                                    } else if (filteredOptions.length > 0) {
                                        handleSelect(filteredOptions[0]);
                                    }
                                } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    setOpen(false);
                                }
                            }}
                            placeholder={searchPlaceholder}
                            className="w-full bg-transparent text-xs font-bn-body text-foreground placeholder:text-muted-foreground/70 outline-none"
                        />
                    </div>

                    <div className="max-h-44 overflow-y-auto py-1">
                        {filteredOptions.map((opt) => {
                            const isSelected = value === opt;
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleSelect(opt)}
                                    className={cn(
                                        'w-full px-3 py-1.5 text-left text-xs font-bn-body flex items-center justify-between gap-2 transition-colors',
                                        isSelected
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-foreground hover:bg-secondary'
                                    )}
                                >
                                    <span className="truncate">{opt}</span>
                                    {isSelected && (
                                        <IconCheck size={13} className="text-primary shrink-0" />
                                    )}
                                </button>
                            );
                        })}

                        {filteredOptions.length === 0 && !normalizedQuery && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">
                                কোনো অপশন পাওয়া যায়নি
                            </p>
                        )}

                        {!exactMatchExists && normalizedQuery && (
                            <button
                                type="button"
                                onClick={handleAddCustom}
                                className="w-full px-3 py-2 text-left text-xs font-bn-body text-primary bg-primary/5 hover:bg-primary/12 border-t border-border/70 flex items-center gap-1.5 font-medium transition-colors"
                            >
                                <IconPlus size={13} className="shrink-0" />
                                <span className="truncate">
                                    যোগ করুন: &ldquo;{normalizedQuery}&rdquo;
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const emptyBook = (shelves = []) => ({
    title: { en: '', bn: '' },
    authors: { writter: '', translator: '', publisher: '' },
    cover: '',
    price: '',
    pages: '',
    shelfId: shelves[0]?.id || '',
    readStatus: 'NOT_STARTED',
    private: false,
    notes: '',
    purchaseDate: '',
    publishedYear: '',
    isbn: '',
    description: '',
    tags: [],
});

export default function BookModal({ book, books = [], shelves = [], onClose, onSave }) {
    const [form, setForm] = useState(() => book || emptyBook(shelves));
    const [coverFile, setCoverFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [previewError, setPreviewError] = useState(false);
    const [customOptions, setCustomOptions] = useState(() => loadSavedCustomOptions());

    useEffect(() => {
        setForm(
            book
                ? {
                    ...emptyBook(shelves),
                    ...book,
                    title: { en: '', bn: '', ...(book.title || {}) },
                    authors: {
                        writter: '',
                        translator: '',
                        publisher: '',
                        ...(book.authors || {}),
                    },
                }
                : emptyBook(shelves)
        );
        setCoverFile(null);
        setErrorMsg('');
        setPreviewError(false);
    }, [book, shelves]);

    const writerOptions = useMemo(() => {
        const fromBooks = books.map((b) => b?.authors?.writter).filter(Boolean);
        return Array.from(
            new Set([
                ...DEFAULT_WRITERS,
                ...(customOptions.writers || []),
                ...fromBooks,
                form.authors?.writter,
            ].filter(Boolean))
        );
    }, [books, customOptions.writers, form.authors?.writter]);

    const translatorOptions = useMemo(() => {
        const fromBooks = books.map((b) => b?.authors?.translator).filter(Boolean);
        return Array.from(
            new Set([
                ...DEFAULT_TRANSLATORS,
                ...(customOptions.translators || []),
                ...fromBooks,
                form.authors?.translator,
            ].filter(Boolean))
        );
    }, [books, customOptions.translators, form.authors?.translator]);

    const publisherOptions = useMemo(() => {
        const fromBooks = books.map((b) => b?.authors?.publisher).filter(Boolean);
        return Array.from(
            new Set([
                ...DEFAULT_PUBLISHERS,
                ...(customOptions.publishers || []),
                ...fromBooks,
                form.authors?.publisher,
            ].filter(Boolean))
        );
    }, [books, customOptions.publishers, form.authors?.publisher]);

    const handleRegisterCustomOption = (category, newValue) => {
        saveCustomOption(category, newValue);
        setCustomOptions(loadSavedCustomOptions());
    };

    const localPreviewUrl = useMemo(() => {
        if (!coverFile) return null;
        return URL.createObjectURL(coverFile);
    }, [coverFile]);

    useEffect(() => {
        return () => {
            if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
        };
    }, [localPreviewUrl]);

    const activeCoverPreview = localPreviewUrl || (!previewError ? form.cover : '');

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent, field, value) => {
        if (parent === 'title' && field === 'bn' && errorMsg) {
            setErrorMsg('');
        }
        setForm((prev) => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value },
        }));
    };

    // ---------- BN/EN detection & number normalization helpers ----------
    const hasBanglaChars = (s = '') => /[\u0980-\u09FF]/.test(String(s));
    const hasLatinChars = (s = '') => /[A-Za-z]/.test(String(s));

    const replaceBanglaDigits = (s = '') => {
        const map = {
            '০': '0',
            '১': '1',
            '২': '2',
            '৩': '3',
            '৪': '4',
            '৫': '5',
            '৬': '6',
            '৭': '7',
            '৮': '8',
            '৯': '9',
        };
        return String(s)
            .split('')
            .map((ch) => map[ch] ?? ch)
            .join('');
    };

    const parseBanglaNumberWords = (input = '') => {
        if (!input) return NaN;
        const tokens = input
            .replace(/[,।]/g, ' ')
            .replace(/য়/g, 'য')
            .split(/\s+/)
            .filter(Boolean);

        const unitMap = {
            'শূন্য': 0, 'শূন্যে': 0, 'নাল': 0, '০': 0,
            'এক': 1, 'একটা': 1, 'একা': 1, '১': 1,
            'দুই': 2, 'দুইটা': 2, '২': 2,
            'তিন': 3, '৩': 3,
            'চার': 4, '৪': 4,
            'পাঁচ': 5, 'পাঁচটা': 5, 'পাঁচে': 5, '৫': 5,
            'ছয়': 6, 'ছয়ে': 6, '৬': 6,
            'সাত': 7, '৭': 7,
            'আট': 8, '৮': 8,
            'নয়': 9, '৯': 9,
            'দশ': 10, '১০': 10, 'একদশ': 11, 'এগারো': 11, 'বারো': 12,
            'তের': 13, 'চৌদ্দ': 14, 'পনের': 15, 'ষোল': 16, 'সতের': 17, 'আঠার': 18, 'উনিশ': 19,
            'বিশ': 20, 'ত্রিশ': 30, 'চল্লিশ': 40, 'পঞ্চাশ': 50, 'ষাট': 60, 'সত্তর': 70, 'আশি': 80, 'নব্বই': 90,
        };

        const scaleMap = {
            'শত': 100,
            'শতক': 100,
            'শতাংশ': 100,
            'হাজার': 1000,
            'লক্ষ': 100000,
            'লক্ষ্য': 100000,
            'কোটি': 10000000,
        };

        let total = 0;
        let current = 0;

        for (const raw of tokens) {
            const t = raw.trim();
            if (!t) continue;

            if (/[\u09E6-\u09EF0-9]/.test(t)) {
                const replaced = replaceBanglaDigits(t);
                const n = parseInt(replaced, 10);
                if (!isNaN(n)) {
                    current += n;
                    continue;
                }
            }

            if (unitMap[t] !== undefined) {
                current += unitMap[t];
                continue;
            }

            if (scaleMap[t]) {
                current = current === 0 ? 1 : current;
                current = current * scaleMap[t];
                total += current;
                current = 0;
                continue;
            }

            if (/^\d+$/.test(t)) {
                current += Number(t);
                continue;
            }

            const maybeDigits = t.replace(/[^\d০১২৩৪৫৬৭৮৯]/g, '');
            if (maybeDigits) {
                const n = parseInt(replaceBanglaDigits(maybeDigits), 10);
                if (!isNaN(n)) {
                    current += n;
                    continue;
                }
            }
        }

        return total + current;
    };

    function normalizeNumberInput(raw) {
        if (raw === null || raw === undefined) return 0;
        const s = String(raw).trim();
        if (s === '') return 0;

        if ((hasBanglaChars(s) && /[০১২৩৪৫৬৭৮৯]/.test(s)) || /[অ-ঔক-হ]/i.test(s)) {
            const replaced = replaceBanglaDigits(s);
            const onlyDigits = replaced.replace(/[^\d]/g, '');
            if (onlyDigits) return Number(onlyDigits);

            const parsedWords = parseBanglaNumberWords(s);
            if (!isNaN(parsedWords)) return parsedWords;
        }

        if (/^[০১২৩৪৫৬৭৮৯\s,]+$/.test(s)) {
            return Number(replaceBanglaDigits(s));
        }

        const cleaned = s.replace(/[,\s]/g, '');
        const m = cleaned.match(/-?\d+(\.\d+)?/);
        if (m) return Number(m[0]);

        return 0;
    }
    // ---------- end helpers ----------

    const handleSave = async (e) => {
        e?.preventDefault();

        const cleanBnTitle = sanitizeName(form?.title?.bn);
        const cleanEnTitle = sanitizeName(form?.title?.en);

        if (!cleanBnTitle) {
            setErrorMsg('বাংলা শিরোনাম প্রয়োজন (Bengali title is required)');
            return;
        }

        const normalizedPrice = normalizeNumberInput(form.price);
        const normalizedPages = normalizeNumberInput(form.pages);

        const bookData = {
            ...form,
            id: book?.id || uid(),
            title: {
                bn: cleanBnTitle,
                en: cleanEnTitle,
            },
            authors: {
                writter: sanitizeName(form?.authors?.writter),
                translator: sanitizeName(form?.authors?.translator),
                publisher: sanitizeName(form?.authors?.publisher),
            },
            price: Number(normalizedPrice) || 0,
            pages: Number(normalizedPages) || 0,
            publishedYear: Number(form.publishedYear) || new Date().getFullYear(),
        };

        try {
            setSaving(true);
            await onSave(bookData, coverFile);
        } finally {
            setSaving(false);
        }
    };

    const detectLangBadge = (text) => {
        return hasBanglaChars(text) ? 'BN' : hasLatinChars(text) ? 'EN' : '';
    };

    return (
        <Dialog
            open={true}
            onOpenChange={(open) => {
                if (!open && !saving) onClose?.();
            }}
        >
            <DialogContent className="max-w-2xl w-[95vw] p-0 gap-0 bg-card border-border overflow-hidden shadow-xl">
                {/* Modal Header */}
                <DialogHeader className="px-6 py-4 bg-background border-b border-border text-left">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {book ? `Record · ${book.id}` : 'New Catalog Entry'}
                        </p>
                        <DialogTitle className="font-editorial text-xl font-semibold text-foreground mt-0.5">
                            {book ? 'Edit Volume Record' : 'Catalog New Volume'}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">
                        Enter bibliographic details, author credits, shelf placement, and reading status.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Form Body */}
                <form onSubmit={handleSave} className="flex flex-col max-h-[82vh]">
                    <div className="px-6 py-5 space-y-6 overflow-y-auto no-scrollbar">
                        {/* Inline Validation Banner */}
                        {errorMsg && (
                            <div
                                role="alert"
                                className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium"
                            >
                                <IconAlertCircle size={15} className="shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Section 1: Titles & Cover Preview */}
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_104px] gap-5 items-start">
                            <div className="space-y-3.5">
                                <div>
                                    <label className="flex items-center justify-between text-xs font-medium text-foreground mb-1.5">
                                        <span className="font-bn-body">
                                            শিরোনাম (বাংলা) <span className="text-destructive">*</span>
                                        </span>
                                        {detectLangBadge(form.title.bn) && (
                                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-secondary text-muted-foreground border border-border">
                                                {detectLangBadge(form.title.bn)}
                                            </span>
                                        )}
                                    </label>
                                    <Input
                                        value={form.title.bn}
                                        onChange={(e) => updateNestedField('title', 'bn', e.target.value)}
                                        placeholder="যেমন: সীরাতুর রাসূল (ছাঃ)"
                                        className={cn(
                                            'font-bn-title h-9 bg-background border-border',
                                            errorMsg && 'border-destructive focus-visible:ring-destructive/20'
                                        )}
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-1.5">
                                        <span>Transliteration / English Title</span>
                                        {detectLangBadge(form.title.en) && (
                                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-secondary text-muted-foreground border border-border">
                                                {detectLangBadge(form.title.en)}
                                            </span>
                                        )}
                                    </label>
                                    <Input
                                        value={form.title.en}
                                        onChange={(e) => updateNestedField('title', 'en', e.target.value)}
                                        placeholder="e.g. Siratur Rasul (SAW)"
                                        className="h-9 bg-background border-border text-sm"
                                    />
                                </div>
                            </div>

                            {/* Live 2:3 Cover Preview */}
                            <div className="hidden sm:flex flex-col items-center">
                                <div className="w-24 aspect-[2/3] rounded-[5px] overflow-hidden book-spine-effect border border-border bg-secondary flex items-center justify-center">
                                    {activeCoverPreview ? (
                                        <img
                                            src={activeCoverPreview}
                                            alt="Cover preview"
                                            onError={() => setPreviewError(true)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="p-2 text-center bg-[#1B4332] text-[#F6F4EF] w-full h-full flex flex-col justify-between">
                                            <p className="font-bn-title text-[9px] leading-snug line-clamp-3 border-y border-[#2D6A4F] py-1 my-auto">
                                                {sanitizeName(form.title.bn) || 'প্রচ্ছদ'}
                                            </p>
                                            <IconBook2 size={11} className="mx-auto text-[#D4A373]" />
                                        </div>
                                    )}
                                </div>
                                <span className="font-mono text-[10px] text-muted-foreground mt-1.5">
                                    2:3 Preview
                                </span>
                            </div>
                        </div>

                        {/* Section 2: Searchable & Creatable Bibliographic Credits */}
                        <div className="pt-4 border-t border-border space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                    Author & Publication Credits
                                </p>
                                <span className="text-[11px] text-muted-foreground">
                                    Select or type to add new
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <SearchableCreatableCombobox
                                    label="লেখক (Writer)"
                                    placeholder="লেখক নির্বাচন করুন"
                                    searchPlaceholder="লেখকের নাম খুঁজুন বা লিখুন..."
                                    value={form.authors.writter}
                                    options={writerOptions}
                                    onChange={(val) => updateNestedField('authors', 'writter', val)}
                                    onCreateOption={(val) =>
                                        handleRegisterCustomOption('writers', val)
                                    }
                                />

                                <SearchableCreatableCombobox
                                    label="অনুবাদক (Translator)"
                                    placeholder="অনুবাদক নির্বাচন করুন"
                                    searchPlaceholder="অনুবাদকের নাম খুঁজুন বা লিখুন..."
                                    value={form.authors.translator}
                                    options={translatorOptions}
                                    onChange={(val) =>
                                        updateNestedField('authors', 'translator', val)
                                    }
                                    onCreateOption={(val) =>
                                        handleRegisterCustomOption('translators', val)
                                    }
                                />

                                <SearchableCreatableCombobox
                                    label="প্রকাশনী (Publisher)"
                                    placeholder="প্রকাশনী নির্বাচন করুন"
                                    searchPlaceholder="প্রকাশনীর নাম খুঁজুন বা লিখুন..."
                                    value={form.authors.publisher}
                                    options={publisherOptions}
                                    onChange={(val) =>
                                        updateNestedField('authors', 'publisher', val)
                                    }
                                    onCreateOption={(val) =>
                                        handleRegisterCustomOption('publishers', val)
                                    }
                                />
                            </div>
                        </div>

                        {/* Section 3: Shelf Placement & Reading Status */}
                        <div className="pt-4 border-t border-border space-y-3">
                            <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                Classification & Status
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                        Shelf
                                    </label>
                                    <Select
                                        value={form.shelfId}
                                        onValueChange={(val) => updateField('shelfId', val)}
                                    >
                                        <SelectTrigger className="w-full h-9 bg-background border-border text-sm">
                                            <SelectValue placeholder="Select shelf" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            {shelves.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                        Reading Status
                                    </label>
                                    <Select
                                        value={form.readStatus}
                                        onValueChange={(val) => updateField('readStatus', val)}
                                    >
                                        <SelectTrigger className="w-full h-9 bg-background border-border text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Cover Artwork */}
                        <div className="pt-4 border-t border-border space-y-3">
                            <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                Cover Artwork
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                        Image URL
                                    </label>
                                    <Input
                                        value={form.cover}
                                        onChange={(e) => {
                                            setPreviewError(false);
                                            updateField('cover', e.target.value);
                                        }}
                                        placeholder="https://example.com/cover.jpg"
                                        className="h-9 bg-background border-border font-mono text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                        Upload File (JPG, PNG, WebP)
                                    </label>
                                    <div className="relative flex items-center gap-2">
                                        <label className="flex-1 h-9 px-3 rounded-md border border-dashed border-input bg-background hover:bg-secondary/60 transition-colors flex items-center gap-2 text-xs text-muted-foreground cursor-pointer truncate">
                                            <IconUpload size={14} className="shrink-0 text-primary" />
                                            <span className="truncate">
                                                {coverFile ? coverFile.name : 'Choose cover image...'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) =>
                                                    setCoverFile(e.target.files?.[0] || null)
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                        {coverFile && (
                                            <button
                                                type="button"
                                                onClick={() => setCoverFile(null)}
                                                className="h-9 w-9 rounded-md border border-border bg-background hover:bg-secondary flex items-center justify-center text-muted-foreground"
                                                title="Remove selected file"
                                            >
                                                <IconX size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Physical Extent & Acquisition */}
                        <div className="pt-4 border-t border-border space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                                    Extent & Acquisition
                                </p>
                                <span className="text-[11px] text-muted-foreground">
                                    Accepts বাংলা digits or words (e.g. ৭৫০ or সাতশত পঞ্চাশ)
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="block font-bn-body text-xs text-muted-foreground mb-1">
                                        দাম (Price ৳)
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={form.price}
                                        onChange={(e) => updateField('price', e.target.value)}
                                        className="h-9 bg-background border-border text-sm tabular-nums"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bn-body text-xs text-muted-foreground mb-1">
                                        পৃষ্ঠা (Pages)
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={form.pages}
                                        onChange={(e) => updateField('pages', e.target.value)}
                                        className="h-9 bg-background border-border text-sm tabular-nums"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                        Published Year
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder={String(new Date().getFullYear())}
                                        value={form.publishedYear}
                                        onChange={(e) => updateField('publishedYear', e.target.value)}
                                        className="h-9 bg-background border-border text-sm tabular-nums"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                        Purchase Date
                                    </label>
                                    <Input
                                        type="date"
                                        value={form.purchaseDate || ''}
                                        onChange={(e) => updateField('purchaseDate', e.target.value)}
                                        className="h-9 bg-background border-border text-xs tabular-nums"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">
                                    ISBN
                                </label>
                                <Input
                                    value={form.isbn || ''}
                                    onChange={(e) => updateField('isbn', e.target.value)}
                                    placeholder="978-984-00-0000-0"
                                    className="h-9 bg-background border-border text-sm font-mono"
                                />
                            </div>
                        </div>

                        {/* Section 6: Synopsis & Margin Notes */}
                        <div className="pt-4 border-t border-border space-y-3">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">
                                    Description / Synopsis
                                </label>
                                <Textarea
                                    value={form.description || ''}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    rows={2}
                                    placeholder="Brief overview or edition details..."
                                    className="font-bn-body bg-background border-border text-sm resize-y"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">
                                    Personal Study Notes
                                </label>
                                <Textarea
                                    value={form.notes || ''}
                                    onChange={(e) => updateField('notes', e.target.value)}
                                    rows={2}
                                    placeholder="Key takeaways, chapter bookmarks, or lending notes..."
                                    className="font-bn-body bg-background border-border text-sm resize-y"
                                />
                            </div>

                            <div className="pt-1 flex items-center gap-2.5">
                                <Checkbox
                                    checked={!!form.private}
                                    onCheckedChange={(v) => updateField('private', !!v)}
                                    id="private-volume"
                                    className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <label
                                    htmlFor="private-volume"
                                    className="text-xs font-medium text-foreground flex items-center gap-1.5 cursor-pointer select-none"
                                >
                                    <IconEyeOff size={14} className="text-muted-foreground" />
                                    Mark as private volume (hidden when sharing)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Archival Footer */}
                    <DialogFooter className="px-6 py-3.5 bg-background border-t border-border flex-row items-center justify-end gap-2.5">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={saving}
                                onClick={onClose}
                                className="h-9 px-4 bg-card border-border text-sm"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium gap-1.5"
                        >
                            {saving ? (
                                <>
                                    <IconLoader2 size={15} className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <IconCheck size={16} />
                                    <span>{book ? 'Save Changes' : 'Catalog Volume'}</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
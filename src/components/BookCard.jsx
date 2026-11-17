import { useState } from 'react';
import { motion } from 'motion/react';
import { IconEyeOff, IconBook2 } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// Deterministic cloth-binding palette for missing/broken cover images
const BINDING_PALETTES = [
    { bg: 'bg-[#1B4332]', border: 'border-[#2D6A4F]', text: 'text-[#F6F4EF]', accent: 'text-[#D4A373]' }, // Botanical Forest
    { bg: 'bg-[#2C241E]', border: 'border-[#4A3B32]', text: 'text-[#F6F4EF]', accent: 'text-[#C69C6D]' }, // Espresso Leather
    { bg: 'bg-[#3D2B24]', border: 'border-[#5C4033]', text: 'text-[#FAF6F0]', accent: 'text-[#E2B47D]' }, // Mahogany Cloth
    { bg: 'bg-[#1E2D3B]', border: 'border-[#334A5E]', text: 'text-[#F4F6F8]', accent: 'text-[#C9A86A]' }, // Archival Navy
    { bg: 'bg-[#4A2525]', border: 'border-[#6B3737]', text: 'text-[#FAF5F5]', accent: 'text-[#DFB78C]' }, // Oxblood Maroon
];

function getBindingTheme(id = '') {
    const hash = String(id)
        .split('')
        .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return BINDING_PALETTES[hash % BINDING_PALETTES.length];
}

function BookCard({ book, index, onOpen, isCoverHidden }) {
    const [imgError, setImgError] = useState(false);

    const bnTitle = typeof book.title === 'object' ? book.title?.bn : book.title;
    const enTitle = typeof book.title === 'object' ? book.title?.en : null;
    const displayTitle = bnTitle || enTitle || 'Untitled Volume';
    const catalogNo = index ? String(index).padStart(3, '0') : null;

    const status = (book.readStatus || 'NOT_STARTED').toUpperCase();
    const isCompleted = status === 'COMPLETED';
    const isReading = status === 'IN_PROGRESS';

    const statusConfig = isCompleted
        ? {
              label: 'Completed',
              dot: 'bg-primary',
              badge: 'bg-primary/10 text-primary border-primary/25',
          }
        : isReading
        ? {
              label: 'In Progress',
              dot: 'bg-ochre',
              badge: 'bg-ochre/12 text-ochre border-ochre/30',
          }
        : {
              label: 'Not Started',
              dot: 'bg-muted-foreground/50',
              badge: 'bg-secondary/80 text-muted-foreground border-border',
          };

    const binding = getBindingTheme(book.id || displayTitle);
    const showFallbackCover = !book.cover || imgError || book.cover.includes('via.placeholder.com');

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onOpen?.(book.id)}
            className="group relative flex flex-col justify-between bg-card border border-border hover:border-primary/45 rounded-lg p-3.5 transition-all duration-200 hover:shadow-[0_6px_20px_-6px_rgba(28,25,23,0.12)] cursor-pointer"
        >
            {/* Top Row: Cover + Bibliographic Info */}
            <div className="flex gap-3.5 items-start">
                {/* 2:3 Tactile Book Cover */}
                {!isCoverHidden && (
                    <div className="shrink-0 w-[72px] aspect-[2/3] rounded-[4px] overflow-hidden book-spine-effect border border-border/80 bg-secondary">
                        {!showFallbackCover ? (
                            <img
                                src={book.cover}
                                alt={displayTitle}
                                loading="lazy"
                                onError={() => setImgError(true)}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                        ) : (
                            /* Cloth-Bound Typographic Fallback Cover */
                            <div
                                className={cn(
                                    'w-full h-full p-2 flex flex-col justify-between select-none relative',
                                    binding.bg,
                                    binding.text
                                )}
                            >
                                <div
                                    className={cn(
                                        'border-t border-b py-1 text-center',
                                        binding.border
                                    )}
                                >
                                    <p className="font-bn-title text-[10px] font-semibold leading-snug line-clamp-3">
                                        {displayTitle}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between opacity-75">
                                    <IconBook2 size={11} className={binding.accent} />
                                    {catalogNo && (
                                        <span className="font-mono text-[8px] tracking-wider opacity-80">
                                            {catalogNo}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bibliographic Metadata */}
                <div className="flex-1 min-w-0">
                    {/* Micro-header: Catalog Index & Private Flag */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                        {catalogNo ? (
                            <span className="font-mono text-[10px] tracking-wider text-muted-foreground/80 tabular-nums">
                                #{catalogNo}
                            </span>
                        ) : (
                            <span />
                        )}

                        {book.private && (
                            <span
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border"
                                title="Private volume"
                            >
                                <IconEyeOff size={10} />
                                Private
                            </span>
                        )}
                    </div>

                    {/* Diacritic-Safe Bengali Title */}
                    <h3
                        className="font-bn-title text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                        title={displayTitle}
                    >
                        {displayTitle}
                    </h3>

                    {/* Writer & Translator */}
                    <div className="mt-1 space-y-0.5">
                        {book.authors?.writter && (
                            <p className="font-bn-body text-xs text-muted-foreground truncate">
                                {book.authors.writter}
                            </p>
                        )}
                        {book.authors?.translator && (
                            <p className="font-bn-body text-[11px] text-muted-foreground/80 truncate">
                                অনুবাদ: {book.authors.translator}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Hairline Footer: Price / Pages & Reading Status */}
            <div className="mt-3.5 pt-2.5 border-t border-border/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                    {book.price !== undefined && book.price !== null && book.price !== '' && (
                        <span className="font-mono font-medium text-foreground">
                            ৳{book.price}
                        </span>
                    )}
                    {book.price && book.pages ? (
                        <span className="text-border">•</span>
                    ) : null}
                    {book.pages ? (
                        <span className="font-mono text-[11px] text-muted-foreground">
                            {book.pages}p
                        </span>
                    ) : null}
                </div>

                <span
                    className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium shrink-0',
                        statusConfig.badge
                    )}
                >
                    <span className={cn('w-1.5 h-1.5 rounded-full', statusConfig.dot)} />
                    {statusConfig.label}
                </span>
            </div>
        </motion.article>
    );
}

export default BookCard;
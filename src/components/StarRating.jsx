import { useState } from 'react';
import { IconStar } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

function StarRating({ rating = 0, onChange, readonly = false, size }) {
    const [hover, setHover] = useState(0);
    const activeValue = hover || rating;
    const iconSize = size || (readonly ? 15 : 19);

    return (
        <div
            className="inline-flex items-center gap-0.5"
            role={readonly ? 'img' : 'radiogroup'}
            aria-label={`Rating: ${rating} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= activeValue;
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => !readonly && onChange?.(star)}
                        onMouseEnter={() => !readonly && setHover(star)}
                        onMouseLeave={() => !readonly && setHover(0)}
                        aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                        className={cn(
                            'p-0.5 rounded transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                            readonly
                                ? 'cursor-default'
                                : 'cursor-pointer hover:scale-110 active:scale-95'
                        )}
                    >
                        <IconStar
                            size={iconSize}
                            stroke={1.75}
                            className={cn(
                                'transition-colors',
                                isFilled
                                    ? 'fill-ochre text-ochre'
                                    : 'text-border hover:text-muted-foreground/60'
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}

export default StarRating;
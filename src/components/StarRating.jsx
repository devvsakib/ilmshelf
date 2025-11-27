import { useState } from 'react'
import { IconStar } from '@tabler/icons-react'

function StarRating({ rating, onChange, readonly = false }) {
    const [hover, setHover] = useState(0)

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onChange(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={`transition-transform ${!readonly && 'hover:scale-110'}`}
                >
                    <IconStar
                        size={readonly ? 16 : 20}
                        className={`${star <= (hover || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                    />
                </button>
            ))}
        </div>
    )
}

export default StarRating;
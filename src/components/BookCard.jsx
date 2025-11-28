import { motion } from 'motion/react'
import { IconEyeOff } from '@tabler/icons-react'

function BookCard({ book, onOpen, isCoverHidden }) {
    const statusColors = {
        'NOT_STARTED': 'bg-gray-100 text-gray-700',
        'IN_PROGRESS': 'bg-blue-100 text-blue-700',
        'COMPLETED': 'bg-emerald-100 text-emerald-700'
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -4 }}
            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => onOpen(book.id)}
        >
            <div className="flex gap-4">
                {!isCoverHidden && <div className="flex-shrink-0">
                    <img
                        src={book.cover}
                        alt={book.title.bn}
                        className="w-20 h-28 object-cover rounded-md shadow"
                        onError={(e) => {
                            e.target.src = `https://via.placeholder.com/200x300/059669/ffffff?text=${encodeURIComponent(book.title.bn.slice(0, 3))}`
                        }}
                    />
                </div>}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{book.title.bn}</h3>
                    <p className="text-xs text-slate-600 truncate mt-1">
                        {book.authors?.writter}
                        {book.authors?.translator && ` • ${book.authors.translator}`}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                            {book.price} ৳
                        </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[book.readStatus]}`}>
                            {book.readStatus.replace('_', ' ')}
                        </span>
                        {book.private && (
                            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium flex items-center gap-1">
                                <IconEyeOff size={12} />
                                Private
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default BookCard;
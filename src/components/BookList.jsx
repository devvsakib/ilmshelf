import { motion, AnimatePresence } from 'motion/react'
import { IconBook } from '@tabler/icons-react'
import BookCard from './BookCard'

function BookList({ books, onOpen, isCoverHidden }) {
    if (!books?.length) {
        return (
            <div className="text-center py-12">
                <IconBook size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No books found</p>
            </div>
        )
    }

    return (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
                {books?.map(b => (
                    <BookCard key={b.id} book={b} onOpen={onOpen} isCoverHidden={isCoverHidden} />
                ))}
            </AnimatePresence>
        </motion.div>
    )
}

export default BookList;
import BookList from './BookList'

function ShelfDetail({ books, shelves, shelfId, onOpen }) {
    const shelf = shelves.find(s => s.id === shelfId)
    const shelfBooks = books.filter(b => b.shelfId === shelfId)
    const total = shelfBooks.reduce((sum, b) => sum + (b.price || 0), 0)

    if (!shelf) return <div className="p-6">Shelf not found</div>

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{shelf.name}</h1>
                <p className="text-slate-600 mt-1">{shelf.description}</p>
                <div className="mt-4 flex gap-6 text-sm">
                    <div>
                        <span className="font-medium">Total Books:</span> {shelfBooks.length}
                    </div>
                    <div>
                        <span className="font-medium">Total Value:</span> <span className="text-emerald-600 font-bold">{total} ৳</span>
                    </div>
                </div>
            </div>
            <BookList books={shelfBooks} onOpen={onOpen} />
        </div>
    )
}

export default ShelfDetail;
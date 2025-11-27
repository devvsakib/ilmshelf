function SummaryPage({ books }) {
    const total = books.reduce((sum, b) => sum + (b.price || 0), 0)
    const byStatus = books.reduce((acc, b) => {
        acc[b.readStatus] = (acc[b.readStatus] || 0) + 1
        return acc
    }, {})

    const statusData = [
        { label: 'Not Started', value: byStatus['NOT_STARTED'] || 0, color: 'bg-gray-500' },
        { label: 'In Progress', value: byStatus['IN_PROGRESS'] || 0, color: 'bg-blue-500' },
        { label: 'Completed', value: byStatus['COMPLETED'] || 0, color: 'bg-emerald-500' }
    ]

    const totalBooks = books.length
    const avgPrice = totalBooks > 0 ? (total / totalBooks).toFixed(2) : 0

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-emerald-800 mb-6">Collection Summary</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="text-sm opacity-90 mb-2">Total Spent</div>
                    <div className="text-4xl font-bold">{total} ৳</div>
                    <div className="text-sm opacity-75 mt-2">Across {totalBooks} books</div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="text-sm opacity-90 mb-2">Total Books</div>
                    <div className="text-4xl font-bold">{totalBooks}</div>
                    <div className="text-sm opacity-75 mt-2">In your collection</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="text-sm opacity-90 mb-2">Average Price</div>
                    <div className="text-4xl font-bold">{avgPrice} ৳</div>
                    <div className="text-sm opacity-75 mt-2">Per book</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Reading Progress</h2>
                <div className="space-y-4">
                    {statusData.map(stat => {
                        const percentage = totalBooks > 0 ? (stat.value / totalBooks * 100).toFixed(1) : 0
                        return (
                            <div key={stat.label}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{stat.label}</span>
                                    <span className="text-sm text-slate-600">{stat.value} books ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`${stat.color} h-3 rounded-full transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SummaryPage;
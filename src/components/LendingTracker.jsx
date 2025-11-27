import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { IconX, IconUsers, IconPlus, IconTrash } from '@tabler/icons-react'

function LendingTracker({ books, onClose }) {
    const [loans, setLoans] = useState(() => {
        const saved = localStorage.getItem('ilmshelf_loans')
        return saved ? JSON.parse(saved) : []
    })
    const [form, setForm] = useState({ bookId: '', borrowerName: '', lentDate: new Date().toISOString().split('T')[0] })

    useEffect(() => {
        localStorage.setItem('ilmshelf_loans', JSON.stringify(loans))
    }, [loans])

    const addLoan = () => {
        if (!form.bookId || !form.borrowerName.trim()) return
        const loan = {
            id: 'l' + Date.now(),
            ...form,
            returnDate: null
        }
        setLoans(prev => [loan, ...prev])
        setForm({ bookId: '', borrowerName: '', lentDate: new Date().toISOString().split('T')[0] })
    }

    const markReturned = (id) => {
        setLoans(prev => prev.map(loan =>
            loan.id === id ? { ...loan, returnDate: new Date().toISOString() } : loan
        ))
    }

    const deleteLoan = (id) => {
        setLoans(prev => prev.filter(loan => loan.id !== id))
    }

    const activeLoans = loans.filter(l => !l.returnDate)
    const returnedLoans = loans.filter(l => l.returnDate)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <IconUsers size={24} className="text-blue-600" />
                        <h2 className="text-xl font-bold">Lending Tracker</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <IconX size={20} />
                    </button>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="text-2xl font-bold text-blue-700">{activeLoans.length}</div>
                    <div className="text-sm text-blue-600">Books currently lent out</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-3">Lend a Book</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <select
                            value={form.bookId}
                            onChange={e => setForm(prev => ({ ...prev, bookId: e.target.value }))}
                            className="p-2 border rounded-lg"
                        >
                            <option value="">Select book</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>{book.title.bn}</option>
                            ))}
                        </select>
                        <input
                            placeholder="Borrower name"
                            value={form.borrowerName}
                            onChange={e => setForm(prev => ({ ...prev, borrowerName: e.target.value }))}
                            className="p-2 border rounded-lg"
                        />
                        <input
                            type="date"
                            value={form.lentDate}
                            onChange={e => setForm(prev => ({ ...prev, lentDate: e.target.value }))}
                            className="p-2 border rounded-lg"
                        />
                    </div>
                    <button
                        onClick={addLoan}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <IconPlus size={18} />
                        Record Loan
                    </button>
                </div>

                <div className="space-y-6">
                    {activeLoans.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3 text-orange-700">Currently Lent ({activeLoans.length})</h3>
                            <div className="space-y-2">
                                {activeLoans.map(loan => {
                                    const book = books.find(b => b.id === loan.bookId)
                                    const daysOut = Math.floor((new Date() - new Date(loan.lentDate)) / (1000 * 60 * 60 * 24))
                                    return (
                                        <div key={loan.id} className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">{book?.title.bn || 'Unknown Book'}</div>
                                                <div className="text-sm text-slate-600">
                                                    Borrowed by: <span className="font-medium">{loan.borrowerName}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    Lent on: {new Date(loan.lentDate).toLocaleDateString()} ({daysOut} days ago)
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => markReturned(loan.id)}
                                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                >
                                                    Mark Returned
                                                </button>
                                                <button
                                                    onClick={() => deleteLoan(loan.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <IconTrash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {returnedLoans.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3 text-green-700">Returned ({returnedLoans.length})</h3>
                            <div className="space-y-2">
                                {returnedLoans.map(loan => {
                                    const book = books.find(b => b.id === loan.bookId)
                                    return (
                                        <div key={loan.id} className="flex items-center justify-between p-3 border bg-gray-50 rounded-lg opacity-75">
                                            <div>
                                                <div className="font-medium">{book?.title.bn || 'Unknown Book'}</div>
                                                <div className="text-sm text-slate-600">
                                                    Borrowed by: {loan.borrowerName}
                                                </div>
                                                <div className="text-xs text-green-600 mt-1">
                                                    ✓ Returned on {new Date(loan.returnDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteLoan(loan.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {loans.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <IconUsers size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>No lending records</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default LendingTracker;
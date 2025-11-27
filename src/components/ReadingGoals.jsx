import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { IconX, IconTarget } from '@tabler/icons-react'

function ReadingGoals({ books, onClose }) {
    const currentYear = new Date().getFullYear()
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('ilmshelf_reading_goals')
        return saved ? JSON.parse(saved) : {
            yearlyTarget: 24,
            year: currentYear
        }
    })

    useEffect(() => {
        localStorage.setItem('ilmshelf_reading_goals', JSON.stringify(goals))
    }, [goals])

    const completedThisYear = books.filter(b => {
        if (b.readStatus !== 'COMPLETED') return false
        if (!b.completedDate) return false
        const completedYear = new Date(b.completedDate).getFullYear()
        return completedYear === currentYear
    }).length

    const progress = (completedThisYear / goals.yearlyTarget * 100).toFixed(1)
    const remaining = Math.max(0, goals.yearlyTarget - completedThisYear)
    const monthsLeft = 12 - new Date().getMonth()
    const booksPerMonth = monthsLeft > 0 ? (remaining / monthsLeft).toFixed(1) : 0

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
                className="bg-white rounded-xl p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <IconTarget size={24} className="text-emerald-600" />
                        <h2 className="text-xl font-bold">Reading Goals {currentYear}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <IconX size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Yearly Target</label>
                    <input
                        type="number"
                        value={goals.yearlyTarget}
                        onChange={e => setGoals(prev => ({ ...prev, yearlyTarget: Number(e.target.value) || 0 }))}
                        className="w-full p-3 border rounded-lg text-lg font-semibold"
                        min="1"
                    />
                    <p className="text-xs text-slate-600 mt-1">How many books do you want to read this year?</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 mb-4">
                    <div className="text-center mb-4">
                        <div className="text-5xl font-bold text-emerald-700">{completedThisYear}</div>
                        <div className="text-sm text-emerald-600">of {goals.yearlyTarget} books completed</div>
                    </div>

                    <div className="w-full bg-emerald-200 rounded-full h-4 mb-2">
                        <div
                            className="bg-emerald-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                    <div className="text-center text-sm font-medium text-emerald-700">{progress}% Complete</div>
                </div>

                {remaining > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-700">{remaining}</div>
                            <div className="text-xs text-blue-600">Books remaining</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-700">{booksPerMonth}</div>
                            <div className="text-xs text-purple-600">Books per month</div>
                        </div>
                    </div>
                )}

                {completedThisYear >= goals.yearlyTarget && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">🎉</div>
                        <div className="font-semibold text-amber-900">Congratulations!</div>
                        <div className="text-sm text-amber-700">You've reached your reading goal!</div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}

export default ReadingGoals;
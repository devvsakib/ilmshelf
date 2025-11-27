import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { IconX, IconHeart, IconPlus, IconTrash } from '@tabler/icons-react'

function Wishlist({ onClose }) {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('ilmshelf_wishlist')
        return saved ? JSON.parse(saved) : []
    })
    const [form, setForm] = useState({ title: '', author: '', price: '', priority: 'MEDIUM' })

    useEffect(() => {
        localStorage.setItem('ilmshelf_wishlist', JSON.stringify(wishlist))
    }, [wishlist])

    const addItem = () => {
        if (!form.title.trim()) return
        const item = {
            id: 'w' + Date.now(),
            ...form,
            price: Number(form.price) || 0,
            addedDate: new Date().toISOString()
        }
        setWishlist(prev => [item, ...prev])
        setForm({ title: '', author: '', price: '', priority: 'MEDIUM' })
    }

    const deleteItem = (id) => {
        setWishlist(prev => prev.filter(item => item.id !== id))
    }

    const totalWishlistPrice = wishlist.reduce((sum, item) => sum + item.price, 0)

    const priorityColors = {
        HIGH: 'bg-red-100 text-red-700 border-red-200',
        MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        LOW: 'bg-green-100 text-green-700 border-green-200'
    }

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
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <IconHeart size={24} className="text-red-500" />
                        <h2 className="text-xl font-bold">My Wishlist</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <IconX size={20} />
                    </button>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 mb-6">
                    <div className="text-sm text-slate-600">Total Wishlist Value</div>
                    <div className="text-3xl font-bold text-red-600">{totalWishlistPrice} ৳</div>
                    <div className="text-sm text-slate-600 mt-1">{wishlist.length} books waiting</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-3">Add to Wishlist</h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                            placeholder="Book title"
                            value={form.title}
                            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                            className="col-span-2 p-2 border rounded-lg"
                        />
                        <input
                            placeholder="Author"
                            value={form.author}
                            onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))}
                            className="p-2 border rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Price (৳)"
                            value={form.price}
                            onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                            className="p-2 border rounded-lg"
                        />
                        <select
                            value={form.priority}
                            onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))}
                            className="p-2 border rounded-lg"
                        >
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM">Medium Priority</option>
                            <option value="LOW">Low Priority</option>
                        </select>
                        <button
                            onClick={addItem}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                            <IconPlus size={18} />
                            Add
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {wishlist.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <IconHeart size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>No books in wishlist</p>
                        </div>
                    ) : (
                        wishlist.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-slate-600">{item.author}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm font-semibold text-emerald-600">{item.price} ৳</span>
                                        <span className={`text-xs px-2 py-1 rounded border ${priorityColors[item.priority]}`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <IconTrash size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Wishlist;
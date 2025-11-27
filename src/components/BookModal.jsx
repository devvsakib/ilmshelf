import { useState } from 'react'
import { motion } from 'motion/react'
import { IconX, IconCheck, IconEyeOff } from '@tabler/icons-react'
import { uid } from '@/App'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

function BookModal({ book, shelves, onClose, onSave }) {
    const [form, setForm] = useState(book || {
        title: { en: '', bn: '' },
        authors: { writter: '', translator: '', publisher: '' },
        cover: '',
        price: '',
        pages: '',
        shelfId: shelves[0]?.id || '',
        readStatus: 'NOT_STARTED',
        private: false,
        notes: '',
        purchaseDate: '',
        publishedYear: '',
        isbn: '',
        description: ''
    })

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const updateNestedField = (parent, field, value) => {
        setForm(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }))
    }

    const handleSave = () => {
        if (!form.title.bn.trim()) {
            alert('বাংলা শিরোনাম প্রয়োজন (Bengali title required)')
            return
        }

        const bookData = {
            ...form,
            id: book?.id || uid(),
            price: Number(form.price) || 0,
            pages: Number(form.pages) || 0,
            publishedYear: Number(form.publishedYear) || new Date().getFullYear()
        }

        onSave(bookData)
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
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{book ? 'Edit Book' : 'Add New Book'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <IconX size={20} />
                    </button>
                </div>

                <div className="space-y-4 overflow-y-scroll max-h-[40%] ">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title (English)</label>
                            <input
                                value={form.title.en}
                                onChange={e => updateNestedField('title', 'en', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                placeholder="Enter English title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">শিরোনাম (বাংলা) *</label>
                            <input
                                value={form.title.bn}
                                onChange={e => updateNestedField('title', 'bn', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                placeholder="বাংলা শিরোনাম লিখুন"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">লেখক (Writer)</label>
                            <input
                                value={form.authors.writter}
                                placeholder='লেখকের নাম'
                                onChange={e => updateNestedField('authors', 'writter', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">অনুবাদক (Translator)</label>
                            <input
                                value={form.authors.translator}
                                placeholder='অনুবাদক নাম'
                                onChange={e => updateNestedField('authors', 'translator', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">প্রকাশনী (Publisher)</label>
                            <input
                                value={form.authors.publisher}
                                placeholder='প্রকাশনী নাম'
                                onChange={e => updateNestedField('authors', 'publisher', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                        <input
                            value={form.cover}
                            onChange={e => updateField('cover', e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="https://example.com/cover.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">দাম (Price) ৳</label>
                            <input
                                type="number"
                                placeholder='0'
                                value={form.price}
                                onChange={e => updateField('price', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">পৃষ্ঠা (Pages)</label>
                            <input
                                type="number"
                                placeholder='0'
                                value={form.pages}
                                onChange={e => updateField('pages', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Published Year</label>
                            <input
                                type="number"
                                placeholder={new Date().getFullYear()}
                                value={form.publishedYear}
                                onChange={e => updateField('publishedYear', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Shelf</label>
                            <select
                                value={form.shelfId}
                                onChange={e => updateField('shelfId', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            >
                                {shelves.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Reading Status</label>
                            <select
                                value={form.readStatus}
                                onChange={e => updateField('readStatus', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="NOT_STARTED">Not Started</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Purchase Date</label>
                        <input
                            type="date"
                            value={form.purchaseDate}
                            onChange={e => updateField('purchaseDate', e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ISBN</label>
                        <input
                            value={form.isbn}
                            onChange={e => updateField('isbn', e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="978-1234567890"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => updateField('description', e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            rows={3}
                            placeholder="Book description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={e => updateField('notes', e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            rows={2}
                            placeholder="Personal notes..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="private"
                            checked={form.private}
                            onChange={e => updateField('private', e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="private" className="text-sm font-medium flex items-center gap-2">
                            <IconEyeOff size={16} />
                            Make this book private
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <IconCheck size={18} />
                        {book ? 'Update' : 'Add'} Book
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default BookModal;
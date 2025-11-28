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

// shadcn/ui components
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

// Keep the component signature and all functions/props unchanged
export default function BookModal({ book, shelves, onClose, onSave }) {
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
        <Dialog open={true} onOpenChange={(open) => { if (!open) onClose?.() }}>
            <DialogContent className="max-w-2xl w-11/12">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">{book ? 'Edit Book' : 'Add New Book'}</h2>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title (English)</label>
                                <Input
                                    value={form.title.en}
                                    onChange={e => updateNestedField('title', 'en', e.target.value)}
                                    placeholder="Enter English title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">শিরোনাম (বাংলা) *</label>
                                <Input
                                    value={form.title.bn}
                                    onChange={e => updateNestedField('title', 'bn', e.target.value)}
                                    placeholder="বাংলা শিরোনাম লিখুন"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">লেখক (Writer)</label>
                                <Input
                                    value={form.authors.writter}
                                    placeholder='লেখকের নাম'
                                    onChange={e => updateNestedField('authors', 'writter', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">অনুবাদক (Translator)</label>
                                <Input
                                    value={form.authors.translator}
                                    placeholder='অনুবাদক নাম'
                                    onChange={e => updateNestedField('authors', 'translator', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">প্রকাশনী (Publisher)</label>
                                <Input
                                    value={form.authors.publisher}
                                    placeholder='প্রকাশনী নাম'
                                    onChange={e => updateNestedField('authors', 'publisher', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                            <Input
                                value={form.cover}
                                onChange={e => updateField('cover', e.target.value)}
                                placeholder="https://example.com/cover.jpg"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">দাম (Price) ৳</label>
                                <Input
                                    type="number"
                                    placeholder='0'
                                    value={form.price}
                                    onChange={e => updateField('price', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">পৃষ্ঠা (Pages)</label>
                                <Input
                                    type="number"
                                    placeholder='0'
                                    value={form.pages}
                                    onChange={e => updateField('pages', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Published Year</label>
                                <Input
                                    type="number"
                                    placeholder={new Date().getFullYear()}
                                    value={form.publishedYear}
                                    onChange={e => updateField('publishedYear', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Shelf</label>
                                <Select value={form.shelfId} onValueChange={val => updateField('shelfId', val)}>
                                    <SelectTrigger className="w-full">
                                        <span>{shelves.find(s => s.id === form.shelfId)?.name || 'Select shelf'}</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shelves.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Reading Status</label>
                                <Select value={form.readStatus} onValueChange={val => updateField('readStatus', val)}>
                                    <SelectTrigger className="w-full"><span>{form.readStatus}</span></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Purchase Date</label>
                            <Input
                                type="date"
                                value={form.purchaseDate}
                                onChange={e => updateField('purchaseDate', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">ISBN</label>
                            <Input
                                value={form.isbn}
                                onChange={e => updateField('isbn', e.target.value)}
                                placeholder="978-1234567890"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea
                                value={form.description}
                                onChange={e => updateField('description', e.target.value)}
                                rows={3}
                                placeholder="Book description..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <Textarea
                                value={form.notes}
                                onChange={e => updateField('notes', e.target.value)}
                                rows={2}
                                placeholder="Personal notes..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox checked={form.private} onCheckedChange={(v) => updateField('private', !!v)} id="private" />
                            <label htmlFor="private" className="text-sm font-medium flex items-center gap-2">
                                <IconEyeOff size={16} />
                                Make this book private
                            </label>
                        </div>
                    </div>

                    <DialogFooter className="mt-4 bg-white py-3">
                        <div className="flex justify-end gap-3 w-full">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={onClose}>Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleSave} className="flex items-center gap-2">
                                <IconCheck size={18} />
                                {book ? 'Update' : 'Add'} Book
                            </Button>
                        </div>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { IconCheck, IconEyeOff, IconUpload } from '@tabler/icons-react'
import { uid } from '@/App'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const emptyBook = (shelves) => ({
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
    description: '',
    tags: []
})

export default function BookModal({ book, shelves, onClose, onSave }) {
    const [form, setForm] = useState(() => book || emptyBook(shelves))
    const [coverFile, setCoverFile] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setForm(book ? {
            ...emptyBook(shelves),
            ...book,
            title: { en: '', bn: '', ...(book.title || {}) },
            authors: { writter: '', translator: '', publisher: '', ...(book.authors || {}) }
        } : emptyBook(shelves))
        setCoverFile(null)
    }, [book, shelves])

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const updateNestedField = (parent, field, value) => {
        setForm(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }))
    }

    // ---------- BN/EN detection & number normalization helpers ----------
    const hasBanglaChars = (s = '') => /[\u0980-\u09FF]/.test(String(s))
    const hasLatinChars = (s = '') => /[A-Za-z]/.test(String(s))

    const replaceBanglaDigits = (s = '') => {
        const map = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' }
        return String(s).split('').map(ch => map[ch] ?? ch).join('')
    }

    const parseBanglaNumberWords = (input = '') => {
        if (!input) return NaN
        const tokens = input
            .replace(/[,।]/g, ' ')
            .replace(/য়/g, 'য')
            .split(/\s+/)
            .filter(Boolean)

        const unitMap = {
            'শূন্য': 0, 'শূন্যে': 0, 'নাল': 0, '০': 0,
            'এক': 1, 'একটা': 1, 'একা': 1, '১': 1,
            'দুই': 2, 'দুইটা': 2, '২': 2,
            'তিন': 3, '৩': 3,
            'চার': 4, '৪': 4,
            'পাঁচ': 5, 'পাঁচটা': 5, 'পাঁচে': 5, '৫': 5,
            'ছয়': 6, 'ছয়ে': 6, '৬': 6,
            'সাত': 7, '৭': 7,
            'আট': 8, '৮': 8,
            'নয়': 9, '৯': 9,
            'দশ': 10, '১০': 10, 'একদশ': 11, 'এগারো': 11, 'বারো': 12,
            'তের': 13, 'চৌদ্দ': 14, 'পনের': 15, 'ষোল': 16, 'সতের': 17, 'আঠার': 18, 'উনিশ': 19,
            'বিশ': 20, 'ত্রিশ': 30, 'চল্লিশ': 40, 'পঞ্চাশ': 50, 'ষাট': 60, 'সত্তর': 70, 'আশি': 80, 'নব্বই': 90
        }

        const scaleMap = { 'শত': 100, 'শতক': 100, 'শতাংশ': 100, 'হাজার': 1000, 'লক্ষ': 100000, 'লক্ষ্য': 100000, 'কোটি': 10000000 }

        let total = 0
        let current = 0

        for (let raw of tokens) {
            const t = raw.trim()
            if (!t) continue

            if (/[\u09E6-\u09EF0-9]/.test(t)) {
                const replaced = replaceBanglaDigits(t)
                const n = parseInt(replaced, 10)
                if (!isNaN(n)) {
                    current += n
                    continue
                }
            }

            if (unitMap[t] !== undefined) {
                current += unitMap[t]
                continue
            }

            if (scaleMap[t]) {
                current = current === 0 ? 1 : current
                current = current * scaleMap[t]
                total += current
                current = 0
                continue
            }

            if (/^\d+$/.test(t)) {
                current += Number(t)
                continue
            }

            const maybeDigits = t.replace(/[^\d০১২৩৪৫৬৭৮৯]/g, '')
            if (maybeDigits) {
                const n = parseInt(replaceBanglaDigits(maybeDigits), 10)
                if (!isNaN(n)) { current += n; continue }
            }
        }

        return total + current
    }

    function normalizeNumberInput(raw) {
        if (raw === null || raw === undefined) return 0
        const s = String(raw).trim()
        if (s === '') return 0

        if ((hasBanglaChars(s) && /[০১২৩৪৫৬৭৮৯]/.test(s)) || /[অ-ঔক-হ]/i.test(s)) {
            const replaced = replaceBanglaDigits(s)
            const onlyDigits = replaced.replace(/[^\d]/g, '')
            if (onlyDigits) return Number(onlyDigits)

            const parsedWords = parseBanglaNumberWords(s)
            if (!isNaN(parsedWords)) return parsedWords
        }

        if (/^[০১২৩৪৫৬৭৮৯\s,]+$/.test(s)) {
            return Number(replaceBanglaDigits(s))
        }

        const cleaned = s.replace(/[,\s]/g, '')
        const m = cleaned.match(/-?\d+(\.\d+)?/)
        if (m) return Number(m[0])

        return 0
    }
    // ---------- end helpers ----------

    const handleSave = async () => {
        if (!String(form?.title?.bn || '').trim()) {
            alert('বাংলা শিরোনাম প্রয়োজন (Bengali title required)')
            return
        }

        const normalizedPrice = normalizeNumberInput(form.price)
        const normalizedPages = normalizeNumberInput(form.pages)

        const bookData = {
            ...form,
            id: book?.id || uid(),
            price: Number(normalizedPrice) || 0,
            pages: Number(normalizedPages) || 0,
            publishedYear: Number(form.publishedYear) || new Date().getFullYear()
        }

        try {
            setSaving(true)
            await onSave(bookData, coverFile)
        } finally {
            setSaving(false)
        }
    }

    const detectLangBadge = (text) => {
        return hasBanglaChars(text) ? 'bn' : hasLatinChars(text) ? 'en' : ''
    }

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open && !saving) onClose?.() }}>
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
                                <div className="relative">
                                    <Input
                                        value={form.title.en}
                                        onChange={e => updateNestedField('title', 'en', e.target.value)}
                                        placeholder="Enter English title"
                                    />
                                    <span className="absolute right-3 top-2 text-xs text-slate-500">{detectLangBadge(form.title.en)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">শিরোনাম (বাংলা) *</label>
                                <div className="relative">
                                    <Input
                                        value={form.title.bn}
                                        onChange={e => updateNestedField('title', 'bn', e.target.value)}
                                        placeholder="বাংলা শিরোনাম লিখুন"
                                    />
                                    <span className="absolute right-3 top-2 text-xs text-slate-500">{detectLangBadge(form.title.bn)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                                <Input
                                    value={form.cover}
                                    onChange={e => updateField('cover', e.target.value)}
                                    placeholder="https://example.com/cover.jpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                    <IconUpload size={15} /> Or Upload Cover File
                                </label>
                                <Input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={e => setCoverFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">দাম (Price) ৳</label>
                                <Input
                                    type="text"
                                    placeholder='0'
                                    value={form.price}
                                    onChange={e => updateField('price', e.target.value)}
                                />
                                <div className="text-xs text-slate-500 mt-1">Bengali digits or words accepted</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">পৃষ্ঠা (Pages)</label>
                                <Input
                                    type="text"
                                    placeholder='0'
                                    value={form.pages}
                                    onChange={e => updateField('pages', e.target.value)}
                                />
                                <div className="text-xs text-slate-500 mt-1">Bengali or Latin digits accepted</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Published Year</label>
                                <Input
                                    type="number"
                                    placeholder={String(new Date().getFullYear())}
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
                                value={form.purchaseDate || ''}
                                onChange={e => updateField('purchaseDate', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">ISBN</label>
                            <Input
                                value={form.isbn || ''}
                                onChange={e => updateField('isbn', e.target.value)}
                                placeholder="978-1234567890"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea
                                value={form.description || ''}
                                onChange={e => updateField('description', e.target.value)}
                                rows={3}
                                placeholder="Book description..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <Textarea
                                value={form.notes || ''}
                                onChange={e => updateField('notes', e.target.value)}
                                rows={2}
                                placeholder="Personal notes..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox checked={!!form.private} onCheckedChange={(v) => updateField('private', !!v)} id="private" />
                            <label htmlFor="private" className="text-sm font-medium flex items-center gap-2">
                                <IconEyeOff size={16} />
                                Make this book private
                            </label>
                        </div>
                    </div>

                    <DialogFooter className="mt-4 bg-white py-3">
                        <div className="flex justify-end gap-3 w-full">
                            <DialogClose asChild>
                                <Button variant="outline" disabled={saving} onClick={onClose}>Cancel</Button>
                            </DialogClose>
                            <Button disabled={saving} onClick={handleSave} className="flex items-center gap-2">
                                <IconCheck size={18} />
                                {saving ? 'Saving...' : `${book ? 'Update' : 'Add'} Book`}
                            </Button>
                        </div>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
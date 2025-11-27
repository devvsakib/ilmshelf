import React, { useState, useEffect, useMemo, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconSearch, IconShare, IconTrash, IconEdit, IconBook, IconChartBar, IconPlus, IconX, IconCheck, IconClock, IconEye, IconEyeOff, IconDownload, IconUpload } from '@tabler/icons-react'
import Header from './components/Header'
import ReadingGoals from './components/ReadingGoals'
import Wishlist from './components/Wishlist'
import LendingTracker from './components/LendingTracker'
import SummaryPage from './components/Summary'
import ShelfDetail from './components/ShelfDetail'
import ShelvesPage from './components/ShelvesPage'
import BookDetail from './components/BookDetail'
import BookModal from './components/BookModal'
import BookList from './components/BookList'

// Sample initial data
const INITIAL_BOOKS = [
  {
    "id": "b1",
    "title": { "en": "siratur-rasul-sa", "bn": "সীরাতুর রাসূল (ছাঃ)" },
    "authors": { "writter": "মুহাম্মদ আসাদুল্লাহ আল-গালিব", "publisher": "হাদীছ ফাউন্ডেশন বাংলাদেশ" },
    "cover": "https://sunnahbookshop.com/wp-content/uploads/2025/05/siratur-rasul-sa.webp",
    "price": 750,
    "pages": 854,
    "shelfId": "islamic",
    "readStatus": "IN_PROGRESS",
    "private": false,
    "notes": "Excellent biography of the Prophet",
    "readingTime": "14 days",
    "purchaseDate": "2024-06-15",
    "publishedYear": 2020,
    "isbn": "978-1906999736",
    "description": "আর রাহীকুল মাখতূম: একটি অনবদ্য সীরাত-গ্রন্থ।"
  },
  {
    "id": "b2",
    "title": { "en": "tafsir-ibn-kathir", "bn": "তাফসীর ইবনে কাসীর" },
    "authors": { "writter": "ইমাম ইবনে কাসীর", "translator": "মুহাম্মদ মুজিবুর রহমান", "publisher": "ইসলামিক ফাউন্ডেশন" },
    "cover": "https://via.placeholder.com/200x300/059669/ffffff?text=Tafsir",
    "price": 1200,
    "pages": 1500,
    "shelfId": "islamic",
    "readStatus": "NOT_STARTED",
    "private": false,
    "notes": "",
    "readingTime": "",
    "purchaseDate": "2024-08-20",
    "publishedYear": 2018,
    "description": "Comprehensive Quran commentary"
  }
]

const INITIAL_SHELVES = [
  { id: 'general', name: 'General', description: 'Everyday reads', color: 'blue' },
  { id: 'islamic', name: 'Islamic', description: 'Tafsir and Aqidah', color: 'emerald' }
]

export const uid = () => 'b' + Date.now() + Math.random().toString(36).slice(2, 9)

// Toast notification component
function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-900'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed left-1/2 -translate-x-1/2 bottom-6 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50`}
    >
      {type === 'success' && <IconCheck size={20} />}
      <div>{message}</div>
      <button onClick={onClose} className="ml-2">
        <IconX size={16} />
      </button>
    </motion.div>
  )
}

// Main App Component
export default function App() {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('ilmshelf_books')
    return saved ? JSON.parse(saved) : INITIAL_BOOKS
  })

  const [shelves] = useState(INITIAL_SHELVES)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [editingBookId, setEditingBookId] = useState(null)
  const [isAddingBook, setIsAddingBook] = useState(false)
  const [showGoals, setShowGoals] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showLending, setShowLending] = useState(false)

  // Save to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem('ilmshelf_books', JSON.stringify(books))
  }, [books])

  const filteredBooks = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) return books

    return books.filter(b => {
      const titleMatch = b.title.bn.toLowerCase().includes(term) || b.title.en.toLowerCase().includes(term)
      const authorMatch = Object.values(b.authors || {}).some(author =>
        author && author.toLowerCase().includes(term)
      )
      return titleMatch || authorMatch
    })
  }, [books, searchQuery])

  const addOrUpdateBook = (bookData) => {
    if (bookData.id && books.find(b => b.id === bookData.id)) {
      // Update existing
      setBooks(prev => prev.map(b => b.id === bookData.id ? bookData : b))
      showToast('Book updated successfully!', 'success')
    } else {
      // Add new
      setBooks(prev => [bookData, ...prev])
      showToast('Book added successfully!', 'success')
    }
    setEditingBookId(null)
    setIsAddingBook(false)
  }

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id))
    showToast('Book deleted', 'success')
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  const exportData = () => {
    const dataStr = JSON.stringify(books, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ilmshelf-backup-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    showToast('Data exported successfully!', 'success')
  }

  const importData = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result)
        if (Array.isArray(imported)) {
          setBooks(imported)
          showToast('Data imported successfully!', 'success')
        } else {
          showToast('Invalid file format', 'error')
        }
      } catch (err) {
        showToast('Failed to import data', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <Header
          q={searchQuery}
          setQ={setSearchQuery}
          onExport={exportData}
          onImport={importData}
          onOpenGoals={() => setShowGoals(true)}
          onOpenWishlist={() => setShowWishlist(true)}
          onOpenLending={() => setShowLending(true)}
        />

        <main className="pb-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-7xl mx-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">My Books</h1>
                      <p className="text-slate-600 mt-1">
                        {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} in collection
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingBook(true)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
                    >
                      <IconPlus size={20} />
                      Add Book
                    </button>
                  </div>
                  <BookList
                    books={filteredBooks}
                    onOpen={(id) => window.location.href = `/book/${id}`}
                  />
                </div>
              }
            />
            <Route
              path="/book/:id"
              element={
                <BookDetail
                  books={books}
                  setBooks={setBooks}
                  deleteBook={deleteBook}
                  openEdit={setEditingBookId}
                />
              }
            />
            <Route path="/shelves" element={<ShelvesPage shelves={shelves} books={books} />} />
            <Route
              path="/shelf/:id"
              element={
                <ShelfRoute
                  books={books}
                  shelves={shelves}
                  onOpen={(id) => window.location.href = `/book/${id}`}
                />
              }
            />
            <Route path="/summary" element={<SummaryPage books={books} />} />
            <Route path="*" element={<div className="p-6 text-center">Page not found</div>} />
          </Routes>
        </main>

        <AnimatePresence>
          {(isAddingBook || editingBookId) && (
            <BookModal
              book={editingBookId ? books.find(b => b.id === editingBookId) : null}
              shelves={shelves}
              onClose={() => {
                setIsAddingBook(false)
                setEditingBookId(null)
              }}
              onSave={addOrUpdateBook}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGoals && <ReadingGoals books={books} onClose={() => setShowGoals(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showWishlist && <Wishlist onClose={() => setShowWishlist(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showLending && <LendingTracker books={books} onClose={() => setShowLending(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

function ShelfRoute({ books, shelves, onOpen }) {
  const { id } = useParams()
  return <ShelfDetail books={books} shelves={shelves} shelfId={id} onOpen={onOpen} />
}
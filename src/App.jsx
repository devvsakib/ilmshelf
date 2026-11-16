import { useState, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX, IconCheck } from '@tabler/icons-react'
import Header from './components/Header'
import ReadingGoals from './components/ReadingGoals'
import Wishlist from './components/Wishlist'
import LendingTracker from './components/LendingTracker'
import SummaryPage from './components/Summary'
import ShelfDetail from './components/ShelfDetail'
import ShelvesPage from './components/ShelvesPage'
import BookDetail from './components/BookDetail'
import BookModal from './components/BookModal'
import DotsAndBoxes from './pages/DotsAndBoxes'
import Home from './pages/Home'
import AnalyticsPage from './components/AnalyticsPage'
import Writters from './pages/Writters'
import USApp from './pages/UdyoktaStudio'
import CosmeticsDemo from './pages/udyoktastudio/demo/CosmeticsDemo'
import NotFound from './pages/NotFound'
import GadgetsDemo from './pages/udyoktastudio/demo/GadgetsDemo'
import USAppLayout from './pages/USAppLayout'
import BookAppLayout from './pages/BookAppLayout'
import FashionDemo from './pages/udyoktastudio/demo/FashionDemo'
import HoneySeed from './pages/udyoktastudio/demo/HoneySeed'
import { useBooks } from './hooks/useBooks'

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

  const bgColor =
    type === 'success'
      ? 'bg-emerald-600'
      : type === 'error'
        ? 'bg-red-600'
        : 'bg-gray-900'

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

export default function App() {
  const {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook: removeBookFromApi,
    refetch
  } = useBooks({
    adminMode: true
  })

  const [isCoverHidden, setIsCoverHidden] = useState(() => {
    const settings = JSON.parse(localStorage.getItem('ilmshelf_settings') || '{}')
    return Boolean(settings.isCoverHidden)
  })
  const [shelves] = useState(INITIAL_SHELVES)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [editingBookId, setEditingBookId] = useState(null)
  const [isAddingBook, setIsAddingBook] = useState(false)
  const [showGoals, setShowGoals] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showLending, setShowLending] = useState(false)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  // Persist UI cover setting in localStorage
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('ilmshelf_settings') || '{}')
    settings.isCoverHidden = isCoverHidden
    localStorage.setItem('ilmshelf_settings', JSON.stringify(settings))
  }, [isCoverHidden])

  // Show API load error if fetching fails
  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error])

  const filteredBooks = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) return books

    return books.filter((b) => {
      const titleMatch =
        (b.title?.bn || '').toLowerCase().includes(term) ||
        (b.title?.en || '').toLowerCase().includes(term)
      const authorMatch = Object.values(b.authors || {}).some(
        (author) => author && author.toLowerCase().includes(term)
      )
      return titleMatch || authorMatch
    })
  }, [books, searchQuery])

  const addOrUpdateBook = async (bookData, coverFile) => {
    try {
      const exists = bookData.id && books.some((b) => b.id === bookData.id)
      if (exists) {
        await updateBook(bookData.id, bookData, coverFile)
        showToast('Book updated successfully!', 'success')
      } else {
        const payload = { ...bookData, id: bookData.id || uid() }
        await addBook(payload, coverFile)
        showToast('Book added successfully!', 'success')
      }
      setEditingBookId(null)
      setIsAddingBook(false)
    } catch (err) {
      showToast(err.message || 'Failed to save book', 'error')
    }
  }

  const deleteBook = async (id) => {
    try {
      await removeBookFromApi(id)
      showToast('Book deleted', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to delete book', 'error')
    }
  }

  // Compatibility wrapper in case BookDetail calls setBooks directly
  const handleSetBooks = async (updater) => {
    const nextBooks = typeof updater === 'function' ? updater(books) : updater
    if (!Array.isArray(nextBooks)) return

    for (const nextBook of nextBooks) {
      const prevBook = books.find((b) => b.id === nextBook.id)
      if (prevBook && JSON.stringify(prevBook) !== JSON.stringify(nextBook)) {
        try {
          await updateBook(nextBook.id, nextBook)
          showToast('Book updated!', 'success')
        } catch (err) {
          showToast(err.message || 'Failed to sync update', 'error')
        }
      }
    }
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

    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result)

        if (!Array.isArray(imported)) {
          showToast('Invalid file format', 'error')
          return
        }

        const existingNames = new Set(
          books.map((b) => (b.title?.bn || b.title?.en || '').trim().toLowerCase())
        )

        const newItems = imported.filter((item) => {
          const key = (item.title?.bn || item.title?.en || '').trim().toLowerCase()
          return key && !existingNames.has(key)
        })

        for (const item of newItems) {
          await addBook({ ...item, id: item.id || uid() })
        }

        await refetch()
        showToast(`Imported ${newItems.length} books successfully!`, 'success')
      } catch (err) {
        console.error(err)
        showToast(err.message || 'Failed to import data', 'error')
      } finally {
        e.target.value = ''
      }
    }

    reader.readAsText(file)
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
          isCoverHidden={isCoverHidden}
          setIsCoverHidden={setIsCoverHidden}
        />
        <main className="pb-8">
          <Routes>
            {/* Book Management App Routes */}
            <Route path="/" element={<BookAppLayout />}>
              <Route
                index
                element={
                  <Home
                    filteredBooks={filteredBooks}
                    loading={loading}
                    isCoverHidden={isCoverHidden}
                    setIsAddingBook={setIsAddingBook}
                  />
                }
              />
              <Route
                path="book/:id"
                element={
                  <BookDetail
                    books={books}
                    setBooks={handleSetBooks}
                    deleteBook={deleteBook}
                    openEdit={setEditingBookId}
                  />
                }
              />
              <Route path="shelves" element={<ShelvesPage shelves={shelves} books={books} />} />
              <Route path="analytics" element={<AnalyticsPage shelves={shelves} books={books} />} />
              <Route path="shelf/:id" element={<ShelfRoute books={books} shelves={shelves} />} />
              <Route path="summary" element={<SummaryPage books={books} />} />
              <Route path="writters" element={<Writters books={books} />} />
              <Route path="game" element={<DotsAndBoxes />} />
            </Route>

            {/* UdyoktaStudio App Routes */}
            <Route path="/usapp" element={<USAppLayout />}>
              <Route index element={<USApp />} />
              <Route path="demo/fashion" element={<FashionDemo />} />
              <Route path="demo/cosmetics" element={<CosmeticsDemo />} />
              <Route path="demo/gadgets" element={<GadgetsDemo />} />
              <Route path="demo/honeyseed" element={<HoneySeed />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <AnimatePresence>
          {(isAddingBook || editingBookId) && (
            <BookModal
              book={editingBookId ? books.find((b) => b.id === editingBookId) : null}
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

function ShelfRoute({ books, shelves }) {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <ShelfDetail
      books={books}
      shelves={shelves}
      shelfId={id}
      onOpen={(bookId) => navigate(`/book/${bookId}`)}
    />
  )
}
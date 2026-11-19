import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { IconX, IconCheck, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import ReadingGoals from './components/ReadingGoals';
import Wishlist from './components/Wishlist';
import LendingTracker from './components/LendingTracker';
import SummaryPage from './components/Summary';
import ShelfDetail from './components/ShelfDetail';
import ShelvesPage from './components/ShelvesPage';
import BookDetail from './components/BookDetail';
import BookModal from './components/BookModal';
import DotsAndBoxes from './pages/DotsAndBoxes';
import Home from './pages/Home';
import AnalyticsPage from './components/AnalyticsPage';
import Writters from './pages/Writters';
import NotFound from './pages/NotFound';
import BookAppLayout from './pages/BookAppLayout';
import { useBooks } from './hooks/useBooks';
import { useShelves } from './hooks/useShelves';
import { cn } from '@/lib/utils';
import { authStorage } from './services/bookApi';
import AdminLoginModal from './components/AdminLoginModal';

export const uid = () => 'b' + Date.now() + Math.random().toString(36).slice(2, 9);

function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: {
      wrapper: 'bg-primary text-primary-foreground border-primary/40',
      icon: IconCheck,
    },
    error: {
      wrapper: 'bg-destructive text-destructive-foreground border-destructive/40',
      icon: IconAlertCircle,
    },
    info: {
      wrapper: 'bg-foreground text-background border-border',
      icon: IconInfoCircle,
    },
  };

  const { wrapper, icon: StatusIcon } = styles[type] || styles.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.2 }}
      role="status"
      className={cn(
        'fixed left-1/2 -translate-x-1/2 bottom-6 border px-4 py-2.5 rounded-md shadow-lg flex items-center gap-2.5 z-50 text-xs sm:text-sm font-medium',
        wrapper
      )}
    >
      <StatusIcon size={17} className="shrink-0" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-1 p-0.5 rounded opacity-80 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <IconX size={15} />
      </button>
    </motion.div>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => authStorage.isLoggedIn());

  const {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook: removeBookFromApi,
    refetch,
  } = useBooks({ isAdmin });

  const { shelves, addShelf, updateShelf, deleteShelf } = useShelves();

  const [isCoverHidden, setIsCoverHidden] = useState(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('ilmshelf_settings') || '{}');
      return Boolean(settings.isCoverHidden);
    } catch {
      return false;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showLending, setShowLending] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleAuthChange = async (loggedIn) => {
    setIsAdmin(loggedIn);
    await refetch();
    showToast(loggedIn ? 'Admin mode unlocked' : 'Admin mode locked', 'success');
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('ilmshelf_settings') || '{}');
      settings.isCoverHidden = isCoverHidden;
      localStorage.setItem('ilmshelf_settings', JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [isCoverHidden]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  const filteredBooks = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return books;

    return books.filter((b) => {
      const titleMatch =
        (b.title?.bn || '').toLowerCase().includes(term) ||
        (b.title?.en || '').toLowerCase().includes(term);
      const authorMatch = Object.values(b.authors || {}).some(
        (author) => author && author.toLowerCase().includes(term)
      );
      return titleMatch || authorMatch;
    });
  }, [books, searchQuery]);

  const addOrUpdateBook = async (bookData, coverFile) => {
    try {
      const exists = bookData.id && books.some((b) => b.id === bookData.id);
      if (exists) {
        await updateBook(bookData.id, bookData, coverFile);
        showToast('Volume updated successfully!', 'success');
      } else {
        const payload = { ...bookData, id: bookData.id || uid() };
        await addBook(payload, coverFile);
        showToast('Volume cataloged successfully!', 'success');
      }
      setEditingBookId(null);
      setIsAddingBook(false);
    } catch (err) {
      showToast(err.message || 'Failed to save volume', 'error');
    }
  };

  const deleteBook = async (id) => {
    try {
      await removeBookFromApi(id);
      showToast('Volume removed from archive', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete volume', 'error');
    }
  };

  const handleAddShelf = async (payload) => {
    const created = await addShelf(payload);
    showToast(`Shelf "${created.name}" created!`, 'success');
    return created;
  };

  const handleUpdateShelf = async (id, payload) => {
    const updated = await updateShelf(id, payload);
    showToast(`Shelf "${updated.name}" updated!`, 'success');
    return updated;
  };

  const handleDeleteShelf = async (id) => {
    await deleteShelf(id);
    showToast('Shelf deleted', 'success');
  };

  const handleSetBooks = async (updater) => {
    const nextBooks = typeof updater === 'function' ? updater(books) : updater;
    if (!Array.isArray(nextBooks)) return;

    for (const nextBook of nextBooks) {
      const prevBook = books.find((b) => b.id === nextBook.id);
      if (prevBook && JSON.stringify(prevBook) !== JSON.stringify(nextBook)) {
        try {
          await updateBook(nextBook.id, nextBook);
          showToast('Volume updated!', 'success');
        } catch (err) {
          showToast(err.message || 'Failed to sync update', 'error');
        }
      }
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(books, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ilmshelf-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Archive exported successfully!', 'success');
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);

        if (!Array.isArray(imported)) {
          showToast('Invalid JSON format', 'error');
          return;
        }

        const existingNames = new Set(
          books.map((b) => (b.title?.bn || b.title?.en || '').trim().toLowerCase())
        );

        const newItems = imported.filter((item) => {
          const key = (item.title?.bn || item.title?.en || '').trim().toLowerCase();
          return key && !existingNames.has(key);
        });

        for (const item of newItems) {
          await addBook({ ...item, id: item.id || uid() });
        }

        await refetch();
        showToast(`Imported ${newItems.length} volumes successfully!`, 'success');
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to import archive', 'error');
      } finally {
        e.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
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
          isAdmin={isAdmin}
          onOpenAdmin={() => setShowAdminModal(true)}
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
                    isAdmin={isAdmin}
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
                    isAdmin={isAdmin}
                  />
                }
              />
              <Route
                path="shelves"
                element={
                  <ShelvesPage
                    shelves={shelves}
                    books={books}
                    onAddShelf={handleAddShelf}
                    onUpdateShelf={handleUpdateShelf}
                    onDeleteShelf={handleDeleteShelf}
                    isAdmin={isAdmin}
                  />
                }
              />
              <Route
                path="analytics"
                element={<AnalyticsPage shelves={shelves} books={books} isAdmin={isAdmin} />}
              />
              <Route
                path="shelf/:id"
                element={
                  <ShelfRoute
                    books={books}
                    shelves={shelves}
                    isCoverHidden={isCoverHidden}
                    loading={loading}
                    isAdmin={isAdmin}
                  />
                }
              />
              <Route path="summary" element={<SummaryPage books={books} isAdmin={isAdmin} />} />
              <Route path="writters" element={<Writters books={books} />} />
              <Route path="game" element={<DotsAndBoxes />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Modals & Drawers */}
        <AnimatePresence>
          {(isAddingBook || editingBookId) && (
            <BookModal
              book={editingBookId ? books.find((b) => b.id === editingBookId) : null}
              books={books}
              shelves={shelves}
              onClose={() => {
                setIsAddingBook(false);
                setEditingBookId(null);
              }}
              onSave={addOrUpdateBook}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGoals && (
            <ReadingGoals books={books} onClose={() => setShowGoals(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showWishlist && <Wishlist onClose={() => setShowWishlist(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showLending && (
            <LendingTracker books={books} onClose={() => setShowLending(false)} />
          )}
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

        <AnimatePresence>
          {showAdminModal && (
            <AdminLoginModal
              open={showAdminModal}
              onClose={() => setShowAdminModal(false)}
              onAuthChange={handleAuthChange}
            />
          )}
        </AnimatePresence>
      </div>
      <Analytics />
    </BrowserRouter>
  );
}

function ShelfRoute({ books, shelves, isCoverHidden, loading, isAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ShelfDetail
      books={books}
      shelves={shelves}
      shelfId={id}
      isCoverHidden={isCoverHidden}
      isLoading={loading}
      onOpen={(bookId) => navigate(`/book/${bookId}`)}
      isAdmin={isAdmin}
    />
  );
}
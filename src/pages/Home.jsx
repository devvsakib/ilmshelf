import { useNavigate } from 'react-router-dom';
import { IconPlus, IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import BookList from '@/components/BookList';

function Home({ filteredBooks = [], loading = false, isCoverHidden, setIsAddingBook, isAdmin }) {
  const navigate = useNavigate();

  const totalCount = filteredBooks.length;
  const completedCount = filteredBooks.filter(
    (b) => (b.readStatus || '').toUpperCase() === 'COMPLETED'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Editorial Catalog Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-border">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Personal Archive
          </p>
          <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mt-1">
            Cataloged Volumes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 tabular-nums">
            {loading ? (
              'Synchronizing library records...'
            ) : (
              <>
                Showing <span className="font-mono font-semibold text-foreground">{totalCount}</span>{' '}
                {totalCount === 1 ? 'volume' : 'volumes'}
                {totalCount > 0 && (
                  <>
                    {' · '}
                    <span className="font-mono font-medium text-primary">
                      {completedCount}
                    </span>{' '}
                    completed
                  </>
                )}
              </>
            )}
          </p>
        </div>

        {isAdmin && <Button
          type="button"
          onClick={() => setIsAddingBook(true)}
          className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm font-medium gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <IconPlus size={16} />
          <span>Add Volume</span>
        </Button>}
      </header>

      {/* Main Catalog Grid / Ledger */}
      {loading && totalCount === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-2.5">
          <IconLoader2 size={22} className="animate-spin text-primary" />
          <span className="font-mono text-xs uppercase tracking-widest">
            Loading Catalog...
          </span>
        </div>
      ) : (
        <BookList
          books={filteredBooks}
          onOpen={(id) => navigate(`/book/${id}`)}
          isCoverHidden={isCoverHidden}
        />
      )}

      {/* Colophon Footer */}
      <footer className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} <span className="font-editorial font-medium text-foreground">IlmShelf</span>. Personal Library Catalog.
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/devvsakib/ilmshelf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <span className="text-border">•</span>
          <a
            href="https://devvsakib.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Developed by Sakib Ahmed
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
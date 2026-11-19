import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  IconBookmark,
  IconBooks,
  IconArrowUpRight,
  IconCheck,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconLoader2,
} from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SHELF_ACCENTS = {
  emerald: {
    label: 'Botanical Forest',
    dot: 'bg-primary',
    badge: 'bg-primary/10 text-primary border-primary/25',
  },
  amber: {
    label: 'Burnished Ochre',
    dot: 'bg-ochre',
    badge: 'bg-ochre/12 text-ochre border-ochre/30',
  },
  blue: {
    label: 'Archival Indigo',
    dot: 'bg-[#1E3A5F]',
    badge: 'bg-[#1E3A5F]/10 text-[#1E3A5F] dark:text-[#7FA6D6] border-[#1E3A5F]/25',
  },
  rose: {
    label: 'Terracotta',
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive border-destructive/25',
  },
  slate: {
    label: 'Warm Slate',
    dot: 'bg-foreground/70',
    badge: 'bg-secondary text-foreground border-border',
  },
};

function getShelfAccent(color) {
  return SHELF_ACCENTS[color?.toLowerCase()] || SHELF_ACCENTS.emerald;
}

function ShelvesPage({
  shelves = [],
  books = [],
  isAdmin = false,
  onAddShelf,
  onUpdateShelf,
  onDeleteShelf,
}) {
  const navigate = useNavigate();

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', color: 'emerald' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete confirmation state
  const [shelfToDelete, setShelfToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const totalCatalogBooks = books.length;
  const totalCatalogValue = books.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  const openCreateModal = () => {
    if (!isAdmin) return;
    setEditingShelf(null);
    setForm({ name: '', description: '', color: 'emerald' });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (e, shelf) => {
    e.stopPropagation();
    if (!isAdmin) return;
    setEditingShelf(shelf);
    setForm({
      name: shelf.name || '',
      description: shelf.description || '',
      color: shelf.color || 'emerald',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!form.name.trim()) {
      setFormError('Shelf name is required');
      return;
    }

    try {
      setSaving(true);
      setFormError('');
      if (editingShelf) {
        await onUpdateShelf?.(editingShelf.id, form);
      } else {
        await onAddShelf?.(form);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save shelf');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!isAdmin || !shelfToDelete) return;
    try {
      setDeleting(true);
      await onDeleteShelf?.(shelfToDelete.id);
      setShelfToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const affectedBooksCount = shelfToDelete
    ? books.filter((b) => b.shelfId === shelfToDelete.id).length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Editorial Section Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 mb-6 border-b border-border">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Library Taxonomy
          </p>
          <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mt-1">
            Curated Shelves
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize volumes by subject, discipline, or study track.
          </p>
        </div>

        {/* Aggregate Summary Strip + New Shelf Button */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <div className="flex items-center gap-4 sm:gap-5 text-xs sm:text-sm bg-card border border-border rounded-md px-3.5 py-2">
            <div>
              <span className="text-muted-foreground">Shelves: </span>
              <span className="font-mono font-semibold text-foreground tabular-nums">
                {shelves.length}
              </span>
            </div>
            <span className="h-3.5 w-px bg-border" />
            <div>
              <span className="text-muted-foreground">Indexed: </span>
              <span className="font-mono font-semibold text-foreground tabular-nums">
                {totalCatalogBooks}
              </span>
            </div>
            <span className="h-3.5 w-px bg-border hidden sm:inline-block" />
            <div className="hidden sm:block">
              <span className="text-muted-foreground">Valuation: </span>
              <span className="font-mono font-semibold text-primary tabular-nums">
                {isAdmin ? `৳${totalCatalogValue.toLocaleString()}` : '--'}
              </span>
            </div>
          </div>

          {isAdmin && (
            <Button
              type="button"
              onClick={openCreateModal}
              className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm font-medium gap-1.5 shadow-2xs"
            >
              <IconPlus size={16} />
              <span>New Shelf</span>
            </Button>
          )}
        </div>
      </header>

      {/* Shelves Grid */}
      {!shelves.length ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/60 border border-dashed border-border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground mb-4">
            <IconBooks size={22} stroke={1.6} />
          </div>
          <h2 className="font-editorial text-lg font-medium text-foreground">
            No shelves configured yet
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
            {isAdmin
              ? 'Create subject shelves to categorize your library volumes.'
              : 'No subject shelves have been published yet.'}
          </p>
          {isAdmin && (
            <Button
              type="button"
              onClick={openCreateModal}
              className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium gap-1.5"
            >
              <IconPlus size={15} />
              <span>Create First Shelf</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {shelves.map((shelf, idx) => {
            const shelfBooks = books.filter((b) => b.shelfId === shelf.id);
            const totalValue = shelfBooks.reduce(
              (sum, b) => sum + (Number(b.price) || 0),
              0
            );
            const completedCount = shelfBooks.filter(
              (b) => (b.readStatus || '').toUpperCase() === 'COMPLETED'
            ).length;
            const completionPct =
              shelfBooks.length > 0
                ? Math.round((completedCount / shelfBooks.length) * 100)
                : 0;

            const accent = getShelfAccent(shelf.color);
            const shelfNo = String(idx + 1).padStart(2, '0');

            return (
              <motion.article
                key={shelf.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                onClick={() => navigate(`/shelf/${shelf.id}`)}
                className="group flex flex-col justify-between bg-card border border-border hover:border-primary/45 rounded-lg p-5 transition-all duration-200 hover:shadow-[0_6px_20px_-6px_rgba(28,25,23,0.12)] cursor-pointer"
              >
                {/* Top: Shelf Index, Actions & Description */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] tracking-wider text-muted-foreground tabular-nums">
                      SHELF · {shelfNo}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isAdmin && (
                        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => openEditModal(e, shelf)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            title="Edit shelf"
                            aria-label={`Edit ${shelf.name}`}
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShelfToDelete(shelf);
                            }}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete shelf"
                            aria-label={`Delete ${shelf.name}`}
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      )}

                      <div
                        className={cn(
                          'w-8 h-8 rounded-md border flex items-center justify-center transition-transform duration-200 group-hover:scale-105',
                          accent.badge
                        )}
                      >
                        <IconBookmark size={16} stroke={1.8} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bn-title text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {shelf.name}
                    </h2>
                    <IconArrowUpRight
                      size={16}
                      className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
                    />
                  </div>

                  {shelf.description && (
                    <p className="font-bn-body text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {shelf.description}
                    </p>
                  )}
                </div>

                {/* Bottom: Completion Hairline & Ledger Metrics */}
                <div className="mt-5 pt-4 border-t border-border space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <IconCheck size={12} className="text-primary" />
                        <span>
                          {completedCount} of {shelfBooks.length} read
                        </span>
                      </span>
                      <span className="font-mono tabular-nums">
                        {completionPct}%
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="font-mono text-xl font-bold text-foreground tabular-nums">
                        {shelfBooks.length}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        {shelfBooks.length === 1 ? 'volume' : 'volumes'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-base font-semibold text-primary tabular-nums">
                        {isAdmin ? `৳${totalValue.toLocaleString()}` : '--'}
                      </span>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                        Value
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Create / Edit Shelf Modal */}
      {isAdmin && (
        <Dialog open={modalOpen} onOpenChange={(open) => !saving && setModalOpen(open)}>
          <DialogContent className="max-w-md w-[94vw] p-0 gap-0 bg-card border-border overflow-hidden shadow-xl">
            <DialogHeader className="px-6 py-4 bg-background border-b border-border text-left">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {editingShelf ? 'Update Category' : 'New Category'}
              </p>
              <DialogTitle className="font-editorial text-xl font-semibold text-foreground mt-0.5">
                {editingShelf ? 'Edit Shelf' : 'Create Custom Shelf'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Configure shelf title, description, and accent color.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium">
                  <IconAlertCircle size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bn-body text-xs font-medium text-foreground mb-1.5">
                  Shelf Name (শেলফের নাম) <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    setFormError('');
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  placeholder="যেমন: হাদীস ও উলূমুল হাদীস বা History"
                  className="font-bn-title h-9 bg-background border-border"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Description
                </label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={2}
                  placeholder="Brief note about what belongs on this shelf..."
                  className="font-bn-body bg-background border-border text-sm resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Bookmark Accent
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(SHELF_ACCENTS).map(([key, meta]) => {
                    const active = form.color === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, color: key }))
                        }
                        className={cn(
                          'inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors',
                          active
                            ? 'bg-secondary border-primary text-foreground ring-1 ring-primary/30'
                            : 'bg-background border-border text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span
                          className={cn('w-2.5 h-2.5 rounded-full', meta.dot)}
                        />
                        <span>{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="pt-3 border-t border-border flex-row justify-end gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    className="h-9 px-4 bg-background border-border text-xs"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium gap-1.5"
                >
                  {saving ? (
                    <IconLoader2 size={14} className="animate-spin" />
                  ) : (
                    <IconCheck size={14} />
                  )}
                  <span>{editingShelf ? 'Save Changes' : 'Create Shelf'}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Shelf Confirmation Modal */}
      {isAdmin && (
        <Dialog
          open={Boolean(shelfToDelete)}
          onOpenChange={(open) => !open && !deleting && setShelfToDelete(null)}
        >
          <DialogContent className="max-w-md w-[94vw] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-editorial text-lg font-semibold text-foreground">
                Delete &ldquo;{shelfToDelete?.name}&rdquo;?
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground pt-1">
                {affectedBooksCount > 0 ? (
                  <>
                    This shelf currently contains{' '}
                    <strong className="text-foreground font-mono">
                      {affectedBooksCount}
                    </strong>{' '}
                    {affectedBooksCount === 1 ? 'volume' : 'volumes'}. The books
                    themselves will remain in your catalog, but they will become
                    unassigned until moved to another shelf.
                  </>
                ) : (
                  'This shelf has no volumes assigned to it and will be permanently removed.'
                )}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-2 flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={deleting}
                onClick={() => setShelfToDelete(null)}
                className="h-9 px-4 bg-background border-border text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="h-9 px-4 text-xs font-medium gap-1.5"
              >
                {deleting ? (
                  <IconLoader2 size={14} className="animate-spin" />
                ) : (
                  <IconTrash size={14} />
                )}
                <span>Delete Shelf</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ShelvesPage;
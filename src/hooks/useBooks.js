import { useState, useEffect, useCallback } from 'react';
import { bookApi } from '../services/bookApi';

// Module-level cache shared across all components & route changes
const booksCache = new Map();

function getCacheKey({ shelfId, adminMode }) {
    return `${shelfId || 'all'}_${adminMode ? 'admin' : 'public'}`;
}

export function useBooks({ shelfId, adminMode = false } = {}) {
    const cacheKey = getCacheKey({ shelfId, adminMode });

    const [books, setBooks] = useState(() => booksCache.get(cacheKey) || []);
    const [loading, setLoading] = useState(() => !booksCache.has(cacheKey));
    const [error, setError] = useState(null);

    const loadBooks = useCallback(
        async (force = false) => {
            // Return cached data immediately unless force-refreshed
            if (!force && booksCache.has(cacheKey)) {
                setBooks(booksCache.get(cacheKey));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await bookApi.getAll({ shelfId, adminMode });
                booksCache.set(cacheKey, data);
                setBooks(data);
            } catch (err) {
                setError(err.message || 'Failed to load books');
            } finally {
                setLoading(false);
            }
        },
        [cacheKey, shelfId, adminMode]
    );

    useEffect(() => {
        loadBooks(false);
    }, [loadBooks]);

    const invalidateAllCaches = () => {
        booksCache.clear();
    };

    const addBook = async (payload, coverFile) => {
        let coverUrl = payload.cover;
        if (coverFile) {
            coverUrl = await bookApi.uploadFile(coverFile);
        }
        const created = await bookApi.create({ ...payload, cover: coverUrl });
        invalidateAllCaches();
        await loadBooks(true);
        return created;
    };

    const updateBook = async (id, payload, coverFile) => {
        let coverUrl = payload.cover;
        if (coverFile) {
            coverUrl = await bookApi.uploadFile(coverFile);
        }
        const updated = await bookApi.update(id, { ...payload, cover: coverUrl });
        invalidateAllCaches();
        await loadBooks(true);
        return updated;
    };

    const deleteBook = async (id) => {
        await bookApi.remove(id);
        invalidateAllCaches();
        setBooks((prev) => {
            const next = prev.filter((book) => book.id !== id);
            booksCache.set(cacheKey, next);
            return next;
        });
    };

    return {
        books,
        loading,
        error,
        refetch: () => loadBooks(true),
        addBook,
        updateBook,
        deleteBook,
    };
}
import { useState, useEffect, useCallback } from 'react';
import { bookApi } from '../services/bookApi';

// Module-level cache & in-flight request tracker shared across route changes
const booksCache = new Map();
const inFlightRequests = new Map();

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
            if (!force && booksCache.has(cacheKey)) {
                setBooks(booksCache.get(cacheKey));
                setLoading(false);
                return booksCache.get(cacheKey);
            }

            try {
                setLoading(true);
                setError(null);

                // Deduplicate concurrent identical requests
                let requestPromise = inFlightRequests.get(cacheKey);
                if (!requestPromise || force) {
                    requestPromise = bookApi.getAll({ shelfId, adminMode });
                    inFlightRequests.set(cacheKey, requestPromise);
                }

                const data = await requestPromise;
                booksCache.set(cacheKey, data);
                setBooks(data);
                return data;
            } catch (err) {
                setError(err.message || 'Failed to load books');
                throw err;
            } finally {
                inFlightRequests.delete(cacheKey);
                setLoading(false);
            }
        },
        [cacheKey, shelfId, adminMode]
    );

    useEffect(() => {
        loadBooks(false).catch(() => { });
    }, [loadBooks]);

    const syncCacheAndState = (updater) => {
        setBooks((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            booksCache.clear();
            booksCache.set(cacheKey, next);
            return next;
        });
    };

    const addBook = async (payload, coverFile) => {
        let coverUrl = payload.cover;
        if (coverFile) {
            coverUrl = await bookApi.uploadFile(coverFile);
        }

        const newRecord = { ...payload, cover: coverUrl };
        const previousBooks = books;

        // Optimistic insert
        syncCacheAndState((prev) => [newRecord, ...prev]);

        try {
            const created = await bookApi.create(newRecord);
            const finalRecord = created && created.id ? created : newRecord;
            syncCacheAndState((prev) =>
                prev.map((b) => (b.id === newRecord.id ? finalRecord : b))
            );
            return finalRecord;
        } catch (err) {
            syncCacheAndState(previousBooks);
            throw err;
        }
    };

    const updateBook = async (id, payload, coverFile) => {
        let coverUrl = payload.cover;
        if (coverFile) {
            coverUrl = await bookApi.uploadFile(coverFile);
        }

        const updatedPayload = { ...payload, id, cover: coverUrl };
        const previousBooks = books;

        // Optimistic update
        syncCacheAndState((prev) =>
            prev.map((b) => (b.id === id ? { ...b, ...updatedPayload } : b))
        );

        try {
            const updated = await bookApi.update(id, updatedPayload);
            const finalRecord = updated && updated.id ? updated : updatedPayload;
            syncCacheAndState((prev) =>
                prev.map((b) => (b.id === id ? { ...b, ...finalRecord } : b))
            );
            return finalRecord;
        } catch (err) {
            syncCacheAndState(previousBooks);
            throw err;
        }
    };

    const deleteBook = async (id) => {
        const previousBooks = books;

        // Optimistic delete
        syncCacheAndState((prev) => prev.filter((book) => book.id !== id));

        try {
            await bookApi.remove(id);
        } catch (err) {
            syncCacheAndState(previousBooks);
            throw err;
        }
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
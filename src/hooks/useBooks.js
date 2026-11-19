import { useState, useEffect, useCallback } from 'react';
import { bookApi, authStorage } from '../services/bookApi';

const booksCache = new Map();
const inFlightRequests = new Map();

function getCacheKey(shelfId, isAdmin) {
    return `${shelfId || 'all'}_${isAdmin ? 'admin' : 'public'}`;
}

export function useBooks({ shelfId, isAdmin = authStorage.isLoggedIn() } = {}) {
    const cacheKey = getCacheKey(shelfId, isAdmin);

    const [books, setBooks] = useState(() => booksCache.get(cacheKey) || []);
    const [loading, setLoading] = useState(() => !booksCache.has(cacheKey));
    const [error, setError] = useState(null);

    const loadBooks = useCallback(
        async (force = false) => {
            const currentKey = getCacheKey(shelfId, isAdmin);

            if (!force && booksCache.has(currentKey)) {
                setBooks(booksCache.get(currentKey));
                setLoading(false);
                return booksCache.get(currentKey);
            }

            try {
                setLoading(true);
                setError(null);

                let requestPromise = inFlightRequests.get(currentKey);
                if (!requestPromise || force) {
                    requestPromise = bookApi.getAll({ shelfId });
                    inFlightRequests.set(currentKey, requestPromise);
                }

                const data = await requestPromise;
                booksCache.set(currentKey, data);
                setBooks(data);
                return data;
            } catch (err) {
                setError(err.message || 'Failed to load books');
                throw err;
            } finally {
                inFlightRequests.delete(currentKey);
                setLoading(false);
            }
        },
        [shelfId, isAdmin]
    );

    useEffect(() => {
        loadBooks(false).catch(() => { });
    }, [loadBooks]);

    const syncCacheAndState = (updater) => {
        const currentKey = getCacheKey(shelfId, isAdmin);
        setBooks((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            booksCache.clear();
            booksCache.set(currentKey, next);
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
        syncCacheAndState((prev) => prev.filter((book) => book.id !== id));

        try {
            await bookApi.remove(id);
        } catch (err) {
            syncCacheAndState(previousBooks);
            throw err;
        }
    };

    const refetch = useCallback(() => {
        booksCache.clear();
        return loadBooks(true);
    }, [loadBooks]);

    return {
        books,
        loading,
        error,
        refetch,
        addBook,
        updateBook,
        deleteBook,
    };
}
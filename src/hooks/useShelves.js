import { useState, useEffect, useCallback } from 'react';
import { shelfApi } from '../services/bookApi';

function sanitizeText(value = '') {
    return String(value || '')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function generateShelfId(name) {
    const slug = String(name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return slug ? `s-${slug}-${Date.now().toString(36)}` : `s-${Date.now().toString(36)}`;
}

export function useShelves() {
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadShelves = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await shelfApi.getAll();
            setShelves(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Failed to load shelves');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadShelves();
    }, [loadShelves]);

    const addShelf = async ({ name, description = '', color = 'emerald' }) => {
        const cleanName = sanitizeText(name);
        if (!cleanName) throw new Error('Shelf name is required');

        const newShelf = {
            id: generateShelfId(cleanName),
            name: cleanName,
            description: String(description || '').trim(),
            color,
        };

        const previous = shelves;
        setShelves((prev) => [...prev, newShelf]);

        try {
            const created = await shelfApi.create(newShelf);
            const finalShelf = created && created.id ? created : newShelf;
            setShelves((prev) =>
                prev.map((s) => (s.id === newShelf.id ? finalShelf : s))
            );
            return finalShelf;
        } catch (err) {
            setShelves(previous);
            throw err;
        }
    };

    const updateShelf = async (id, { name, description, color }) => {
        const cleanName = sanitizeText(name);
        if (!cleanName) throw new Error('Shelf name is required');

        const updates = {
            name: cleanName,
            description: String(description || '').trim(),
            color: color || 'emerald',
        };

        const previous = shelves;
        setShelves((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

        try {
            const updated = await shelfApi.update(id, updates);
            const finalShelf = updated && updated.id ? updated : { id, ...updates };
            setShelves((prev) =>
                prev.map((s) => (s.id === id ? { ...s, ...finalShelf } : s))
            );
            return finalShelf;
        } catch (err) {
            setShelves(previous);
            throw err;
        }
    };

    const deleteShelf = async (id) => {
        const previous = shelves;
        setShelves((prev) => prev.filter((s) => s.id !== id));

        try {
            await shelfApi.remove(id);
        } catch (err) {
            setShelves(previous);
            throw err;
        }
    };

    return {
        shelves,
        loading,
        error,
        addShelf,
        updateShelf,
        deleteShelf,
        refetchShelves: loadShelves,
    };
}
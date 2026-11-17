const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

async function handleResponse(res) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
}

export const bookApi = {
    // Fetch all books (pass adminMode = true to include private books)
    async getAll({ shelfId, adminMode = false } = {}) {
        const url = new URL(`${API_URL}/index.php`);
        if (shelfId) {
            url.searchParams.set('shelfId', shelfId);
        }

        const headers = {};
        if (adminMode && API_KEY) {
            headers['X-API-Key'] = API_KEY;
        }

        const res = await fetch(url.toString(), { headers });
        return handleResponse(res);
    },

    // Fetch a single book by ID (e.g., "b1")
    async getById(id) {
        const res = await fetch(`${API_URL}/index.php?id=${encodeURIComponent(id)}`);
        return handleResponse(res);
    },

    // Create a new book
    async create(payload) {
        const res = await fetch(`${API_URL}/index.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify(payload),
        });
        return handleResponse(res);
    },

    // Update an existing book
    async update(id, payload) {
        const res = await fetch(`${API_URL}/index.php?id=${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify(payload),
        });
        return handleResponse(res);
    },

    // Delete a book
    async remove(id) {
        const res = await fetch(`${API_URL}/index.php?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'X-API-Key': API_KEY,
            },
        });
        return handleResponse(res);
    },

    // Upload cover image or PDF to /uploads and return public URL
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URL}/upload.php`, {
            method: 'POST',
            headers: {
                'X-API-Key': API_KEY,
            },
            body: formData,
        });
        const data = await handleResponse(res);
        return data.url;
    },
};

export const shelfApi = {
    async getAll() {
        const res = await fetch(`${API_URL}/shelves.php`);
        return handleResponse(res);
    },

    async create(payload) {
        const res = await fetch(`${API_URL}/shelves.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify(payload),
        });
        return handleResponse(res);
    },

    async update(id, payload) {
        const res = await fetch(`${API_URL}/shelves.php?id=${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify(payload),
        });
        return handleResponse(res);
    },

    async remove(id) {
        const res = await fetch(`${API_URL}/shelves.php?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'X-API-Key': API_KEY,
            },
        });
        return handleResponse(res);
    },
};
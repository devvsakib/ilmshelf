const API_URL = (import.meta.env.VITE_API_BASE_URL || 'https://api.addeenweb.com').replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'ilmshelf_admin_token';

export const authStorage = {
    getToken: () => localStorage.getItem(TOKEN_STORAGE_KEY),
    setToken: (token) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
    clearToken: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
    isLoggedIn: () => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
};

function getAuthHeaders(extra = {}) {
    const token = authStorage.getToken();
    return token
        ? { ...extra, Authorization: `Bearer ${token}` }
        : extra;
}

async function handleResponse(res) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
        authStorage.clearToken();
    }
    if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
}

export const bookApi = {
    // Admin login -> stores 30-day signed token
    async login(password) {
        const res = await fetch(`${API_URL}/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        const data = await handleResponse(res);
        authStorage.setToken(data.token);
        return data;
    },

    logout() {
        authStorage.clearToken();
    },

    // Fetch all books (automatically includes private books when admin token is present)
    async getAll({ shelfId } = {}) {
        const url = new URL(`${API_URL}/index.php`);
        if (shelfId) {
            url.searchParams.set('shelfId', shelfId);
        }

        const res = await fetch(url.toString(), {
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Fetch a single book by ID (e.g., "b1")
    async getById(id) {
        const res = await fetch(`${API_URL}/index.php?id=${encodeURIComponent(id)}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Create a new book
    async create(payload) {
        const res = await fetch(`${API_URL}/index.php`, {
            method: 'POST',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(payload),
        });
        return handleResponse(res);
    },

    // Update an existing book
    async update(id, payload) {
        const res = await fetch(`${API_URL}/index.php?id=${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(payload),
        });
        return handleResponse(res);
    },

    // Delete a book
    async remove(id) {
        const res = await fetch(`${API_URL}/index.php?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Upload cover image or PDF to /uploads and return public URL
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URL}/upload.php`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData,
        });
        const data = await handleResponse(res);
        return data.url;
    },
};

export const shelfApi = {
    async getAll() {
        const res = await fetch(`${API_URL}/shelves.php`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    async create(payload) {
        const res = await fetch(`${API_URL}/shelves.php`, {
            method: 'POST',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(payload),
        });
        return handleResponse(res);
    },

    async update(id, payload) {
        const res = await fetch(`${API_URL}/shelves.php?id=${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(payload),
        });
        return handleResponse(res);
    },

    async remove(id) {
        const res = await fetch(`${API_URL}/shelves.php?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },
};
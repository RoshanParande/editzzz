export const ADMIN_TOKEN_KEY = 'roshan_admin_token';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();
const FALLBACK_API_BASE_URL = 'https://editzz.onrender.com';

function getApiBaseUrl() {
  if (API_BASE_URL) {
    return API_BASE_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && /\.vercel\.app$/i.test(window.location.hostname)) {
    return FALLBACK_API_BASE_URL;
  }
  return '';
}

function toApiUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return normalizedPath;
  return `${baseUrl}${normalizedPath}`;
}

export function api(path, options = {}) {
  return fetch(toApiUrl(path), { credentials: 'include', ...options })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    })
    .catch((err) => {
      if (err && err.message) throw err;
      throw new Error('Network error. Backend may be unavailable.');
    });
}

export function adminApi(path, options = {}) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!headers['Content-Type'] && options.body) headers['Content-Type'] = 'application/json';
  return api(path, { ...options, headers });
}

export function readFileDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

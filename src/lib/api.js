export const ADMIN_TOKEN_KEY = 'roshan_admin_token';

const API_BASE_URL = 'https://editzz.onrender.com';

function toApiUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
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

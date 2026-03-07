const ENV_SITE_URL = (import.meta.env.VITE_SITE_URL || '').trim();

export function getSiteUrl() {
  if (ENV_SITE_URL) return ENV_SITE_URL.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin.replace(/\/$/, '');
  return '';
}

export function toCanonicalUrl(pathname = '/') {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const siteUrl = getSiteUrl();
  return `${siteUrl}${cleanPath}`;
}

export function shortenText(text = '', max = 160) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, Math.max(0, max - 3)).trim()}...`;
}

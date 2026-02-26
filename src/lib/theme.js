export const THEME_KEY = 'roshan-editzz-theme';

export function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
  document.documentElement.style.backgroundColor = isDark ? '#0f172a' : '#f5f5f5';
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') {
    setTheme(saved);
    return;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

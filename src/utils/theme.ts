export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme_v1';

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.content = theme === 'dark' ? '#111110' : '#FAFAF9';
  }
}

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return 'dark';
}

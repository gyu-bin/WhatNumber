export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme_v1';

export type ThemeColors = {
  bg: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  favorite: string;
  accent: string;
  tipText: string;
  tipBg: string;
  tipBorder: string;
  overlay: string;
  chipActiveText: string;
};

const dark: ThemeColors = {
  bg: '#111110',
  surface: '#1a1a18',
  border: '#2a2a26',
  textPrimary: '#ededea',
  textSecondary: '#a8a8a2',
  textTertiary: '#6f6f6a',
  favorite: '#f59e0b',
  accent: '#3b6fd4',
  tipText: '#fbbf24',
  tipBg: 'rgba(251, 191, 36, 0.08)',
  tipBorder: 'rgba(253, 230, 138, 0.35)',
  overlay: 'rgba(0,0,0,0.55)',
  chipActiveText: '#1a1a18',
};

const light: ThemeColors = {
  bg: '#fafaf9',
  surface: '#ffffff',
  border: '#e8e8e4',
  textPrimary: '#111110',
  textSecondary: '#6f6f6a',
  textTertiary: '#a8a8a2',
  favorite: '#f59e0b',
  accent: '#3b6fd4',
  tipText: '#92400e',
  tipBg: '#fffbeb',
  tipBorder: '#fde68a',
  overlay: 'rgba(0,0,0,0.4)',
  chipActiveText: '#ffffff',
};

export function getThemeColors(theme: Theme): ThemeColors {
  return theme === 'dark' ? dark : light;
}

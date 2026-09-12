export type Theme = 'light' | 'dark';
export type ViewMode = 'list' | 'card';

export const THEME_STORAGE_KEY = 'theme_v2';
export const VIEW_MODE_STORAGE_KEY = 'view_mode_v1';

export type ThemeColors = {
  bg: string;
  heroBg: string;
  surface: string;
  border: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  favorite: string;
  accent: string;
  accentMuted: string;
  tipText: string;
  tipBg: string;
  overlay: string;
  chipActiveBg: string;
  chipActiveText: string;
};

/** Light: warm white base; coral is reserved for action and selected states. */
const light: ThemeColors = {
  bg: '#fcfbfa',
  heroBg: '#fff7f6',
  surface: '#ffffff',
  border: '#eeeeec',
  divider: '#f1f0ee',
  textPrimary: '#191919',
  textSecondary: '#747474',
  textTertiary: '#9b9b9b',
  favorite: '#f2a900',
  accent: '#ff5a55',
  accentMuted: '#fff0ef',
  tipText: '#5c5c5c',
  tipBg: '#f4f4f2',
  overlay: 'rgba(25,25,25,0.45)',
  chipActiveBg: '#fff0ef',
  chipActiveText: '#ff5a55',
};

const dark: ThemeColors = {
  bg: '#151515',
  heroBg: '#211918',
  surface: '#202020',
  border: '#303030',
  divider: '#2b2b2b',
  textPrimary: '#f7f5f3',
  textSecondary: '#b0aeab',
  textTertiary: '#85827f',
  favorite: '#f2b400',
  accent: '#ff6b66',
  accentMuted: '#3b2929',
  tipText: '#c4c4c4',
  tipBg: '#242424',
  overlay: 'rgba(0,0,0,0.55)',
  chipActiveBg: '#3b2929',
  chipActiveText: '#ff8a86',
};

export function getThemeColors(theme: Theme): ThemeColors {
  return theme === 'dark' ? dark : light;
}

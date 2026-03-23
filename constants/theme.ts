import { Platform, useColorScheme } from 'react-native';
import { themes, ThemeName } from './colors';

// Mappa dark/light mode del sistema → tema Ripple
const schemeMap: Record<'light' | 'dark', ThemeName> = {
  light: 'light',
  dark: 'claude',
};

export function useTheme() {
  const scheme = useColorScheme() ?? 'dark';
  return themes[schemeMap[scheme]];
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
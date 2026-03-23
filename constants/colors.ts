export type Theme = {
  // Sfondi
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundCard: string;
  backgroundInput: string;

  // Testo
  textPrimary: string;
  textSecondary: string;
  textHint: string;

  // Accento
  accent: string;
  accentLight: string;
  accentText: string;

  // Bordi
  borderDefault: string;
  borderAccent: string;

  // Tab bar
  tabActive: string;
  tabInactive: string;
  tabBackground: string;

  // Toggle
  toggleOn: string;
  toggleOff: string;
  toggleThumb: string;

  // Pulsante primario
  buttonBackground: string;
  buttonText: string;

  // Banner / info strip
  bannerBackground: string;
  bannerText: string;
  bannerBorder: string;
};

export const themes: Record<string, Theme> = {

  // ─── Claude (default) ────────────────────────────────────────────
  claude: {
    backgroundPrimary:   '#1c1812',
    backgroundSecondary: '#242018',
    backgroundCard:      '#242018',
    backgroundInput:     '#242018',

    textPrimary:         '#f5ede0',
    textSecondary:       '#8a7a68',
    textHint:            '#555048',

    accent:              '#D85A30',
    accentLight:         '#3a2218',
    accentText:          '#F0997B',

    borderDefault:       '#3a3028',
    borderAccent:        '#D85A30',

    tabActive:           '#D85A30',
    tabInactive:         '#555048',
    tabBackground:       '#1c1812',

    toggleOn:            '#D85A30',
    toggleOff:           '#3a3028',
    toggleThumb:         '#ffffff',

    buttonBackground:    '#D85A30',
    buttonText:          '#fff5ee',

    bannerBackground:    '#2a1e12',
    bannerText:          '#F0997B',
    bannerBorder:        '#D85A30',
  },

  // ─── Dark ────────────────────────────────────────────────────────
  dark: {
    backgroundPrimary:   '#0f0f0f',
    backgroundSecondary: '#1a1a1a',
    backgroundCard:      '#1e1e1e',
    backgroundInput:     '#1e1e1e',

    textPrimary:         '#f0f0f0',
    textSecondary:       '#888888',
    textHint:            '#444444',

    accent:              '#7C6FCD',
    accentLight:         '#1e1a35',
    accentText:          '#AFA9EC',

    borderDefault:       '#2a2a2a',
    borderAccent:        '#7C6FCD',

    tabActive:           '#7C6FCD',
    tabInactive:         '#444444',
    tabBackground:       '#0f0f0f',

    toggleOn:            '#7C6FCD',
    toggleOff:           '#2a2a2a',
    toggleThumb:         '#ffffff',

    buttonBackground:    '#7C6FCD',
    buttonText:          '#f0eeff',

    bannerBackground:    '#1a1535',
    bannerText:          '#AFA9EC',
    bannerBorder:        '#7C6FCD',
  },

  // ─── Light ───────────────────────────────────────────────────────
  light: {
    backgroundPrimary:   '#ffffff',
    backgroundSecondary: '#f5f5f5',
    backgroundCard:      '#ffffff',
    backgroundInput:     '#f9f9f9',

    textPrimary:         '#1a1a1a',
    textSecondary:       '#666666',
    textHint:            '#aaaaaa',

    accent:              '#D85A30',
    accentLight:         '#fdf0eb',
    accentText:          '#993C1D',

    borderDefault:       '#e0e0e0',
    borderAccent:        '#D85A30',

    tabActive:           '#D85A30',
    tabInactive:         '#aaaaaa',
    tabBackground:       '#ffffff',

    toggleOn:            '#D85A30',
    toggleOff:           '#cccccc',
    toggleThumb:         '#ffffff',

    buttonBackground:    '#D85A30',
    buttonText:          '#ffffff',

    bannerBackground:    '#fdf0eb',
    bannerText:          '#993C1D',
    bannerBorder:        '#D85A30',
  },

  // ─── Bianco, grigio e nero ────────────────────────────────────────
  monochrome: {
    backgroundPrimary:   '#ffffff',
    backgroundSecondary: '#f2f2f2',
    backgroundCard:      '#ffffff',
    backgroundInput:     '#f7f7f7',

    textPrimary:         '#111111',
    textSecondary:       '#555555',
    textHint:            '#bbbbbb',

    accent:              '#111111',
    accentLight:         '#eeeeee',
    accentText:          '#111111',

    borderDefault:       '#dddddd',
    borderAccent:        '#111111',

    tabActive:           '#111111',
    tabInactive:         '#aaaaaa',
    tabBackground:       '#ffffff',

    toggleOn:            '#111111',
    toggleOff:           '#cccccc',
    toggleThumb:         '#ffffff',

    buttonBackground:    '#111111',
    buttonText:          '#ffffff',

    bannerBackground:    '#f2f2f2',
    bannerText:          '#333333',
    bannerBorder:        '#bbbbbb',
  },

  // ─── Bianco e verde chiaro ────────────────────────────────────────
  mint: {
    backgroundPrimary:   '#ffffff',
    backgroundSecondary: '#f0faf5',
    backgroundCard:      '#ffffff',
    backgroundInput:     '#f5fdf8',

    textPrimary:         '#1a2e22',
    textSecondary:       '#4a7a5a',
    textHint:            '#a0c8b0',

    accent:              '#1D9E75',
    accentLight:         '#e1f5ee',
    accentText:          '#0F6E56',

    borderDefault:       '#c8e8d8',
    borderAccent:        '#1D9E75',

    tabActive:           '#1D9E75',
    tabInactive:         '#a0c8b0',
    tabBackground:       '#ffffff',

    toggleOn:            '#1D9E75',
    toggleOff:           '#c8e8d8',
    toggleThumb:         '#ffffff',

    buttonBackground:    '#1D9E75',
    buttonText:          '#ffffff',

    bannerBackground:    '#e1f5ee',
    bannerText:          '#0F6E56',
    bannerBorder:        '#1D9E75',
  },

  // ─── Ocean ───────────────────────────────────────────────────────
  ocean: {
    backgroundPrimary:   '#05101f',
    backgroundSecondary: '#0a1a2e',
    backgroundCard:      '#0d1f38',
    backgroundInput:     '#0d1f38',

    textPrimary:         '#e0f0ff',
    textSecondary:       '#6a9abf',
    textHint:            '#2a4a6a',

    accent:              '#378ADD',
    accentLight:         '#0a1e38',
    accentText:          '#85B7EB',

    borderDefault:       '#112a45',
    borderAccent:        '#378ADD',

    tabActive:           '#378ADD',
    tabInactive:         '#2a4a6a',
    tabBackground:       '#05101f',

    toggleOn:            '#378ADD',
    toggleOff:           '#112a45',
    toggleThumb:         '#ffffff',

    buttonBackground:    '#378ADD',
    buttonText:          '#e0f0ff',

    bannerBackground:    '#0a1e38',
    bannerText:          '#85B7EB',
    bannerBorder:        '#378ADD',
  },
};

export type ThemeName = keyof typeof themes;

export const defaultTheme: ThemeName = 'claude';
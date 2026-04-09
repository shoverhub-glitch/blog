export type ThemeMode = 'light' | 'dark';

export const baseColors = {
  black: '#000000',
  white: '#FFFFFF',
} as const;

export const codeBlockColors = {
  background: '#1E1E1E',
  fallbackLanguage: '#888888',
  gutterBorder: '#333333',
  gutterText: '#555555',
  keyword: '#C586C0',
  string: '#CE9178',
  number: '#B5CEA8',
  comment: '#6A9955',
  language: {
    javascript: '#F7DF1E',
    js: '#F7DF1E',
    typescript: '#3178C6',
    ts: '#3178C6',
    python: '#3572A5',
    py: '#3572A5',
    html: '#E34C26',
    css: '#563D7C',
    json: '#292929',
    bash: '#4EAA25',
    shell: '#4EAA25',
    sql: '#E38C00',
    java: '#B07219',
    go: '#00ADD8',
    rust: '#DEA584',
    ruby: '#701516',
    php: '#4F5D95',
    csharp: '#178600',
    cpp: '#F34B7D',
    c: '#555555',
    markdown: '#083FA1',
    md: '#083FA1',
    yaml: '#CB171E',
    yml: '#CB171E',
  },
} as const;

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    background: string;
    surface: string;
    surfaceHover: string;
    surfaceElevated: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
    accent: string;
    accentLight: string;
    accentHover: string;
    accentGold: string;
    accentGoldLight: string;
    error: string;
    errorLight: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    gradient1: string;
    gradient2: string;
    overlay: string;
  };
  typography: {
    fontFamily: string;
    displayFont: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      black: number;
    };
    lineHeight: {
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  shadows: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
    glowLg: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#0A0A0A',
    primaryHover: '#262626',
    primaryLight: '#F5F5F3',
    background: '#FAFAF8',
    surface: '#FFFFFF',
    surfaceHover: '#F7F6F3',
    surfaceElevated: '#FFFFFF',
    text: '#0A0A0A',
    textSecondary: '#404040',
    textMuted: '#737373',
    border: '#E5E5E2',
    borderLight: '#F0EFEB',
    accent: '#E84C31',
    accentLight: '#FEF3F0',
    accentHover: '#D43E22',
    accentGold: '#B8860B',
    accentGoldLight: '#FDF8E7',
    error: '#DC2626',
    errorLight: '#FEF2F2',
    success: '#16A34A',
    successLight: '#F0FDF4',
    warning: '#D97706',
    warningLight: '#FFFBEB',
    gradient1: '#0A0A0A',
    gradient2: '#E84C31',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
    displayFont: '"Playfair Display", "Source Serif Pro", Georgia, serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.8125rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    lineHeight: {
      tight: '1.15',
      snug: '1.35',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 50px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.06)',
    glow: '0 0 30px rgba(232, 76, 49, 0.2)',
    glowLg: '0 0 60px rgba(232, 76, 49, 0.25)',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  mode: 'dark',
  colors: {
    primary: '#FAFAFA',
    primaryHover: '#FFFFFF',
    primaryLight: '#262626',
    background: '#0C0C0B',
    surface: '#171716',
    surfaceHover: '#1E1E1C',
    surfaceElevated: '#222220',
    text: '#FAFAFA',
    textSecondary: '#A3A3A3',
    textMuted: '#737373',
    border: '#2E2E2B',
    borderLight: '#232321',
    accent: '#FF7F50',
    accentLight: '#2D1510',
    accentHover: '#FF9466',
    accentGold: '#F5C842',
    accentGoldLight: '#2A2005',
    error: '#F87171',
    errorLight: '#2D1515',
    success: '#4ADE80',
    successLight: '#0D2818',
    warning: '#FBBF24',
    warningLight: '#2A2005',
    gradient1: '#FAFAFA',
    gradient2: '#FF7F50',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

export const withAlpha = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const adjustBrightness = (hex: string, factor: number) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.max(0, Math.round(r * factor))),
    Math.min(255, Math.max(0, Math.round(g * factor))),
    Math.min(255, Math.max(0, Math.round(b * factor)))
  );
};

export const getCategoryColors = (theme: Theme, index: number) => {
  const palette = [
    { accent: theme.colors.accent, bgFactor: 0.95, textDark: true },
    { accent: theme.colors.accentGold, bgFactor: 0.95, textDark: true },
    { accent: theme.colors.success, bgFactor: 0.95, textDark: true },
    { accent: theme.colors.error, bgFactor: 0.95, textDark: true },
    { accent: theme.colors.warning, bgFactor: 0.95, textDark: true },
    { accent: theme.colors.primary, bgFactor: 0.95, textDark: false },
  ];

  const colorIndex = index % palette.length;
  const { accent, bgFactor, textDark } = palette[colorIndex];
  const bg = adjustBrightness(accent, bgFactor);
  const text = textDark ? adjustBrightness(accent, 0.7) : adjustBrightness(accent, 1.2);

  return { bg, text, accent };
};

export const applyThemeVariables = (theme: Theme, root: HTMLElement) => {
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-surface-hover', theme.colors.surfaceHover);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-border-light', theme.colors.borderLight);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-accent-light', theme.colors.accentLight);
  root.style.setProperty('--color-on-accent', theme.colors.background);
  root.style.setProperty('--font-body', theme.typography.fontFamily);
  root.style.setProperty('--font-display', theme.typography.displayFont);
  root.style.backgroundColor = theme.colors.background;
  root.style.color = theme.colors.text;
};

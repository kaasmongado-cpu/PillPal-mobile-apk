/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    backgroundElement: '#ffffff',
    backgroundSelected: '#f1f5f9',
    textSecondary: '#64748b',
    primary: '#0d9488', // Clinical Teal
    primaryHover: '#0f766e',
    primaryLight: '#ccfbf1',
    primaryText: '#ffffff',
    secondary: '#0284c7', // Medical Blue
    secondaryLight: '#e0f2fe',
    accent: '#6366f1',
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    border: '#e2e8f0',
    card: '#ffffff',
    cardBorder: '#e2e8f0',
  },
  dark: {
    text: '#f8fafc',
    background: '#090d16',
    backgroundElement: '#131b2e',
    backgroundSelected: '#1e293b',
    textSecondary: '#94a3b8',
    primary: '#14b8a6', // Bright Teal
    primaryHover: '#0d9488',
    primaryLight: 'rgba(20, 184, 166, 0.15)',
    primaryText: '#ffffff',
    secondary: '#38bdf8',
    secondaryLight: 'rgba(56, 189, 248, 0.15)',
    accent: '#818cf8',
    success: '#34d399',
    successLight: 'rgba(52, 211, 153, 0.15)',
    warning: '#fbbf24',
    warningLight: 'rgba(251, 191, 36, 0.15)',
    danger: '#f87171',
    dangerLight: 'rgba(248, 113, 113, 0.15)',
    border: '#1e293b',
    card: '#131b2e',
    cardBorder: '#1e293b',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

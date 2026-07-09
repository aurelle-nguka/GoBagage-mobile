export const Colors = {
  primary: '#00C853',
  primaryForeground: '#ffffff',

  secondary: '#2196F3',
  secondaryForeground: '#ffffff',

  background: '#F8F9FA',
  foreground: '#2C3E50',

  card: '#ffffff',
  cardForeground: '#2C3E50',

  muted: '#f0f2f5',
  mutedForeground: '#6b7280',

  destructive: '#F44336',
  destructiveForeground: '#ffffff',

  warning: '#FF9800',
  warningForeground: '#ffffff',

  border: 'rgba(44, 62, 80, 0.1)',
  input: 'transparent',
  inputBackground: '#f3f4f6',

  ring: '#00C853',

  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

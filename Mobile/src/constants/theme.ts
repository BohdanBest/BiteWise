// src/constants/theme.ts
export const Theme = {
  colors: {
    background: 'hsl(150, 30%, 4%)',
    foreground: 'hsl(0, 0%, 96%)',
    card: 'hsl(150, 15%, 8%)',
    cardForeground: 'hsl(0, 0%, 96%)',
    primary: 'hsl(142, 71%, 45%)',
    primaryDark: 'hsl(142, 76%, 36%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    secondary: 'hsl(152, 60%, 52%)',
    accent: 'hsl(150, 15%, 12%)',
    muted: 'hsl(150, 10%, 12%)',
    mutedForeground: 'hsl(150, 8%, 50%)',
    destructive: 'hsl(0, 72%, 51%)',
    warning: 'hsl(38, 92%, 50%)',
    border: 'hsl(150, 10%, 15%)',
    ring: 'hsl(142, 71%, 45%)',
  },
  typography: {
    displayXl: {
      fontFamily: 'SpaceGrotesk_700Bold',
      fontSize: 48,
      letterSpacing: -1,
    },
    h1: {
      fontFamily: 'SpaceGrotesk_700Bold',
      fontSize: 30,
    },
    h2: {
      fontFamily: 'SpaceGrotesk_600SemiBold',
      fontSize: 24,
    },
    h3: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 20,
    },
    bodyL: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
    },
    body: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
    },
    caption: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: 'hsl(150, 8%, 50%)',
    },
    overline: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      textTransform: 'uppercase' as const,
      letterSpacing: 2,
    },
    tabularNums: {
      fontFamily: 'SpaceGrotesk_700Bold',
      // fontVariant: ['tabular-nums'], // causes clipping on Android
    }
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 12, // gap-3
    l: 16,
    xl: 32, // додано xl
    pageHorizontal: 20, // px-5
    pageVerticalTop: 24, // pt-6
    pageVerticalBottom: 96, // pb-24 (safe area + bottom nav)
    section: 24, // space-y-6
  },
  radius: {
    global: 20,
    lg: 20,
    md: 18,
    sm: 16,
    full: 9999,
  },
  shadows: {
    premium: {
      shadowColor: 'hsl(150, 30%, 4%)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
    glowPrimary: {
      shadowColor: 'hsl(142, 71%, 45%)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    }
  }
};

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { Theme } from '../constants/theme';

export function useTheme() {
  const colors = useThemeStore((state) => state.getColors());
  const isDark = useThemeStore((state) => state.isDark());

  return {
    colors,
    isDark,
    typography: Theme.typography,
    spacing: Theme.spacing,
    radius: Theme.radius,
    shadows: Theme.shadows,
  };
}

export function useStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  createStyles: (theme: ReturnType<typeof useTheme>) => T
) {
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => StyleSheet.create(createStyles(theme)), [theme.colors]);
}

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface LinearProgressProps {
  currentValue: number;
  maxValue: number;
  color?: string;
  height?: number;
}

export default function LinearProgress({
  currentValue,
  maxValue,
  color,
  height = 8,
}: LinearProgressProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const finalColor = color || theme.colors.primary;
  const percent = maxValue > 0 ? Math.min(Math.max(currentValue / maxValue, 0), 1) * 100 : 0;

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.bar, { width: `${percent}%`, backgroundColor: finalColor }]} />
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  }
});

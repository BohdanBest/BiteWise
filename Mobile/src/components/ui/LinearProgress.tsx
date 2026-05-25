import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface LinearProgressProps {
  currentValue: number;
  maxValue: number;
  color?: string;
  height?: number;
}

export default function LinearProgress({
  currentValue,
  maxValue,
  color = Theme.colors.primary,
  height = 8,
}: LinearProgressProps) {
  const percent = maxValue > 0 ? Math.min(Math.max(currentValue / maxValue, 0), 1) * 100 : 0;

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.bar, { width: `${percent}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  }
});

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface LoadingStepProps {
  spin: Animated.AnimatedInterpolation<string | number>;
}

export default function LoadingStep({ spin }: LoadingStepProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  return (
    <View style={[styles.container, styles.centerAll]}>

      <View style={styles.spinnerWrapper}>
        <Animated.View style={[styles.loadingCircle, { transform: [{ rotate: spin as any }] }]} />
        <View style={styles.sparklesPos}>
          <Sparkles size={36} color={theme.colors.primary} strokeWidth={1.5} />
        </View>
      </View>
      
      <Text style={styles.loadingTitle}>Аналізуємо страву...</Text>
      <Text style={styles.loadingSubtitle}>AI розпізнає вашу їжу</Text>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.pageHorizontal,
    justifyContent: 'space-between',
    paddingBottom: 130,
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
    position: 'relative',
  },
  loadingCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(21, 191, 99, 0.2)',
    borderTopColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  sparklesPos: {
    position: 'absolute',
  },
  loadingTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 20,
    color: theme.colors.foreground,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontFamily: 'System',
    fontSize: 16,
    color: theme.colors.mutedForeground,
  },
});

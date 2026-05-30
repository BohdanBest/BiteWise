import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export default function OnboardingProgress({ currentStep, totalSteps = 4 }: OnboardingProgressProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.progressBar, 
            index < currentStep && styles.progressActive
          ]} 
        />
      ))}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.muted,
  },
  progressActive: {
    backgroundColor: theme.colors.primary,
  },
});

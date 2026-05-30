import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassCard({ children, style, intensity = 20 }: GlassCardProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  return (
    <View style={[styles.container, theme.shadows.premium, style]}>
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden', // Щоб BlurView не вилазив за краї
    backgroundColor: 'rgba(20, 24, 22, 0.4)', // fallback / base
  },
  blur: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.pageHorizontal,
  }
});

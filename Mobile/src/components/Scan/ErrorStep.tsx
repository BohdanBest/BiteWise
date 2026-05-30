import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Camera, Search, AlertCircle } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import mascotSad from '../../../assets/mascot-sad.png';

interface ErrorStepProps {
  onRetry: () => void;
}

export default function ErrorStep({ onRetry }: ErrorStepProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  return (
    <View style={styles.container}>
      
      {/* Mascot and Header */}
      <View style={styles.content}>
        <View style={styles.mascotContainer}>
          <View style={styles.glowWrapper}>
            <Svg height="300" width="300">
              <Defs>
                <RadialGradient id="errorGlow" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                  <Stop offset="0%" stopColor={theme.colors.destructive} stopOpacity="0.25" />
                  <Stop offset="40%" stopColor={theme.colors.destructive} stopOpacity="0.1" />
                  <Stop offset="70%" stopColor={theme.colors.destructive} stopOpacity="0.02" />
                  <Stop offset="100%" stopColor={theme.colors.destructive} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="300" height="300" fill="url(#errorGlow)" />
            </Svg>
          </View>
          <Image source={mascotSad} style={styles.mascot} resizeMode="contain" />
        </View>
        
        <View style={styles.badge}>
          <AlertCircle size={16} color={theme.colors.destructive} />
          <Text style={styles.badgeText}>Не вдалося розпізнати</Text>
        </View>

        <Text style={styles.title}>Ой, щось пішло не так</Text>
        <Text style={styles.subtitle}>
          Не змогли розпізнати страву на фото.{'\n'}
          Спробуйте ще раз з кращим освітленням або іншим ракурсом.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          activeOpacity={0.8}
          onPress={onRetry}
        >
          <Camera size={20} color={theme.colors.primaryForeground} />
          <Text style={styles.primaryButtonText}>Сканувати знову</Text>
        </TouchableOpacity>

        {/* Tip Box */}
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            <Text style={{ color: theme.colors.primary, fontFamily: theme.typography.h3.fontFamily }}>Порада: </Text>
            переконайтеся, що страва добре видно на фото, без сильних тіней та бліків.
          </Text>
        </View>
      </View>

    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.pageHorizontal,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: theme.spacing.l,
  },
  glowWrapper: {
    position: 'absolute',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  mascot: {
    width: 160,
    height: 160,
    zIndex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: theme.spacing.l,
    gap: 8,
  },
  badgeText: {
    ...theme.typography.caption,
    fontSize: 13,
    color: theme.colors.destructive,
  },
  title: {
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: 24,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  
  actionsContainer: {
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    height: 56,
    gap: 8,
    ...theme.shadows.glowPrimary,
  },
  primaryButtonText: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
  tipBox: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tipText: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 18,
  }
});

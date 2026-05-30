import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', isLoading, rightIcon, style }: ButtonProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const content = (
    <>
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? theme.colors.primaryForeground : theme.colors.primary} />
      ) : (
        <View style={styles.contentRow}>
          <Text style={[
            styles.text,
            isPrimary && styles.textPrimary,
            isSecondary && styles.textSecondary,
            variant === 'ghost' && styles.textGhost,
            rightIcon ? { marginRight: theme.spacing.s } : null
          ]}>
            {title}
          </Text>
          {rightIcon && <View>{rightIcon}</View>}
        </View>
      )}
    </>
  );

  if (isPrimary) {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity 
          onPress={onPress} 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading} 
          activeOpacity={0.8} 
          style={style}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.base, styles.primary, theme.shadows.glowPrimary]}
          >
            {content}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={isLoading}
      activeOpacity={0.7}
      style={[
        styles.base,
        isSecondary && styles.secondary,
        variant === 'ghost' && styles.ghost,
        style
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  base: {
    height: 56, // h-14
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primary: {
    // Всі стилі в LinearGradient
  },
  secondary: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 16,
  },
  textPrimary: {
    color: theme.colors.primaryForeground,
  },
  textSecondary: {
    color: theme.colors.foreground,
  },
  textGhost: {
    color: theme.colors.mutedForeground,
  }
});

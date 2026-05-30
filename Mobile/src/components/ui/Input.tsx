import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity, Platform } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  suffix?: string;
}

export default function Input({ label, error, isPassword, suffix, style, onFocus, onBlur, ...props }: InputProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputFocused,
        error && styles.inputError,
      ]}>
        <TextInput
          ref={inputRef}
          placeholderTextColor={theme.colors.mutedForeground}
          secureTextEntry={isPassword && !isPasswordVisible}
          style={[styles.input, style]}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={theme.colors.mutedForeground} />
            ) : (
              <Eye size={20} color={theme.colors.mutedForeground} />
            )}
          </TouchableOpacity>
        )}
        
        {suffix && !isPassword && (
          <View style={styles.suffixContainer} pointerEvents="none">
            <Text style={styles.suffixText}>{suffix}</Text>
          </View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    ...theme.typography.overline,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    height: 56, // h-14
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: theme.spacing.l,
    color: theme.colors.foreground,
    ...theme.typography.bodyL,
    ...Platform.select({
      web: { outlineStyle: 'none' },
      default: {},
    }),
  } as any,
  eyeIcon: {
    paddingHorizontal: theme.spacing.l,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixContainer: {
    paddingRight: theme.spacing.l,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixText: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
  },
  inputFocused: {
    borderColor: theme.colors.ring,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.destructive,
    marginTop: theme.spacing.xs,
  }
});

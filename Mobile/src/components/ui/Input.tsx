import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Theme } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  suffix?: string;
}

export default function Input({ label, error, isPassword, suffix, style, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputFocused,
        error && styles.inputError,
      ]}>
        <TextInput
          placeholderTextColor={Theme.colors.mutedForeground}
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
              <EyeOff size={20} color={Theme.colors.mutedForeground} />
            ) : (
              <Eye size={20} color={Theme.colors.mutedForeground} />
            )}
          </TouchableOpacity>
        )}
        
        {suffix && !isPassword && (
          <View style={styles.suffixContainer}>
            <Text style={styles.suffixText}>{suffix}</Text>
          </View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.m,
  },
  label: {
    ...Theme.typography.overline,
    color: Theme.colors.mutedForeground,
    marginBottom: Theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    height: 56, // h-14
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.muted,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: Theme.spacing.l,
    color: Theme.colors.foreground,
    ...Theme.typography.bodyL,
  },
  eyeIcon: {
    paddingHorizontal: Theme.spacing.l,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixContainer: {
    paddingRight: Theme.spacing.l,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixText: {
    ...Theme.typography.body,
    color: Theme.colors.mutedForeground,
  },
  inputFocused: {
    borderColor: Theme.colors.ring,
  },
  inputError: {
    borderColor: Theme.colors.destructive,
  },
  errorText: {
    ...Theme.typography.caption,
    color: Theme.colors.destructive,
    marginTop: Theme.spacing.xs,
  }
});

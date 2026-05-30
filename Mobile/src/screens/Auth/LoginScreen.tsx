import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import useAuthStore from '../../store/useAuthStore';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import mascot from "../../../assets/mascot-wave.png";

export default function LoginScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Помилка', 'Будь ласка, введіть email та пароль');
      return;
    }
    
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (error: any) {
      Alert.alert('Помилка входу', error.response?.data?.message || 'Невірний email або пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Image source={mascot} style={styles.mascot} resizeMode="contain" />
          <Text style={styles.title}>NutriScan</Text>
          <Text style={styles.subtitle}>Розпізнавай їжу, контролюй калорії</Text>
        </View>

        <View style={styles.form}>
          <Input 
            label="EMAIL" 
            placeholder="your@email.com" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={email}
            onChangeText={setEmail}
          />
          
          <Input 
            label="ПАРОЛЬ" 
            placeholder="••••••••" 
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          
          <Button 
            title={isLoading ? "Вхід..." : "Увійти"} 
            onPress={handleLogin} 
            disabled={isLoading}
            rightIcon={<ArrowRight size={20} color={theme.colors.primaryForeground} />}
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Немає акаунту? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
            <Text style={styles.registerText}>Зареєструватися</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: theme.spacing.pageHorizontal,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mascot: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.l,
  },
  title: { 
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 42,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodyL,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  loginButton: {
    marginTop: theme.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
  },
  registerText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontFamily: theme.typography.h3.fontFamily,
  }
});

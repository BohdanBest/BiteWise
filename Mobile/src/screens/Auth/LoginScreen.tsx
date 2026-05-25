import React from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import useAuthStore from '../../store/useAuthStore';
import { Theme } from '../../constants/theme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import mascot from "../../../assets/mascot-wave.png";

export default function LoginScreen({ navigation }: any) {
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = () => {
    setToken('fake-jwt-token-for-testing');
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
          />
          
          <Input 
            label="ПАРОЛЬ" 
            placeholder="••••••••" 
            isPassword
          />
          
          <Button 
            title="Увійти" 
            onPress={handleLogin} 
            rightIcon={<ArrowRight size={20} color={Theme.colors.primaryForeground} />}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: Theme.spacing.pageHorizontal,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mascot: {
    width: 80,
    height: 80,
    marginBottom: Theme.spacing.l,
  },
  title: { 
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 42,
    color: Theme.colors.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.bodyL,
    color: Theme.colors.mutedForeground,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  loginButton: {
    marginTop: Theme.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...Theme.typography.body,
    color: Theme.colors.mutedForeground,
  },
  registerText: {
    ...Theme.typography.body,
    color: Theme.colors.primary,
    fontFamily: Theme.typography.h3.fontFamily,
  }
});

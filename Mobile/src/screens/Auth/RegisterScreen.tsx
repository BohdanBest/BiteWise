import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useRegistrationStore } from '../../store/useRegistrationStore';

export default function RegisterScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const updateData = useRegistrationStore((state) => state.updateData);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Помилка', 'Паролі не співпадають');
      return;
    }

    updateData({ name, email, password });
    navigation.navigate('OnboardingGender');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Кнопка "Назад" */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={theme.colors.foreground} />
          </TouchableOpacity>

          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.title}>Реєстрація</Text>
            <Text style={styles.subtitle}>Створіть акаунт, щоб почати</Text>
          </View>

          {/* Форма */}
          <View style={styles.form}>
            <Input 
              label="ІМ'Я" 
              placeholder="Ваше ім'я" 
              autoCapitalize="words" 
              value={name}
              onChangeText={setName}
            />
            
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

            <Input 
              label="ПІДТВЕРДЖЕННЯ" 
              placeholder="••••••••" 
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <Button 
              title="Зареєструватися" 
              onPress={handleRegister} 
              rightIcon={<ArrowRight size={20} color={theme.colors.primaryForeground} />}
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.pageHorizontal,
    paddingBottom: 40,
    paddingTop: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  header: {
    marginBottom: 40,
  },
  title: { 
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 36,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodyL,
    color: theme.colors.mutedForeground,
  },
  form: {
    flex: 1,
  },
  registerButton: {
    marginTop: theme.spacing.m,
  },
});

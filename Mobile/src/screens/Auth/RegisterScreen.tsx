import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterScreen({ navigation }: any) {
  const handleRegister = () => {
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
            <ArrowLeft size={24} color={Theme.colors.foreground} />
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
            />
            
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

            <Input 
              label="ПІДТВЕРДЖЕННЯ" 
              placeholder="••••••••" 
              isPassword
            />
            
            <Button 
              title="Зареєструватися" 
              onPress={handleRegister} 
              rightIcon={<ArrowRight size={20} color={Theme.colors.primaryForeground} />}
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.pageHorizontal,
    paddingBottom: 40,
    paddingTop: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  header: {
    marginBottom: 40,
  },
  title: { 
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 36,
    color: Theme.colors.foreground,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.bodyL,
    color: Theme.colors.mutedForeground,
  },
  form: {
    flex: 1,
  },
  registerButton: {
    marginTop: Theme.spacing.m,
  },
});

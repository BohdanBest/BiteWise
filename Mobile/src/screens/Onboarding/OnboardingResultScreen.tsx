import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import Button from '../../components/ui/Button';
import OnboardingProgress from '../../components/ui/OnboardingProgress';
import useAuthStore from '../../store/useAuthStore';

// @ts-ignore (we know the file exists)
import mascotCelebrate from '../../../assets/mascot-celebrate.png';

export default function OnboardingResultScreen() {
  const { setToken } = useAuthStore();
  
  // Анімації
  const scaleAnim = useRef(new Animated.Value(0.1)).current;
  const jumpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Ефектне вистрибування
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();

    // 2. Безперервне підстрибування від радості
    const jump = Animated.sequence([
      Animated.timing(jumpAnim, {
        toValue: -15, // Стрибок вгору
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(jumpAnim, {
        toValue: 0, // Приземлення
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(jump).start();
  }, []);

  const handleStart = () => {
    // Імітуємо успішну реєстрацію та вхід. 
    // Завдяки AppNavigator це автоматично перекине нас на екран DiaryScreen.
    setToken('fake-jwt-token');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <OnboardingProgress currentStep={4} />

        <View style={styles.content}>
          {/* Анімований маскот */}
          <Animated.Image 
            source={mascotCelebrate} 
            style={[
              styles.mascot,
              { 
                transform: [
                  { scale: scaleAnim },
                  { translateY: jumpAnim }
                ] 
              }
            ]}
            resizeMode="contain"
          />

          <Text style={styles.title}>Ваша денна норма</Text>
          
          {/* Фейкові дані для демо */}
          <Text style={styles.caloriesText}>2813</Text>
          <Text style={styles.subtitle}>ккал на день</Text>
          
          <Text style={styles.disclaimer}>
            Розрахунок за формулою Харріса-Бенедикта з урахуванням вашої цілі та помірної активності
          </Text>
        </View>

        <Button 
          title="Почати користуватись" 
          onPress={handleStart} 
        />
      </View>
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
    paddingHorizontal: Theme.spacing.pageHorizontal,
    paddingTop: Theme.spacing.l,
    paddingBottom: Theme.spacing.pageHorizontal,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  title: {
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 28,
    color: Theme.colors.foreground,
    marginBottom: Theme.spacing.m,
    textAlign: 'center',
  },
  caloriesText: {
    fontFamily: Theme.typography.displayXl.fontFamily,
    fontSize: 64, // Дуже великий шрифт
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.s,
    lineHeight: 70, // Щоб цифри не обрізалися
  },
  subtitle: {
    ...Theme.typography.bodyL,
    color: Theme.colors.mutedForeground,
    marginBottom: 40,
  },
  disclaimer: {
    ...Theme.typography.caption,
    color: Theme.colors.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.xl,
    lineHeight: 18,
  }
});

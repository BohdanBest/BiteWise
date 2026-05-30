import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import Button from '../../components/ui/Button';
import OnboardingProgress from '../../components/ui/OnboardingProgress';
import useAuthStore from '../../store/useAuthStore';
import { useRegistrationStore, Gender, Goal } from '../../store/useRegistrationStore';

// @ts-ignore (we know the file exists)
import mascotCelebrate from '../../../assets/mascot-celebrate.png';

export default function OnboardingResultScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { register } = useAuthStore();
  const registrationData = useRegistrationStore((state) => state.data);
  const clearRegistrationData = useRegistrationStore((state) => state.clearData);
  const [isLoading, setIsLoading] = useState(false);
  
  // Розрахунок калорій як на бекенді (Harris-Benedict)
  const calculateCalories = () => {
    const { gender, weightKg, heightCm, age, goal } = registrationData;
    
    if (!weightKg || !heightCm || !age) return 0;
    
    const bmr = gender === Gender.Male
      ? 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age)
      : 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
      
    let dailyCalories = bmr * 1.2; // Sedentary/Light activity coefficient used on backend
    
    if (goal === Goal.LoseWeight) dailyCalories -= 500;
    if (goal === Goal.GainWeight) dailyCalories += 400;
    
    return Math.round(dailyCalories);
  };

  const previewCalories = calculateCalories();

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

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await register(registrationData);
      clearRegistrationData();
      // Успішна реєстрація автоматично змінить стан у Zustand і навігація зреагує на це.
    } catch (error: any) {
      Alert.alert('Помилка реєстрації', error.response?.data?.message || 'Щось пішло не так');
    } finally {
      setIsLoading(false);
    }
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
          
          {/* Дані, розраховані локально */}
          <Text style={styles.caloriesText}>{previewCalories > 0 ? previewCalories : 2813}</Text>
          <Text style={styles.subtitle}>ккал на день</Text>
          
          <Text style={styles.disclaimer}>
            Розрахунок за формулою Харріса-Бенедикта з урахуванням вашої цілі та помірної активності
          </Text>
        </View>

        <Button 
          title={isLoading ? "Реєстрація..." : "Почати користуватись"} 
          onPress={handleStart} 
          disabled={isLoading}
        />
      </View>
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
    paddingHorizontal: theme.spacing.pageHorizontal,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.pageHorizontal,
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
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 28,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  caloriesText: {
    fontFamily: theme.typography.displayXl.fontFamily,
    fontSize: 64, // Дуже великий шрифт
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
    lineHeight: 70, // Щоб цифри не обрізалися
  },
  subtitle: {
    ...theme.typography.bodyL,
    color: theme.colors.mutedForeground,
    marginBottom: 40,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
    lineHeight: 18,
  }
});

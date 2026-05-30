import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import OnboardingProgress from '../../components/ui/OnboardingProgress';
import { useRegistrationStore } from '../../store/useRegistrationStore';

export default function OnboardingMetricsScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const updateData = useRegistrationStore((state) => state.updateData);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleNext = () => {
    if (age && weight && height) {
      updateData({ 
        age: parseInt(age), 
        weightKg: parseFloat(weight), 
        heightCm: parseFloat(height) 
      });
      navigation.navigate('OnboardingGoal');
    } else {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля');
    }
  };

  const isFormValid = age.length > 0 && weight.length > 0 && height.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <OnboardingProgress currentStep={2} />

          <View style={styles.header}>
            <Text style={styles.title}>Ваші параметри</Text>
            <Text style={styles.subtitle}>За формулою Харріса-Бенедикта</Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="ВІК" 
              placeholder="25" 
              keyboardType="numeric"
              suffix="років"
              value={age}
              onChangeText={setAge}
            />
            
            <Input 
              label="ВАГА" 
              placeholder="75" 
              keyboardType="numeric"
              suffix="кг"
              value={weight}
              onChangeText={setWeight}
            />
            
            <Input 
              label="ЗРІСТ" 
              placeholder="180" 
              keyboardType="numeric"
              suffix="см"
              value={height}
              onChangeText={setHeight}
            />
          </View>

          <View style={styles.spacer} />

          <Button 
            title="Далі" 
            onPress={handleNext} 
            variant={isFormValid ? 'primary' : 'secondary'}
            style={styles.button}
          />
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.pageHorizontal,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.pageHorizontal,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 32,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
  },
  form: {
    marginBottom: theme.spacing.l,
  },
  spacer: {
    flex: 1, // Виштовхує кнопку вниз
    minHeight: 40,
  },
  button: {
    marginTop: 'auto',
  }
});

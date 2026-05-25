import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import OnboardingProgress from '../../components/ui/OnboardingProgress';

export default function OnboardingMetricsScreen({ navigation }: any) {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleNext = () => {
    if (age && weight && height) {
      console.log('Параметри:', { age, weight, height });
      navigation.navigate('OnboardingGoal');
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.pageHorizontal,
    paddingTop: Theme.spacing.l,
    paddingBottom: Theme.spacing.pageHorizontal,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 32,
    color: Theme.colors.foreground,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.mutedForeground,
  },
  form: {
    flex: 1,
  },
  spacer: {
    flex: 1, // Виштовхує кнопку вниз
    minHeight: 40,
  },
  button: {
    marginTop: 'auto',
  }
});

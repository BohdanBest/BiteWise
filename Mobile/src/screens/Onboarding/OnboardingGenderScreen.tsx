import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import Button from '../../components/ui/Button';
import OnboardingProgress from '../../components/ui/OnboardingProgress';

export default function OnboardingGenderScreen({ navigation }: any) {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

  const handleNext = () => {
    if (selectedGender) {
      console.log('Обрано стать:', selectedGender);
      navigation.navigate('OnboardingMetrics');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <OnboardingProgress currentStep={1} />

        {/* Заголовки */}
        <View style={styles.header}>
          <Text style={styles.title}>Ваша стать</Text>
          <Text style={styles.subtitle}>Для точного розрахунку калорій</Text>
        </View>

        {/* Картки вибору */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[
              styles.card,
              selectedGender === 'male' && styles.cardActive
            ]}
            onPress={() => setSelectedGender('male')}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>👦</Text>
            <Text style={[
              styles.cardText,
              selectedGender === 'male' && styles.cardTextActive
            ]}>Чоловіча</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.card,
              selectedGender === 'female' && styles.cardActive
            ]}
            onPress={() => setSelectedGender('female')}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>👩</Text>
            <Text style={[
              styles.cardText,
              selectedGender === 'female' && styles.cardTextActive
            ]}>Жіноча</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        {/* Кнопка "Далі" */}
        <Button 
          title="Далі" 
          onPress={handleNext} 
          variant={selectedGender ? 'primary' : 'secondary'}
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
    paddingBottom: Theme.spacing.pageHorizontal, // padding for the bottom button
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
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    aspectRatio: 1, // Робить квадратним
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.m,
  },
  cardActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.background, // Темніший фон при виборі
    ...Theme.shadows.glowPrimary, // Світіння навколо
  },
  emoji: {
    fontSize: 48,
    marginBottom: Theme.spacing.m,
  },
  cardText: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 16,
    color: Theme.colors.foreground,
  },
  cardTextActive: {
    color: Theme.colors.primary,
  },
  spacer: {
    flex: 1, // Виштовхує кнопку вниз
  }
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import Button from '../../components/ui/Button';
import OnboardingProgress from '../../components/ui/OnboardingProgress';
import { useRegistrationStore, Gender } from '../../store/useRegistrationStore';

export default function OnboardingGenderScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const updateData = useRegistrationStore((state) => state.updateData);

  const handleNext = () => {
    if (selectedGender !== null) {
      updateData({ gender: selectedGender });
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
              selectedGender === Gender.Male && styles.cardActive
            ]}
            onPress={() => setSelectedGender(Gender.Male)}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>👦</Text>
            <Text style={[
              styles.cardText,
              selectedGender === Gender.Male && styles.cardTextActive
            ]}>Чоловіча</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.card,
              selectedGender === Gender.Female && styles.cardActive
            ]}
            onPress={() => setSelectedGender(Gender.Female)}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>👩</Text>
            <Text style={[
              styles.cardText,
              selectedGender === Gender.Female && styles.cardTextActive
            ]}>Жіноча</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        {/* Кнопка "Далі" */}
        <Button 
          title="Далі" 
          onPress={handleNext} 
          variant={selectedGender !== null ? 'primary' : 'secondary'}
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
    paddingBottom: theme.spacing.pageHorizontal, // padding for the bottom button
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
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    aspectRatio: 1, // Робить квадратним
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  cardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background, // Темніший фон при виборі
    ...theme.shadows.glowPrimary, // Світіння навколо
  },
  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing.m,
  },
  cardText: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 16,
    color: theme.colors.foreground,
  },
  cardTextActive: {
    color: theme.colors.primary,
  },
  spacer: {
    flex: 1, // Виштовхує кнопку вниз
  }
});

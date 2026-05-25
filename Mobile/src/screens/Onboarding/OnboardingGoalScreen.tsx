import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Scale, Dumbbell } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import Button from '../../components/ui/Button';
import OnboardingProgress from '../../components/ui/OnboardingProgress';

type Goal = 'lose' | 'maintain' | 'gain';

export default function OnboardingGoalScreen({ navigation }: any) {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleCalculate = () => {
    if (selectedGoal) {
      console.log('Обрана ціль:', selectedGoal);
      navigation.navigate('OnboardingResult');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <OnboardingProgress currentStep={3} />

        <View style={styles.header}>
          <Text style={styles.title}>Ваша ціль</Text>
          <Text style={styles.subtitle}>Оберіть бажану ціль</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[styles.card, selectedGoal === 'lose' && styles.cardActive]}
            onPress={() => setSelectedGoal('lose')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Flame size={32} color={selectedGoal === 'lose' ? Theme.colors.primary : Theme.colors.foreground} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, selectedGoal === 'lose' && styles.cardTitleActive]}>
                Схуднення
              </Text>
              <Text style={styles.cardSubtitle}>-500 ккал/день</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, selectedGoal === 'maintain' && styles.cardActive]}
            onPress={() => setSelectedGoal('maintain')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Scale size={32} color={selectedGoal === 'maintain' ? Theme.colors.primary : Theme.colors.foreground} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, selectedGoal === 'maintain' && styles.cardTitleActive]}>
                Підтримка ваги
              </Text>
              <Text style={styles.cardSubtitle}>Баланс</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, selectedGoal === 'gain' && styles.cardActive]}
            onPress={() => setSelectedGoal('gain')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Dumbbell size={32} color={selectedGoal === 'gain' ? Theme.colors.primary : Theme.colors.foreground} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, selectedGoal === 'gain' && styles.cardTitleActive]}>
                Набір маси
              </Text>
              <Text style={styles.cardSubtitle}>+400 ккал/день</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        <Button 
          title="Розрахувати" 
          onPress={handleCalculate} 
          variant={selectedGoal ? 'primary' : 'secondary'}
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
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    padding: Theme.spacing.l,
  },
  cardActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.background,
    ...Theme.shadows.glowPrimary,
  },
  iconContainer: {
    marginRight: Theme.spacing.l,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 18,
    color: Theme.colors.foreground,
    marginBottom: 4,
  },
  cardTitleActive: {
    color: Theme.colors.primary,
  },
  cardSubtitle: {
    ...Theme.typography.caption,
    color: Theme.colors.mutedForeground,
  },
  spacer: {
    flex: 1,
  }
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Scale, TrendingUp } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import Button from '../../components/ui/Button';
import OnboardingProgress from '../../components/ui/OnboardingProgress';
import { useRegistrationStore, Goal } from '../../store/useRegistrationStore';

export default function OnboardingGoalScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const updateData = useRegistrationStore((state) => state.updateData);

  const handleNext = () => {
    if (selectedGoal !== null) {
      updateData({ goal: selectedGoal });
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

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Схуднення */}
          <TouchableOpacity 
            style={[
              styles.optionCard, 
              selectedGoal === Goal.LoseWeight && styles.optionCardSelected
            ]}
            onPress={() => setSelectedGoal(Goal.LoseWeight)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
              <Flame size={24} color="#FF9500" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Схуднути</Text>
              <Text style={styles.optionSubtitle}>Спалити жир та покращити форму</Text>
            </View>
            <View style={[
              styles.radioCircle,
              selectedGoal === Goal.LoseWeight && styles.radioCircleSelected
            ]}>
              {selectedGoal === Goal.LoseWeight && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* Підтримка ваги */}
          <TouchableOpacity 
            style={[
              styles.optionCard, 
              selectedGoal === Goal.MaintainWeight && styles.optionCardSelected
            ]}
            onPress={() => setSelectedGoal(Goal.MaintainWeight)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
              <Scale size={24} color="#34C759" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Підтримувати вагу</Text>
              <Text style={styles.optionSubtitle}>Залишатися у формі та бути здоровим</Text>
            </View>
            <View style={[
              styles.radioCircle,
              selectedGoal === Goal.MaintainWeight && styles.radioCircleSelected
            ]}>
              {selectedGoal === Goal.MaintainWeight && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* Набір маси */}
          <TouchableOpacity 
            style={[
              styles.optionCard, 
              selectedGoal === Goal.GainWeight && styles.optionCardSelected
            ]}
            onPress={() => setSelectedGoal(Goal.GainWeight)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
              <TrendingUp size={24} color="#007AFF" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Набрати масу</Text>
              <Text style={styles.optionSubtitle}>Збільшити вагу та м'язову масу</Text>
            </View>
            <View style={[
              styles.radioCircle,
              selectedGoal === Goal.GainWeight && styles.radioCircleSelected
            ]}>
              {selectedGoal === Goal.GainWeight && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.spacer} />

        <Button 
          title="Розрахувати" 
          onPress={handleNext}
          variant={selectedGoal !== null ? 'primary' : 'secondary'}
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
  optionsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  optionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    ...theme.shadows.glowPrimary,
  },
  iconContainer: {
    marginRight: theme.spacing.l,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 18,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  optionSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.mutedForeground,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.m,
  },
  radioCircleSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  spacer: {
    flex: 1,
  }
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Flame, Scale, Dumbbell } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useUserStore } from '../../store/useUserStore';

type GoalType = 'lose' | 'maintain' | 'gain';

export default function EditProfileScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const navigation = useNavigation();
  const { profile, updateProfile, isLoading } = useUserStore();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState<GoalType>('lose');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAge(profile.age.toString());
      setWeight(profile.weightKg.toString());
      setHeight(profile.heightCm.toString());

      if (profile.goalName === 'Схуднення') setGoal('lose');
      else if (profile.goalName === 'Підтримка') setGoal('maintain');
      else if (profile.goalName === 'Набір маси') setGoal('gain');
      else setGoal('lose'); // default fallback
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    let goalEnum = 0; // LoseWeight
    if (goal === 'maintain') goalEnum = 1; // MaintainWeight
    if (goal === 'gain') goalEnum = 2; // GainWeight

    try {
      await updateProfile({
        name,
        age: parseInt(age, 10),
        weightKg: parseFloat(weight),
        heightCm: parseFloat(height),
        goal: goalEnum
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося оновити профіль. Перевірте введені дані.');
    }
  };

  const isFormValid = name.length > 0 && age.length > 0 && weight.length > 0 && height.length > 0;

  if (!profile) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Редагувати профіль</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Input 
              label="ІМ'Я" 
              placeholder="Введіть ваше ім'я" 
              value={name}
              onChangeText={setName}
            />

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

            <View style={styles.goalSection}>
              <Text style={styles.goalSectionTitle}>ЦІЛЬ</Text>
              <View style={styles.goalCardsContainer}>
                <TouchableOpacity 
                  style={[styles.goalCard, goal === 'lose' && styles.goalCardActive]} 
                  onPress={() => setGoal('lose')}
                  activeOpacity={0.7}
                >
                  <Flame size={24} color={goal === 'lose' ? theme.colors.primary : theme.colors.foreground} />
                  <Text style={[styles.goalCardText, goal === 'lose' && styles.goalCardTextActive]}>Схуднення</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.goalCard, goal === 'maintain' && styles.goalCardActive]} 
                  onPress={() => setGoal('maintain')}
                  activeOpacity={0.7}
                >
                  <Scale size={24} color={goal === 'maintain' ? theme.colors.primary : theme.colors.foreground} />
                  <Text style={[styles.goalCardText, goal === 'maintain' && styles.goalCardTextActive]}>Підтримка</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.goalCard, goal === 'gain' && styles.goalCardActive]} 
                  onPress={() => setGoal('gain')}
                  activeOpacity={0.7}
                >
                  <Dumbbell size={24} color={goal === 'gain' ? theme.colors.primary : theme.colors.foreground} />
                  <Text style={[styles.goalCardText, goal === 'gain' && styles.goalCardTextActive]}>Набір маси</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.spacer} />

          <Button 
            title={isLoading ? "Збереження..." : "Зберегти зміни"} 
            onPress={handleSave} 
            variant={isFormValid ? 'primary' : 'secondary'}
            style={styles.button}
            disabled={!isFormValid || isLoading}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.pageHorizontal,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.l,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  headerTitle: {
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: 24,
    color: theme.colors.foreground,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.pageHorizontal,
    paddingTop: theme.spacing.s,
    paddingBottom: 40,
  },
  form: {
    gap: 8,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  button: {
    marginTop: 'auto',
  },
  goalSection: {
    marginTop: theme.spacing.m,
  },
  goalSectionTitle: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.s,
    textTransform: 'uppercase',
  },
  goalCardsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  goalCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    padding: theme.spacing.m,
    gap: 8,
  },
  goalCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(21, 191, 99, 0.05)',
  },
  goalCardText: {
    ...theme.typography.caption,
    fontSize: 11,
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  goalCardTextActive: {
    color: theme.colors.primary,
    fontFamily: theme.typography.h3.fontFamily,
  },
});

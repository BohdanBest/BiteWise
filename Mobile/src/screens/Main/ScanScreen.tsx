import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, Sparkles, Check, ChevronDown } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

type Step = 'capture' | 'loading' | 'result';

const mockResults = [
  { food: { id: 1, nameUa: 'Піца Маргарита', calories: 250, protein: 11, fat: 10, carbs: 30 }, confidence: 92 },
  { food: { id: 2, nameUa: 'Паста Карбонара', calories: 350, protein: 14, fat: 18, carbs: 45 }, confidence: 76 },
  { food: { id: 3, nameUa: 'Салат Цезар', calories: 180, protein: 9, fat: 12, carbs: 10 }, confidence: 45 },
];

const mealTypeLabels: Record<string, string> = {
  breakfast: 'Сніданок',
  lunch: 'Обід',
  dinner: 'Вечеря',
  snack: 'Перекус',
};

export default function ScanScreen() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<Step>('capture');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [weight, setWeight] = useState('200');
  const [mealType, setMealType] = useState('lunch');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Animations
  const spinValue = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (step === 'loading') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
    
    if (step === 'result') {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(500);
    }
  }, [step, spinValue, slideAnim]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleScan = () => {
    setStep('loading');
    setTimeout(() => setStep('result'), 2000);
  };

  const selected = mockResults[selectedIndex];
  const weightNum = Number(weight) || 0;
  const factor = weightNum / 100;

  if (step === 'capture') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Сканувати страву</Text>
            <Text style={styles.subtitle}>Сфотографуйте або оберіть фото</Text>
          </View>

          {/* Centered Content: Scanner + Buttons */}
          <View style={styles.centerContent}>
            {/* Scanner Area */}
            <View style={styles.scannerBox}>
              <Camera size={64} color={Theme.colors.mutedForeground} strokeWidth={1.5} opacity={0.5} />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                activeOpacity={0.8}
                onPress={handleScan}
              >
                <Camera size={20} color={Theme.colors.primaryForeground} />
                <Text style={styles.primaryButtonText}>Зробити фото</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton} 
                activeOpacity={0.8}
                onPress={handleScan}
              >
                <ImageIcon size={20} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.container, styles.centerAll]}>
          {/* Custom Spinner */}
          <View style={styles.spinnerWrapper}>
            <Animated.View style={[styles.loadingCircle, { transform: [{ rotate: spin }] }]} />
            <View style={styles.sparklesPos}>
              <Sparkles size={36} color={Theme.colors.primary} strokeWidth={1.5} />
            </View>
          </View>
          
          <Text style={styles.loadingTitle}>Аналізуємо страву...</Text>
          <Text style={styles.loadingSubtitle}>AI розпізнає вашу їжу</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Result Step
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.headerResult}>
          <Text style={styles.title}>Результат</Text>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.resultScrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Top-3 results */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
          style={styles.horizontalScroll}
        >
          {mockResults.map((result, i) => {
            const isSelected = i === selectedIndex;
            return (
              <TouchableOpacity
                key={result.food.id}
                onPress={() => setSelectedIndex(i)}
                style={[
                  styles.resultBadge,
                  isSelected ? styles.resultBadgeSelected : styles.resultBadgeUnselected
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.resultBadgeTitle, isSelected && { color: Theme.colors.primary }]}>
                  {result.food.nameUa}
                </Text>
                <Text style={styles.resultBadgeSubtitle}>
                  {result.confidence}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected food details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{selected.food.nameUa}</Text>
          <Text style={styles.detailsPer100g}>на 100г</Text>

          {/* Macros Grid */}
          <View style={styles.macrosGrid}>
            <View style={styles.macroBox}>
              <Text style={[styles.macroValue, { color: Theme.colors.primary }]}>{selected.food.calories}</Text>
              <Text style={styles.macroLabel}>ККАЛ</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={[styles.macroValue, { color: Theme.colors.primary }]}>{selected.food.protein}г</Text>
              <Text style={styles.macroLabel}>БІЛКИ</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={[styles.macroValue, { color: Theme.colors.warning }]}>{selected.food.fat}г</Text>
              <Text style={styles.macroLabel}>ЖИРИ</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={[styles.macroValue, { color: Theme.colors.primary }]}>{selected.food.carbs}г</Text>
              <Text style={styles.macroLabel}>ВУГЛЕВ.</Text>
            </View>
          </View>

          {/* Weight Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ВАГА ПОРЦІЇ (Г)</Text>
            <TextInput
              style={styles.textInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={Theme.colors.mutedForeground}
            />
          </View>

          {/* Calculated Totals */}
          <View style={styles.totalsBox}>
            <Text style={styles.totalsTitle}>ДЛЯ {weightNum}Г ПОРЦІЇ</Text>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsKcal}>{Math.round(selected.food.calories * factor)} ккал</Text>
              <Text style={styles.totalsMacro}>Б: {(selected.food.protein * factor).toFixed(1)}</Text>
              <Text style={styles.totalsMacro}>Ж: {(selected.food.fat * factor).toFixed(1)}</Text>
              <Text style={styles.totalsMacro}>В: {(selected.food.carbs * factor).toFixed(1)}</Text>
            </View>
          </View>

          {/* Meal Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ПРИЙОМ ЇЖІ</Text>
            <TouchableOpacity 
              style={[
                styles.dropdownInput, 
                isDropdownOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 0 }
              ]} 
              activeOpacity={0.7}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Text style={styles.dropdownText}>{mealTypeLabels[mealType]}</Text>
              <ChevronDown 
                size={24} 
                color={Theme.colors.mutedForeground} 
                style={{ transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownOptionsInline}>
                {Object.entries(mealTypeLabels).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setMealType(key);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      key === mealType && { color: Theme.colors.primary }
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            activeOpacity={0.8}
            onPress={() => {
              // Reset and navigate back
              setStep('capture');
              setWeight('200');
              setSelectedIndex(0);
              setIsDropdownOpen(false);
              navigation.navigate('Diary');
            }}
          >
            <Check size={20} color={Theme.colors.primaryForeground} strokeWidth={2.5} />
            <Text style={styles.submitButtonText}>Додати в щоденник</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      </Animated.View>
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
    justifyContent: 'space-between',
    paddingBottom: 130, // Space for the bottom navigation bar
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  header: {
    paddingTop: Theme.spacing.xl,
  },
  headerResult: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.pageHorizontal,
    marginBottom: Theme.spacing.m,
  },
  title: {
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 28,
    color: Theme.colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    ...Theme.typography.body,
    fontSize: 14,
    color: Theme.colors.mutedForeground,
  },

  // Centered Content (Scanner + Buttons)
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 100,
  },

  // Scanner Area
  scannerBox: {
    width: 288,
    height: 288,
    borderRadius: 32,
    backgroundColor: 'rgba(21, 191, 99, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    // Glow effect
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },

  // Action Buttons
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 320,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: 16,
    height: 56,
    gap: 8,
    ...Theme.shadows.glowPrimary,
  },
  primaryButtonText: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 16,
    color: Theme.colors.primaryForeground,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // glass effect
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading
  spinnerWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
    position: 'relative',
  },
  loadingCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(21, 191, 99, 0.2)',
    borderTopColor: Theme.colors.primary,
    // Add subtle glow
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  sparklesPos: {
    position: 'absolute',
  },
  loadingTitle: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 20,
    color: Theme.colors.foreground,
    marginBottom: 8,
  },
  loadingSubtitle: {
    ...Theme.typography.body,
    fontSize: 16,
    color: Theme.colors.mutedForeground,
  },

  // Results
  resultScrollContent: {
    paddingBottom: 130, // Space for navigation bar
  },
  horizontalScroll: {
    marginBottom: Theme.spacing.m,
  },
  horizontalScrollContent: {
    paddingHorizontal: Theme.spacing.pageHorizontal,
    gap: Theme.spacing.s,
  },
  resultBadge: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultBadgeSelected: {
    backgroundColor: '#121513',
    borderColor: 'rgba(21, 191, 99, 0.4)',
  },
  resultBadgeUnselected: {
    backgroundColor: '#121513',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  resultBadgeTitle: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 15,
    color: Theme.colors.foreground,
    marginBottom: 4,
  },
  resultBadgeSubtitle: {
    ...Theme.typography.caption,
    fontSize: 13,
    color: Theme.colors.mutedForeground,
  },

  // Details Card
  detailsCard: {
    backgroundColor: '#121513', // Very dark green/black
    borderRadius: 24,
    padding: Theme.spacing.l,
    marginHorizontal: Theme.spacing.pageHorizontal,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailsTitle: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 20,
    color: Theme.colors.foreground,
    marginBottom: 2,
  },
  detailsPer100g: {
    ...Theme.typography.caption,
    fontSize: 12,
    color: Theme.colors.mutedForeground,
    marginBottom: Theme.spacing.l,
  },

  // Macros Grid
  macrosGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Theme.spacing.xl,
  },
  macroBox: {
    flex: 1,
    backgroundColor: '#181C1A',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  macroValue: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 16,
    marginBottom: 4,
  },
  macroLabel: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: 'uppercase',
    color: Theme.colors.mutedForeground,
  },

  // Inputs
  inputGroup: {
    marginBottom: Theme.spacing.l,
  },
  inputLabel: {
    ...Theme.typography.caption,
    fontSize: 11,
    color: Theme.colors.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#181C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: Theme.spacing.l,
    color: Theme.colors.foreground,
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 18,
  },

  // Totals
  totalsBox: {
    backgroundColor: '#181C1A',
    borderRadius: 16,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    marginBottom: Theme.spacing.xl,
  },
  totalsTitle: {
    ...Theme.typography.caption,
    fontSize: 11,
    color: Theme.colors.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalsKcal: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 16,
    color: Theme.colors.primary,
  },
  totalsMacro: {
    ...Theme.typography.body,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Meal Type Dropdown
  dropdownInput: {
    backgroundColor: '#181C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: Theme.spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: Theme.colors.foreground,
    fontFamily: Theme.typography.body.fontFamily,
    fontSize: 16,
  },
  dropdownOptionsInline: {
    backgroundColor: '#181C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 8,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: Theme.spacing.l,
  },
  dropdownOptionText: {
    color: Theme.colors.foreground,
    fontFamily: Theme.typography.body.fontFamily,
    fontSize: 16,
  },

  // Submit Button (Pill shaped)
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: 100, // Pill shape
    height: 52,
    gap: 8,
    marginTop: Theme.spacing.m,
  },
  submitButtonText: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 16,
    color: Theme.colors.primaryForeground,
  },
});

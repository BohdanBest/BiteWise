import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Animated
} from 'react-native';
import { Check, ChevronDown, AlertTriangle } from 'lucide-react-native';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface ResultStepProps {
  mockResults: any[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  weight: string;
  setWeight: (w: string) => void;
  mealType: string;
  setMealType: (m: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  mealTypeLabels: Record<string, string>;
  slideAnim: Animated.Value;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ResultStep({
  mockResults,
  selectedIndex,
  setSelectedIndex,
  weight,
  setWeight,
  mealType,
  setMealType,
  isDropdownOpen,
  setIsDropdownOpen,
  mealTypeLabels,
  slideAnim,
  onSubmit,
  onCancel,
}: ResultStepProps) {
  const selected = mockResults[selectedIndex];
  const weightNum = Number(weight) || 0;
  const factor = weightNum / 100;
  
  const theme = useTheme();
  const styles = useStyles(createStyles);

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateY: slideAnim }] }}>
      <ScrollView 
        contentContainerStyle={styles.resultScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerResult}>
          <Text style={styles.title}>Результат</Text>
        </View>
        
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
                <Text style={[styles.resultBadgeTitle, isSelected && { color: theme.colors.primary }]}>
                  {result.food.nameUa}
                </Text>
                <Text style={styles.resultBadgeSubtitle}>
                  {result.confidence}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{selected.food.nameUa}</Text>
          <Text style={styles.detailsPer100g}>на 100г</Text>

          {selected.warning && (
            <View style={styles.warningBox}>
              <AlertTriangle size={16} color={theme.colors.warning} />
              <Text style={styles.warningText}>{selected.warning}</Text>
            </View>
          )}

          <View style={styles.macrosGrid}>
            <View style={styles.macroBox}>
              <Text style={[styles.macroValue, { color: theme.colors.primary }]}>{selected.food.calories}</Text>
              <Text style={styles.macroLabel}>ККАЛ</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={[styles.macroValue, { color: theme.colors.foreground }]}>{Number(selected.food.protein).toFixed(1)}г</Text>
              <Text style={styles.macroLabel}>БІЛКИ</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={[styles.macroValue, { color: theme.colors.foreground }]}>{Number(selected.food.fat).toFixed(1)}г</Text>
              <Text style={styles.macroLabel}>ЖИРИ</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={[styles.macroValue, { color: theme.colors.foreground }]}>{Number(selected.food.carbs).toFixed(1)}г</Text>
              <Text style={styles.macroLabel}>ВУГЛЕВ.</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ВАГА ПОРЦІЇ (Г)</Text>
            <TextInput
              style={styles.textInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={theme.colors.mutedForeground}
            />
          </View>

          <View style={styles.totalsBox}>
            <Text style={styles.totalsTitle}>ДЛЯ {weightNum}Г ПОРЦІЇ</Text>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsKcal}>{Math.round(selected.food.calories * factor)} ккал</Text>
              <Text style={styles.totalsMacro}>Б: {(selected.food.protein * factor).toFixed(1)}</Text>
              <Text style={styles.totalsMacro}>Ж: {(selected.food.fat * factor).toFixed(1)}</Text>
              <Text style={styles.totalsMacro}>В: {(selected.food.carbs * factor).toFixed(1)}</Text>
            </View>
          </View>

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
                color={theme.colors.mutedForeground} 
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
                      key === mealType && { color: theme.colors.primary }
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
            onPress={onSubmit}
          >
            <Check size={20} color={theme.colors.primaryForeground} strokeWidth={2.5} />
            <Text style={styles.submitButtonText}>Додати в щоденник</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Скасувати</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </Animated.View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  headerResult: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.pageHorizontal,
    marginBottom: theme.spacing.m,
  },
  title: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: 28,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  resultScrollContent: {
    paddingBottom: 130,
  },
  horizontalScroll: {
    marginBottom: theme.spacing.m,
  },
  horizontalScrollContent: {
    paddingHorizontal: theme.spacing.pageHorizontal,
    gap: theme.spacing.s,
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
    backgroundColor: theme.colors.card,
    borderColor: 'rgba(21, 191, 99, 0.4)',
  },
  resultBadgeUnselected: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  resultBadgeTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 15,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  resultBadgeSubtitle: {
    fontFamily: 'System',
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  detailsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: theme.spacing.l,
    marginHorizontal: theme.spacing.pageHorizontal,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailsTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 20,
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  detailsPer100g: {
    fontFamily: 'System',
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.l,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: theme.spacing.l,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  warningText: {
    fontFamily: 'System',
    fontSize: 12,
    color: theme.colors.warning,
    flex: 1,
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.xl,
  },
  macroBox: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  macroValue: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  macroLabel: {
    fontFamily: 'System',
    fontSize: 10,
    textTransform: 'uppercase',
    color: theme.colors.mutedForeground,
  },
  inputGroup: {
    marginBottom: theme.spacing.l,
  },
  inputLabel: {
    fontFamily: 'System',
    fontSize: 11,
    color: theme.colors.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: theme.spacing.l,
    color: theme.colors.foreground,
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 18,
  },
  totalsBox: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  totalsTitle: {
    fontFamily: 'System',
    fontSize: 11,
    color: theme.colors.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalsKcal: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.primary,
  },
  totalsMacro: {
    fontFamily: 'System',
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  dropdownInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: theme.spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: theme.colors.foreground,
    fontFamily: 'System',
    fontSize: 16,
  },
  dropdownOptionsInline: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 8,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.l,
  },
  dropdownOptionText: {
    color: theme.colors.foreground,
    fontFamily: 'System',
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    height: 52,
    gap: 8,
    marginTop: theme.spacing.m,
  },
  submitButtonText: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    marginTop: 8,
  },
  cancelButtonText: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.mutedForeground,
  },
});

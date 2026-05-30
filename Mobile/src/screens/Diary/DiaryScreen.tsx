import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sun, Moon, Apple, Sunrise, Trash2 } from "lucide-react-native";
import { Theme } from "../../constants/theme";
import { useTheme, useStyles } from "../../hooks/useTheme";
import { useDiaryStore, FoodEntryResponseDto } from "../../store/useDiaryStore";
import { useEffect, useMemo, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";

const MEAL_TYPES = [
  { id: 0, title: "Сніданок", icon: Sunrise },
  { id: 1, title: "Обід", icon: Sun },
  { id: 2, title: "Вечеря", icon: Moon },
  { id: 3, title: "Перекус", icon: Apple },
];

export default function DiaryScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { summary, isLoading, selectedDate, fetchSummary, changeDate, deleteFoodItem } = useDiaryStore();
  const isFocused = useIsFocused();
  const swipeableRefs = useRef<Map<string, any>>(new Map());

  // Refresh summary when switching to this tab
  useEffect(() => {
    if (isFocused) {
      fetchSummary(selectedDate);
    }
  }, [isFocused, selectedDate]);

  const totals = {
    calories: summary?.totalCaloriesConsumed || 0,
    proteins: Math.round(summary?.totalProteins || 0),
    fats: Math.round(summary?.totalFats || 0),
    carbs: Math.round(summary?.totalCarbs || 0),
  };

  const entriesByMeal = useMemo(() => {
    const groups: Record<number, FoodEntryResponseDto[]> = { 0: [], 1: [], 2: [], 3: [] };
    if (summary?.entries) {
      summary.entries.forEach(entry => {
        if (groups[entry.mealType]) {
          groups[entry.mealType].push(entry);
        }
      });
    }
    return groups;
  }, [summary?.entries]);

  // Generate a sliding window of 7 dates (3 before, today, 3 after)
  const renderDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + i);
      dates.push({
        offset: i,
        dayString: ["НД", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"][date.getDay()],
        dateString: date.getDate().toString(),
        active: i === 0
      });
    }

    return (
      <View style={styles.datePickerContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScroll}>
          {dates.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dateCard, item.active && styles.dateCardActive]}
              activeOpacity={0.7}
              onPress={() => changeDate(item.offset)}>
              <Text style={[styles.dateDay, item.active && styles.dateTextActive]}>
                {item.dayString}
              </Text>
              <Text style={[styles.dateNumber, item.active && styles.dateTextActive]}>
                {item.dateString}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMealSection = (mealId: number, title: string, Icon: any) => {
    const mealItems = entriesByMeal[mealId] || [];

    return (
      <View style={styles.mealSection} key={mealId}>
        <View style={styles.mealHeader}>
          <Icon size={20} color={mealId === 3 ? theme.colors.destructive : theme.colors.warning} style={styles.mealIcon} />
          <Text style={styles.mealTitle}>{title}</Text>
        </View>

        <View style={styles.mealItemsContainer}>
          {mealItems.length === 0 ? (
            <View style={[styles.mealItemCard, styles.emptyMealCard]}>
              <Text style={styles.emptyMealText}>Додайте прийом їжі</Text>
              <View style={styles.emptyBadge}>
                <Text style={styles.emptyBadgeText}>0 ккал</Text>
              </View>
            </View>
          ) : (
            mealItems.map((item, index) => {
              const isLast = index === mealItems.length - 1;
              
              const renderRightActions = (progress: any, dragX: any) => {
                const scale = dragX.interpolate({
                  inputRange: [-60, 0],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                });

                return (
                  <TouchableOpacity
                    style={[styles.deleteAction, isLast && { marginBottom: 0 }]}
                    onPress={() => {
                      const ref = swipeableRefs.current.get(item.id);
                      if (ref) ref.close();
                      deleteFoodItem(item.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <Animated.View style={[{ transform: [{ scale }] }]}>
                      <Trash2 size={20} color="#FFF" />
                    </Animated.View>
                  </TouchableOpacity>
                );
              };

              return (
                <Swipeable
                  key={item.id}
                  ref={ref => {
                    if (ref) swipeableRefs.current.set(item.id, ref);
                    else swipeableRefs.current.delete(item.id);
                  }}
                  renderRightActions={renderRightActions}
                  friction={2}
                  rightThreshold={40}
                  overshootRight={false}
                  containerStyle={isLast ? { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 } : {}}
                >
                  <View style={[styles.mealItemCard, isLast && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                    <View>
                      <Text style={styles.foodName}>{item.foodName}</Text>
                      <Text style={styles.foodDetails}>{item.weightGrams}г · {item.calories} ккал</Text>
                    </View>
                  </View>
                </Swipeable>
              );
            })
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Щоденник</Text>

        {renderDates()}

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 40 }} />
        ) : (
          <>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>ПІДСУМОК ДНЯ</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                    {totals.calories}
                  </Text>
                  <Text style={styles.summaryLabel}>ККАЛ</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{totals.proteins}</Text>
                  <Text style={styles.summaryLabel}>БІЛКИ</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{totals.fats}</Text>
                  <Text style={styles.summaryLabel}>ЖИРИ</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{totals.carbs}</Text>
                  <Text style={styles.summaryLabel}>ВУГЛЕВ.</Text>
                </View>
              </View>
            </View>

            {/* Meals Sections */}
            {MEAL_TYPES.map(meal => renderMealSection(meal.id, meal.title, meal.icon))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.pageHorizontal,
    paddingTop: theme.spacing.l,
    paddingBottom: 120,
  },
  headerTitle: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 28,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.l,
  },

  // Date Picker
  datePickerContainer: {
    marginBottom: theme.spacing.xl,
  },
  dateScroll: {
    gap: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  dateCard: {
    width: 60,
    height: 72,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  dateCardActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.glowPrimary, // Додамо світіння
  },
  dateDay: {
    ...theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dateNumber: {
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: 18,
    color: theme.colors.foreground,
  },
  dateTextActive: {
    color: theme.colors.primaryForeground,
  },

  summaryCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    ...theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: theme.spacing.l,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: 20,
    color: theme.colors.foreground,
    marginBottom: 4,
    paddingHorizontal: 2, 
  },
  summaryLabel: {
    ...theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
  },

  // Meals Sections
  mealSection: {
    marginBottom: theme.spacing.xl,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.m,
  },
  mealIcon: {
    marginRight: 10,
  },
  mealTitle: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 18,
    color: theme.colors.foreground,
  },

  // Meal Items
  mealItemsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mealItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  foodName: {
    ...theme.typography.body,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  foodDetails: {
    ...theme.typography.caption,
    fontFamily: theme.typography.tabularNums.fontFamily,
  },

  // Empty State
  emptyMealCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
    paddingBottom: 0, 
    marginBottom: 0,
  },
  emptyMealText: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
  },
  emptyBadge: {
    backgroundColor: "rgba(21, 191, 99, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  emptyBadgeText: {
    fontFamily: theme.typography.tabularNums.fontFamily,
    fontSize: 12,
    color: theme.colors.primary,
  },
  
  // Swipeable
  deleteAction: {
    backgroundColor: theme.colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 16,
    alignSelf: 'center',
    marginBottom: 16, // Щоб вирівняти з урахуванням відступів карток
  },
});

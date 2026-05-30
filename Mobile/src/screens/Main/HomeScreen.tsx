import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Sun,
  Sunrise,
  Moon,
  Coffee,
} from "lucide-react-native";
import { Theme } from "../../constants/theme";
import { useTheme, useStyles } from "../../hooks/useTheme";
import CircularProgress from "../../components/ui/CircularProgress";
import LinearProgress from "../../components/ui/LinearProgress";
import { useNavigation } from "@react-navigation/native";

import mascotImg from "../../../assets/mascot.png";
import { useUserStore } from "../../store/useUserStore";
import { useDiaryStore, FoodEntryResponseDto } from "../../store/useDiaryStore";

const MONTHS_UA = [
  "січ.", "лют.", "бер.", "квіт.", "трав.", "черв.",
  "лип.", "серп.", "вер.", "жовт.", "лист.", "груд."
];

const MEAL_TYPES = [
  { id: 0, title: "Сніданок", icon: Sunrise },
  { id: 1, title: "Обід", icon: Sun },
  { id: 2, title: "Вечеря", icon: Moon },
  { id: 3, title: "Перекус", icon: Coffee },
];

export default function HomeScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const navigation = useNavigation<any>();
  const { profile } = useUserStore();
  const { selectedDate, summary, isLoading, fetchSummary, changeDate } = useDiaryStore();

  useEffect(() => {
    fetchSummary(selectedDate);
  }, [selectedDate]);

  const dateText = `${selectedDate.getDate()} ${MONTHS_UA[selectedDate.getMonth()]}`;

  const dailyGoal = profile?.dailyCalorieGoal || 2000;
  const consumed = summary?.totalCaloriesConsumed || 0;
  const remaining = summary?.remainingCalories ?? dailyGoal;

  // Macros Targets
  const targetProtein = Math.round((dailyGoal * 0.3) / 4);
  const targetFat = Math.round((dailyGoal * 0.3) / 9);
  const targetCarbs = Math.round((dailyGoal * 0.4) / 4);

  const currentProtein = summary?.totalProteins || 0;
  const currentFat = summary?.totalFats || 0;
  const currentCarbs = summary?.totalCarbs || 0;

  // Group meals
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={mascotImg}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.greetingText}>ПРИВІТ 👋</Text>
              <Text style={styles.userName}>
                {profile?.name ? profile.name.split(" ")[0] : "Користувач"}
              </Text>
            </View>
          </View>

          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => changeDate(-1)} activeOpacity={0.7} style={{ padding: 4 }}>
              <ChevronLeft size={20} color={theme.colors.mutedForeground} />
            </TouchableOpacity>
            <Text style={styles.dateText}>{dateText}</Text>
            <TouchableOpacity onPress={() => changeDate(1)} activeOpacity={0.7} style={{ padding: 4 }}>
              <ChevronRight size={20} color={theme.colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {consumed > 0 && (
          <View style={styles.motivationBanner}>
            <Sparkles size={16} color={theme.colors.primary} />
            <Text style={styles.motivationText}>Чудовий прогрес сьогодні!</Text>
          </View>
        )}

        {/* Dashboard Card */}
        <View style={styles.dashboardCard}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 40 }} />
          ) : (
            <View style={styles.dashboardContent}>
              <View style={styles.circularProgressContainer}>
                <CircularProgress
                  size={140}
                  strokeWidth={12}
                  currentValue={consumed}
                  maxValue={dailyGoal}
                  color={theme.colors.primary}>
                  <View style={styles.circularContent}>
                    <Text style={styles.caloriesNumber}>{remaining}</Text>
                    <Text style={styles.caloriesLabel}>ЗАЛИШИЛОСЬ</Text>
                  </View>
                </CircularProgress>
              </View>

              <View style={styles.macrosContainer}>
                <View style={styles.consumedHeader}>
                  <Text style={styles.consumedNumber}>{consumed}</Text>
                  <Text style={styles.consumedLabel}>З'ЇДЕНО ККАЛ</Text>
                </View>

                <View style={styles.macroRow}>
                  <View style={styles.macroHeader}>
                    <Text style={styles.macroLabel}>БІЛКИ</Text>
                    <Text style={styles.macroValue}>{Math.round(currentProtein)}/{targetProtein}г</Text>
                  </View>
                  <LinearProgress
                    currentValue={currentProtein}
                    maxValue={targetProtein}
                    color={theme.colors.primary}
                    height={6}
                  />
                </View>

                <View style={styles.macroRow}>
                  <View style={styles.macroHeader}>
                    <Text style={styles.macroLabel}>ЖИРИ</Text>
                    <Text style={styles.macroValue}>{Math.round(currentFat)}/{targetFat}г</Text>
                  </View>
                  <LinearProgress
                    currentValue={currentFat}
                    maxValue={targetFat}
                    color={theme.colors.warning}
                    height={6}
                  />
                </View>

                <View style={styles.macroRow}>
                  <View style={styles.macroHeader}>
                    <Text style={styles.macroLabel}>ВУГЛЕВОДИ</Text>
                    <Text style={styles.macroValue}>{Math.round(currentCarbs)}/{targetCarbs}г</Text>
                  </View>
                  <LinearProgress
                    currentValue={currentCarbs}
                    maxValue={targetCarbs}
                    color={theme.colors.primary}
                    height={6}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Meals Section */}
        <View style={styles.mealsHeader}>
          <Text style={styles.mealsTitle}>Прийоми їжі</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ScanTab")}
          >
            <Plus size={24} color={theme.colors.background} />
          </TouchableOpacity>
        </View>

        {/* Render Meal Cards */}
        {MEAL_TYPES.map(meal => {
          const items = entriesByMeal[meal.id] || [];
          const mealCalories = items.reduce((sum, item) => sum + item.calories, 0);
          const IconComponent = meal.icon;

          return (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealCardHeader}>
                <View style={styles.mealTitleRow}>
                  <IconComponent
                    size={20}
                    color={theme.colors.warning}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={styles.mealTitle}>{meal.title}</Text>
                </View>
                {mealCalories > 0 && (
                  <View style={styles.mealCaloriesBadge}>
                    <Text style={styles.mealCaloriesText}>{mealCalories} ккал</Text>
                  </View>
                )}
              </View>

              {items.map((item) => (
                <View key={item.id} style={styles.foodItem}>
                  <Text style={styles.foodName}>{item.foodName}</Text>
                  <Text style={styles.foodDetails}>{item.weightGrams}г · {item.calories} ккал</Text>
                </View>
              ))}

              {items.length === 0 && (
                <Text style={styles.emptyMealText}>Ще нічого не додано</Text>
              )}
            </View>
          );
        })}

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
    paddingTop: theme.spacing.m,
    paddingBottom: 100, // Space for bottom nav
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.l,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "120%",
    height: "120%",
    marginTop: 6, // adjust mascot position
  },
  greetingText: {
    ...theme.typography.overline,
    color: theme.colors.mutedForeground,
    marginBottom: 2,
  },
  userName: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 18,
    color: theme.colors.foreground,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.card,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateText: {
    ...theme.typography.body,
    color: theme.colors.foreground,
    marginHorizontal: 4,
  },

  motivationBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(21, 191, 99, 0.1)", // primary with opacity
    borderWidth: 1,
    borderColor: "rgba(21, 191, 99, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.radius.full,
    alignSelf: "flex-start",
    marginBottom: theme.spacing.xl,
  },
  motivationText: {
    ...theme.typography.body,
    color: theme.colors.foreground,
  },

  dashboardCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    minHeight: 180,
    justifyContent: 'center'
  },
  dashboardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.l,
  },
  circularProgressContainer: {
    width: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  circularContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesNumber: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 32,
    color: theme.colors.foreground,
    paddingHorizontal: 4, // Запобігає обрізанню
  },
  caloriesLabel: {
    ...theme.typography.caption,
    fontSize: 10,
    marginTop: 2,
    textTransform: "uppercase",
  },
  macrosContainer: {
    flex: 1,
  },
  consumedHeader: {
    alignItems: "flex-end",
    marginBottom: theme.spacing.l,
  },
  consumedNumber: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 28,
    color: theme.colors.foreground,
    lineHeight: 32,
    paddingHorizontal: 4, // Запобігає обрізанню
  },
  consumedLabel: {
    ...theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
  },
  macroRow: {
    marginBottom: theme.spacing.m,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  macroLabel: {
    ...theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
  },
  macroValue: {
    fontFamily: theme.typography.tabularNums.fontFamily,
    fontSize: 11,
    color: theme.colors.foreground,
    paddingHorizontal: 4, // Запобігає обрізанню
  },

  // Meals Section
  mealsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.m,
  },
  mealsTitle: {
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: 22,
    color: theme.colors.foreground,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  mealCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  mealCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.m,
  },
  mealTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealTitle: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 18,
    color: theme.colors.foreground,
  },
  mealCaloriesBadge: {
    backgroundColor: "rgba(21, 191, 99, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  mealCaloriesText: {
    fontFamily: theme.typography.tabularNums.fontFamily,
    fontSize: 12,
    color: theme.colors.primary,
  },
  foodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.s,
  },
  foodName: {
    ...theme.typography.body,
    color: theme.colors.foreground,
    flex: 1,
  },
  foodDetails: {
    ...theme.typography.caption,
    fontFamily: theme.typography.tabularNums.fontFamily,
    marginLeft: 8,
  },
  emptyMealText: {
    ...theme.typography.caption,
    fontStyle: 'italic',
    marginTop: -4,
  }
});

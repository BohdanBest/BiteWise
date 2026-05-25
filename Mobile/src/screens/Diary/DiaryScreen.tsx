import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Sun, Moon, Apple, Trash2 } from "lucide-react-native";
import { Theme } from "../../constants/theme";

const DATES = [
  { day: "СБ", date: "23", active: false },
  { day: "НД", date: "24", active: false },
  { day: "ПН", date: "25", active: false },
  { day: "ВТ", date: "26", active: true },
  { day: "СР", date: "27", active: false },
  { day: "ЧТ", date: "28", active: false },
  { day: "ПТ", date: "29", active: false },
];

const renderRightActions = (
  progress: Animated.AnimatedInterpolation<number>,
  dragX: Animated.AnimatedInterpolation<number>,
) => {
  const scale = dragX.interpolate({
    inputRange: [-80, -40, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const opacity = dragX.interpolate({
    inputRange: [-60, -20, 0],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.swipeActionContainer,
        { opacity, transform: [{ scale }] },
      ]}>
      <TouchableOpacity style={styles.deleteButtonWrapper}>
        <Trash2 size={40} color={Theme.colors.destructive} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function DiaryScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Щоденник</Text>

        <View style={styles.datePickerContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScroll}>
            {DATES.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dateCard, item.active && styles.dateCardActive]}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.dateDay,
                    item.active && styles.dateTextActive,
                  ]}>
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.dateNumber,
                    item.active && styles.dateTextActive,
                  ]}>
                  {item.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>ПІДСУМОК ДНЯ</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryValue, { color: Theme.colors.primary }]}>
                1036
              </Text>
              <Text style={styles.summaryLabel}>ККАЛ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>96</Text>
              <Text style={styles.summaryLabel}>БІЛКИ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>51</Text>
              <Text style={styles.summaryLabel}>ЖИРИ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>41</Text>
              <Text style={styles.summaryLabel}>ВУГЛЕВ.</Text>
            </View>
          </View>
        </View>

        {/* Lunch Section */}
        <View style={styles.mealSection}>
          <View style={styles.mealHeader}>
            <Sun
              size={20}
              color={Theme.colors.warning}
              style={styles.mealIcon}
            />
            <Text style={styles.mealTitle}>Обід</Text>
          </View>

          <View style={styles.mealItemsContainer}>
            <Swipeable
              friction={2}
              overshootRight={false}
              renderRightActions={renderRightActions}>
              <View style={styles.mealItemCard}>
                <View>
                  <Text style={styles.foodName}>Курка гриль</Text>
                  <Text style={styles.foodDetails}>200г · 330 ккал</Text>
                </View>
              </View>
            </Swipeable>

            <Swipeable
              friction={2}
              overshootRight={false}
              renderRightActions={renderRightActions}>
              <View style={styles.mealItemCard}>
                <View>
                  <Text style={styles.foodName}>Грецький салат</Text>
                  <Text style={styles.foodDetails}>200г · 260 ккал</Text>
                </View>
              </View>
            </Swipeable>

            <Swipeable
              friction={2}
              overshootRight={false}
              renderRightActions={renderRightActions}>
              <View
                style={[
                  styles.mealItemCard,
                  { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 },
                ]}>
                <View>
                  <Text style={styles.foodName}>Борщ</Text>
                  <Text style={styles.foodDetails}>300г · 225 ккал</Text>
                </View>
              </View>
            </Swipeable>
          </View>
        </View>

        {/* Dinner Section */}
        <View style={styles.mealSection}>
          <View style={styles.mealHeader}>
            <Moon
              size={20}
              color={Theme.colors.warning}
              style={styles.mealIcon}
            />
            <Text style={styles.mealTitle}>Вечеря</Text>
          </View>

          <View style={[styles.mealItemCard, styles.emptyMealCard]}>
            <Text style={styles.emptyMealText}>Додайте прийом їжі</Text>
            <View style={styles.emptyBadge}>
              <Text style={styles.emptyBadgeText}>0 ккал</Text>
            </View>
          </View>
        </View>

        {/* Snack Section */}
        <View style={styles.mealSection}>
          <View style={styles.mealHeader}>
            <Apple
              size={20}
              color={Theme.colors.destructive}
              style={styles.mealIcon}
            />
            <Text style={styles.mealTitle}>Перекус</Text>
          </View>

          <View style={[styles.mealItemCard, styles.emptyMealCard]}>
            <Text style={styles.emptyMealText}>Додайте прийом їжі</Text>
            <View style={styles.emptyBadge}>
              <Text style={styles.emptyBadgeText}>0 ккал</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.pageHorizontal,
    paddingTop: Theme.spacing.l,
    paddingBottom: 120, // Зручний відступ для скляної панелі навігації
  },
  headerTitle: {
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 28,
    color: Theme.colors.foreground,
    marginBottom: Theme.spacing.l,
  },

  // Date Picker
  datePickerContainer: {
    marginBottom: Theme.spacing.xl,
  },
  dateScroll: {
    gap: Theme.spacing.m,
    paddingBottom: Theme.spacing.s,
  },
  dateCard: {
    width: 60,
    height: 72,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  dateCardActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.glowPrimary, // Додамо світіння
  },
  dateDay: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dateNumber: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 18,
    color: Theme.colors.foreground,
  },
  dateTextActive: {
    color: Theme.colors.primaryForeground,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Theme.colors.card,
    borderRadius: 4,
    marginTop: Theme.spacing.m,
    overflow: "hidden",
  },
  progressBarFill: {
    width: "40%", // Приблизний прогрес дня
    height: "100%",
    backgroundColor: Theme.colors.border, // Сірий колір, як на макеті
    borderRadius: 4,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.xl,
  },
  summaryTitle: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: Theme.spacing.l,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 20,
    color: Theme.colors.foreground,
    marginBottom: 4,
    paddingHorizontal: 2, // Запобігає обрізанню цифр на Android
  },
  summaryLabel: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
  },

  // Meals Sections
  mealSection: {
    marginBottom: Theme.spacing.xl,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.m,
  },
  mealIcon: {
    marginRight: 10,
  },
  mealTitle: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 18,
    color: Theme.colors.foreground,
  },

  // Meal Items
  mealItemsContainer: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  mealItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingBottom: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
  },
  foodName: {
    ...Theme.typography.body,
    color: Theme.colors.foreground,
    marginBottom: 4,
  },
  foodDetails: {
    ...Theme.typography.caption,
    fontFamily: Theme.typography.tabularNums.fontFamily,
  },
  swipeActionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    marginBottom: Theme.spacing.m,
  },
  deleteButtonWrapper: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty State
  emptyMealCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderBottomWidth: 1, // Reset from mealItemCard override
    paddingBottom: Theme.spacing.l, // Reset
    marginBottom: 0,
  },
  emptyMealText: {
    ...Theme.typography.body,
    color: Theme.colors.mutedForeground,
  },
  emptyBadge: {
    backgroundColor: "rgba(21, 191, 99, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
  },
  emptyBadgeText: {
    fontFamily: Theme.typography.tabularNums.fontFamily,
    fontSize: 12,
    color: Theme.colors.primary,
  },
});

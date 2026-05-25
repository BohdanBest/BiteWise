import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Sun,
  Sunrise,
} from "lucide-react-native";
import { Theme } from "../../constants/theme";
import CircularProgress from "../../components/ui/CircularProgress";
import LinearProgress from "../../components/ui/LinearProgress";

// @ts-ignore
import mascotImg from "../../../assets/mascot.png";

export default function HomeScreen() {
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
              <Text style={styles.userName}>Олександр</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.dateSelector} activeOpacity={0.7}>
            <ChevronLeft size={16} color={Theme.colors.mutedForeground} />
            <Text style={styles.dateText}>25 трав.</Text>
            <ChevronRight size={16} color={Theme.colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Motivation Banner */}
        <View style={styles.motivationBanner}>
          <Sparkles size={16} color={Theme.colors.primary} />
          <Text style={styles.motivationText}>Чудовий прогрес сьогодні!</Text>
        </View>

        {/* Dashboard Card */}
        <View style={styles.dashboardCard}>
          <View style={styles.dashboardContent}>
            <View style={styles.circularProgressContainer}>
              <CircularProgress
                size={140}
                strokeWidth={12}
                currentValue={1517}
                maxValue={2400}
                color={Theme.colors.primary}>
                <View style={styles.circularContent}>
                  <Text style={styles.caloriesNumber}>883</Text>
                  <Text style={styles.caloriesLabel}>ЗАЛИШИЛОСЬ</Text>
                </View>
              </CircularProgress>
            </View>

            <View style={styles.macrosContainer}>
              <View style={styles.consumedHeader}>
                <Text style={styles.consumedNumber}>1517</Text>
                <Text style={styles.consumedLabel}>З'ЇДЕНО ККАЛ</Text>
              </View>

              <View style={styles.macroRow}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroLabel}>БІЛКИ</Text>
                  <Text style={styles.macroValue}>110/150г</Text>
                </View>
                <LinearProgress
                  currentValue={110}
                  maxValue={150}
                  color={Theme.colors.primary}
                  height={6}
                />
              </View>

              <View style={styles.macroRow}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroLabel}>ЖИРИ</Text>
                  <Text style={styles.macroValue}>58/80г</Text>
                </View>
                <LinearProgress
                  currentValue={58}
                  maxValue={80}
                  color={Theme.colors.warning}
                  height={6}
                />
              </View>

              <View style={styles.macroRow}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroLabel}>ВУГЛЕВОДИ</Text>
                  <Text style={styles.macroValue}>137/300г</Text>
                </View>
                <LinearProgress
                  currentValue={137}
                  maxValue={300}
                  color={Theme.colors.primary}
                  height={6}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Meals Section */}
        <View style={styles.mealsHeader}>
          <Text style={styles.mealsTitle}>Прийоми їжі</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
            <Plus size={24} color={Theme.colors.background} />
          </TouchableOpacity>
        </View>

        {/* Meal Card: Сніданок */}
        <View style={styles.mealCard}>
          <View style={styles.mealCardHeader}>
            <View style={styles.mealTitleRow}>
              <Sunrise
                size={20}
                color={Theme.colors.warning}
                style={{ marginRight: 12 }}
              />
              <Text style={styles.mealTitle}>Сніданок</Text>
            </View>
            <View style={styles.mealCaloriesBadge}>
              <Text style={styles.mealCaloriesText}>482 ккал</Text>
            </View>
          </View>

          <View style={styles.foodItem}>
            <Text style={styles.foodName}>Вівсянка</Text>
            <Text style={styles.foodDetails}>250г · 375 ккал</Text>
          </View>
          <View style={styles.foodItem}>
            <Text style={styles.foodName}>Банан</Text>
            <Text style={styles.foodDetails}>120г · 107 ккал</Text>
          </View>
        </View>

        {/* Meal Card: Обід */}
        <View style={styles.mealCard}>
          <View style={styles.mealCardHeader}>
            <View style={styles.mealTitleRow}>
              <Sun
                size={20}
                color={Theme.colors.warning}
                style={{ marginRight: 12 }}
              />
              <Text style={styles.mealTitle}>Обід</Text>
            </View>
            <View style={styles.mealCaloriesBadge}>
              <Text style={styles.mealCaloriesText}>815 ккал</Text>
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
    paddingTop: Theme.spacing.m,
    paddingBottom: 100, // Space for bottom nav
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.l,
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
    backgroundColor: Theme.colors.card,
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
    ...Theme.typography.overline,
    color: Theme.colors.mutedForeground,
    marginBottom: 2,
  },
  userName: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 18,
    color: Theme.colors.foreground,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Theme.colors.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  dateText: {
    ...Theme.typography.body,
    color: Theme.colors.foreground,
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
    borderRadius: Theme.radius.full,
    alignSelf: "flex-start",
    marginBottom: Theme.spacing.xl,
  },
  motivationText: {
    ...Theme.typography.body,
    color: Theme.colors.foreground,
  },

  dashboardCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.xl,
  },
  dashboardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.l,
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
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 32,
    color: Theme.colors.foreground,
    paddingHorizontal: 4, // Запобігає обрізанню
  },
  caloriesLabel: {
    ...Theme.typography.caption,
    fontSize: 10,
    marginTop: 2,
    textTransform: "uppercase",
  },
  macrosContainer: {
    flex: 1,
  },
  consumedHeader: {
    alignItems: "flex-end",
    marginBottom: Theme.spacing.l,
  },
  consumedNumber: {
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 28,
    color: Theme.colors.foreground,
    lineHeight: 32,
    paddingHorizontal: 4, // Запобігає обрізанню
  },
  consumedLabel: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
  },
  macroRow: {
    marginBottom: Theme.spacing.m,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  macroLabel: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
  },
  macroValue: {
    fontFamily: Theme.typography.tabularNums.fontFamily,
    fontSize: 11,
    color: Theme.colors.foreground,
    paddingHorizontal: 4, // Запобігає обрізанню
  },

  // Meals Section
  mealsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.m,
  },
  mealsTitle: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 22,
    color: Theme.colors.foreground,
  },
  addButton: {
    backgroundColor: Theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: Theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  mealCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.m,
  },
  mealCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.m,
  },
  mealTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealTitle: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 18,
    color: Theme.colors.foreground,
  },
  mealCaloriesBadge: {
    backgroundColor: "rgba(21, 191, 99, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  mealCaloriesText: {
    fontFamily: Theme.typography.tabularNums.fontFamily,
    fontSize: 12,
    color: Theme.colors.primary,
  },
  foodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.xs,
  },
  foodName: {
    ...Theme.typography.body,
    color: Theme.colors.foreground,
  },
  foodDetails: {
    ...Theme.typography.caption,
    fontFamily: Theme.typography.tabularNums.fontFamily,
  },
});

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  Zap,
  Calendar,
  Weight,
  Ruler,
  Target,
  Settings,
  LogOut,
  Award,
} from "lucide-react-native";
import { Theme } from "../../constants/theme";
import { useTheme, useStyles } from "../../hooks/useTheme";
import mascotWave from "../../../assets/mascot-wave.png";
import { useUserStore } from "../../store/useUserStore";
import useAuthStore from "../../store/useAuthStore";

export default function ProfileScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const navigation = useNavigation<any>();
  const { profile, isLoading } = useUserStore();
  const logout = useAuthStore((state) => state.logout);

  const getGoalText = (goal: string) => {
    switch(goal) {
      case 'lose': return 'Схуднення';
      case 'maintain': return 'Підтримка ваги';
      case 'gain': return 'Набір маси';
      default: return 'Підтримка ваги';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {isLoading || !profile ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Завантаження профілю...</Text>
        </View>
      ) : (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header / Avatar */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
              <Image source={mascotWave} style={styles.avatarImage} resizeMode="contain" />
            </View>
            <View style={styles.zapBadge}>
              <Zap
                size={14}
                color={theme.colors.primaryForeground}
                fill={theme.colors.primaryForeground}
              />
            </View>
          </View>
          <Text style={styles.userName}>{profile.name || 'Користувач'}</Text>
          <Text style={styles.userEmail}>{profile.email || 'user@example.com'}</Text>
        </View>

        {/* Personal Data Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Персональні дані</Text>

          <View style={styles.dataList}>
            <View style={styles.dataItem}>
              <View style={styles.iconBox}>
                <Calendar size={18} color={theme.colors.primary} />
              </View>
              <Text style={styles.dataLabel}>Вік</Text>
              <Text style={styles.dataValue}>{profile.age} років</Text>
            </View>

            <View style={styles.dataItem}>
              <View style={styles.iconBox}>
                <Weight size={18} color={theme.colors.primary} />
              </View>
              <Text style={styles.dataLabel}>Вага</Text>
              <Text style={styles.dataValue}>{profile.weightKg} кг</Text>
            </View>

            <View style={styles.dataItem}>
              <View style={styles.iconBox}>
                <Ruler size={18} color={theme.colors.primary} />
              </View>
              <Text style={styles.dataLabel}>Зріст</Text>
              <Text style={styles.dataValue}>{profile.heightCm} см</Text>
            </View>

            <View
              style={[
                styles.dataItem,
                { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 },
              ]}>
              <View style={styles.iconBox}>
                <Target size={18} color={theme.colors.primary} />
              </View>
              <Text style={styles.dataLabel}>Ціль</Text>
              <Text style={styles.dataValue}>{profile.goalName || getGoalText(profile.goalName)}</Text>
            </View>
          </View>
        </View>

        {/* Daily Norm Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Денна норма</Text>

          <View style={styles.normContainer}>
            <Text style={styles.normValue}>{profile.dailyCalorieGoal}</Text>
            <Text style={styles.normUnit}>ккал/день</Text>
          </View>

          <Text style={styles.normFormula}>
            {profile.formulaDetails || 'ФОРМУЛА ХАРРІСА-БЕНЕДИКТА · КОЕФ. 1.55'}
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Achievements')}
        >
          <Award size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Мої досягнення</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.7}
          onPress={() => {
            if (Platform.OS === 'web' && typeof document !== 'undefined') {
              (document.activeElement as HTMLElement)?.blur();
            }
            navigation.navigate('Settings');
          }}
        >
          <Settings size={20} color={theme.colors.mutedForeground} />
          <Text style={styles.actionText}>Налаштування</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7} onPress={logout}>
          <LogOut size={20} color={theme.colors.destructive} />
          <Text
            style={[styles.actionText, { color: theme.colors.destructive }]}>
            Вийти з акаунту
          </Text>
        </TouchableOpacity>
      </ScrollView>
      )}
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
    paddingTop: theme.spacing.xl,
    paddingBottom: 120, // Відступ для нижньої навігації
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
  },

  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.m,
  },
  avatarBox: {
    width: 88,
    height: 88,
    backgroundColor: theme.colors.card,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarImage: {
    width: 80,
    height: 80,
  },
  zapBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  userName: {
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: 22,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  userEmail: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },

  // Cards
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  cardTitle: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 16,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.l,
  },

  // Data List
  dataList: {
    flexDirection: "column",
  },
  dataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.l,
    paddingBottom: theme.spacing.l,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(21, 191, 99, 0.1)", // Прозорий зелений
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.m,
    borderWidth: 1,
    borderColor: "rgba(21, 191, 99, 0.2)",
  },
  dataLabel: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
    flex: 1,
  },
  dataValue: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 15,
    color: theme.colors.foreground,
  },

  // Norm
  normContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: theme.spacing.m,
  },
  normValue: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 42,
    color: theme.colors.primary,
    marginRight: 8,
  },
  normUnit: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.primary,
    opacity: 0.8,
  },
  normFormula: {
    ...theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
  },

  // Action Buttons
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.s,
    gap: theme.spacing.m,
  },
  actionText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.foreground,
  },
});

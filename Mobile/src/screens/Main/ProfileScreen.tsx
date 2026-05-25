import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
} from "lucide-react-native";
import { Theme } from "../../constants/theme";
import mascotWave from "../../../assets/mascot-wave.png";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header / Avatar */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
              <Image source={mascotWave} style={styles.avatarImage} />
            </View>
            <View style={styles.zapBadge}>
              <Zap
                size={14}
                color={Theme.colors.primaryForeground}
                fill={Theme.colors.primaryForeground}
              />
            </View>
          </View>
          <Text style={styles.userName}>Олександр</Text>
          <Text style={styles.userEmail}>alex@example.com</Text>
        </View>

        {/* Personal Data Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Персональні дані</Text>

          <View style={styles.dataList}>
            <View style={styles.dataItem}>
              <View style={styles.iconBox}>
                <Calendar size={18} color={Theme.colors.primary} />
              </View>
              <Text style={styles.dataLabel}>Вік</Text>
              <Text style={styles.dataValue}>25 років</Text>
            </View>

            <View style={styles.dataItem}>
              <View style={styles.iconBox}>
                <Weight size={18} color={Theme.colors.primary} />
              </View>
              <Text style={styles.dataLabel}>Вага</Text>
              <Text style={styles.dataValue}>75 кг</Text>
            </View>

            <View style={styles.dataItem}>
              <View style={styles.iconBox}>
                <Ruler size={18} color={Theme.colors.primary} />
              </View>
              <Text style={styles.dataLabel}>Зріст</Text>
              <Text style={styles.dataValue}>180 см</Text>
            </View>

            <View
              style={[
                styles.dataItem,
                { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 },
              ]}>
              <View style={styles.iconBox}>
                <Target size={18} color={Theme.colors.primary} />
              </View>
              <Text style={styles.dataLabel}>Ціль</Text>
              <Text style={styles.dataValue}>Підтримка ваги</Text>
            </View>
          </View>
        </View>

        {/* Daily Norm Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Денна норма</Text>

          <View style={styles.normContainer}>
            <Text style={styles.normValue}>2813</Text>
            <Text style={styles.normUnit}>ккал/день</Text>
          </View>

          <Text style={styles.normFormula}>
            ФОРМУЛА ХАРРІСА-БЕНЕДИКТА · КОЕФ. 1.55
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Settings')}
        >
          <Settings size={20} color={Theme.colors.mutedForeground} />
          <Text style={styles.actionText}>Налаштування</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
          <LogOut size={20} color={Theme.colors.destructive} />
          <Text
            style={[styles.actionText, { color: Theme.colors.destructive }]}>
            Вийти з акаунту
          </Text>
        </TouchableOpacity>
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
    paddingTop: Theme.spacing.xl,
    paddingBottom: 120, // Відступ для нижньої навігації
  },

  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Theme.spacing.m,
  },
  avatarBox: {
    width: 88,
    height: 88,
    backgroundColor: Theme.colors.card,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  avatarImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  zapBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    backgroundColor: Theme.colors.primary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Theme.colors.background,
  },
  userName: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 22,
    color: Theme.colors.foreground,
    marginBottom: 4,
  },
  userEmail: {
    ...Theme.typography.body,
    fontSize: 14,
    color: Theme.colors.mutedForeground,
  },

  // Cards
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.m,
  },
  cardTitle: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 16,
    color: Theme.colors.foreground,
    marginBottom: Theme.spacing.l,
  },

  // Data List
  dataList: {
    flexDirection: "column",
  },
  dataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.l,
    paddingBottom: Theme.spacing.l,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(21, 191, 99, 0.1)", // Прозорий зелений
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.m,
    borderWidth: 1,
    borderColor: "rgba(21, 191, 99, 0.2)",
  },
  dataLabel: {
    ...Theme.typography.body,
    color: Theme.colors.mutedForeground,
    flex: 1,
  },
  dataValue: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 15,
    color: Theme.colors.foreground,
  },

  // Norm
  normContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Theme.spacing.m,
  },
  normValue: {
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 42,
    color: Theme.colors.primary,
    marginRight: 8,
  },
  normUnit: {
    ...Theme.typography.body,
    fontSize: 16,
    color: Theme.colors.primary,
    opacity: 0.8,
  },
  normFormula: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: "uppercase",
  },

  // Action Buttons
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.s,
    gap: Theme.spacing.m,
  },
  actionText: {
    ...Theme.typography.body,
    fontSize: 16,
    color: Theme.colors.foreground,
  },
});

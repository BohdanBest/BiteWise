import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
  Modal,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axiosClient from "../../api/axiosClient";
import useAuthStore from "../../store/useAuthStore";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Trash2,
  User,
} from "lucide-react-native";
import { Theme } from "../../constants/theme";
import { useTheme, useStyles } from "../../hooks/useTheme";
import { useThemeStore } from "../../store/useThemeStore";
import { useSettingsStore } from "../../store/useSettingsStore";

// Ігноруємо попередження від зовнішньої бібліотеки
LogBox.ignoreLogs(['DateTimePicker: `onChange` is deprecated']);

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { mode, setMode } = useThemeStore();
  const { notificationsEnabled, toggleNotifications, mealTimes, updateMealTime } = useSettingsStore();
  const { logout } = useAuthStore();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeMeal, setActiveMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await axiosClient.delete('/User/me');
      await logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModalVisible(false);
    }
  };

  const showDatePicker = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    setActiveMeal(meal);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveMeal(null);
  };

  const handleConfirm = (date: Date) => {
    if (activeMeal) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      updateMealTime(activeMeal, `${hours}:${minutes}`);
    }
    hideDatePicker();
  };

  const getPickerDate = () => {
    if (!activeMeal) return new Date();
    const timeString = mealTimes[activeMeal];
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Налаштування</Text>
        </View>
        {/* Item 0 (Edit Profile) */}
        <TouchableOpacity
          style={styles.settingCard}
          activeOpacity={0.7}
          onPress={() => {
            if (Platform.OS === 'web' && typeof document !== 'undefined') {
              (document.activeElement as HTMLElement)?.blur();
            }
            navigation.navigate("EditProfile");
          }}>
          <View style={styles.iconBox}>
            <User size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Редагувати профіль</Text>
            <Text style={styles.settingSubtitle}>Ваші персональні дані</Text>
          </View>
        </TouchableOpacity>

        {/* Item 1 */}
        <TouchableOpacity 
          style={styles.settingCard} 
          activeOpacity={0.7}
          onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        >
          <View style={styles.iconBox}>
            <Moon size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Тема: {mode === 'dark' ? 'Темна' : mode === 'light' ? 'Світла' : 'Системна'}</Text>
            <Text style={styles.settingSubtitle}>Натисніть для зміни</Text>
          </View>
        </TouchableOpacity>

        {/* Item 2 */}
        <View style={styles.settingCard}>
          <View style={styles.iconBox}>
            <Bell size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Нагадування</Text>
            <Text style={styles.settingSubtitle}>Прийоми їжі</Text>
          </View>
          <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={theme.colors.border}
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>

        {notificationsEnabled && (
          <View style={styles.subSettingsContainer}>
            <TouchableOpacity style={styles.subSettingCard} onPress={() => showDatePicker('breakfast')} activeOpacity={0.7}>
              <Text style={styles.subSettingTitle}>Сніданок</Text>
              <Text style={styles.subSettingTime}>{mealTimes.breakfast}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subSettingCard} onPress={() => showDatePicker('lunch')} activeOpacity={0.7}>
              <Text style={styles.subSettingTitle}>Обід</Text>
              <Text style={styles.subSettingTime}>{mealTimes.lunch}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.subSettingCard, { borderBottomWidth: 0 }]} onPress={() => showDatePicker('dinner')} activeOpacity={0.7}>
              <Text style={styles.subSettingTitle}>Вечеря</Text>
              <Text style={styles.subSettingTime}>{mealTimes.dinner}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Item 3 */}
        <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
          <View style={styles.iconBox}>
            <Shield size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Конфіденційність</Text>
            <Text style={styles.settingSubtitle}>
              Дані зберігаються локально
            </Text>
          </View>
        </TouchableOpacity>

        {/* Item 4 */}
        <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
          <View style={styles.iconBox}>
            <HelpCircle size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Допомога</Text>
            <Text style={styles.settingSubtitle}>FAQ та підтримка</Text>
          </View>
        </TouchableOpacity>

        {/* Item 5 */}
        <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
          <View style={styles.iconBox}>
            <Info size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Про додаток</Text>
            <Text style={styles.settingSubtitle}>NutriScan v1.0</Text>
          </View>
        </TouchableOpacity>

        {/* Item 6 (Delete) */}
        <TouchableOpacity
          style={[styles.settingCard, { marginTop: theme.spacing.s }]}
          activeOpacity={0.7}
          onPress={() => setDeleteModalVisible(true)}
        >
          <View style={styles.iconBoxRed}>
            <Trash2 size={20} color={theme.colors.destructive} />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.settingTitle,
                { color: theme.colors.destructive },
              ]}>
              Видалити акаунт
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        date={getPickerDate()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        confirmTextIOS="Зберегти"
        cancelTextIOS="Скасувати"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        themeVariant={mode === 'dark' ? 'dark' : 'light'}
        isDarkModeEnabled={mode === 'dark'}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Видалити акаунт?</Text>
            <Text style={styles.modalText}>
              Усі ваші дані (профіль, записи щоденника) будуть назавжди видалені без можливості відновлення.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]} 
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text style={styles.modalCancelText}>Скасувати</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalDeleteButton]} 
                onPress={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalDeleteText}>Видалити</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.m,
  },
  headerTitle: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 28,
    color: theme.colors.foreground,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.pageHorizontal,
    paddingBottom: 40,
    gap: theme.spacing.m,
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(21, 191, 99, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.m,
    borderWidth: 1,
    borderColor: "rgba(21, 191, 99, 0.2)",
  },
  iconBoxRed: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)", // Destructive color with opacity
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.m,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  settingTitle: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...theme.typography.caption,
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  subSettingsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  subSettingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  subSettingTitle: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.foreground,
  },
  subSettingTime: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: 20,
    color: theme.colors.foreground,
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 15,
    color: theme.colors.mutedForeground,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalCancelText: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 16,
    color: theme.colors.foreground,
    fontWeight: "500",
  },
  modalDeleteButton: {
    backgroundColor: theme.colors.destructive,
  },
  modalDeleteText: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

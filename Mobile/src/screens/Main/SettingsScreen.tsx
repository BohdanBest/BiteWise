import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  ArrowLeft, 
  Moon, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info, 
  Trash2 
} from 'lucide-react-native';
import { Theme } from '../../constants/theme';

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Theme.colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Налаштування</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Item 1 */}
        <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
          <View style={styles.iconBox}>
            <Moon size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Темна тема</Text>
            <Text style={styles.settingSubtitle}>Завжди увімкнена</Text>
          </View>
        </TouchableOpacity>

        {/* Item 2 */}
        <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
          <View style={styles.iconBox}>
            <Bell size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Нагадування</Text>
            <Text style={styles.settingSubtitle}>Прийоми їжі</Text>
          </View>
        </TouchableOpacity>

        {/* Item 3 */}
        <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
          <View style={styles.iconBox}>
            <Shield size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Конфіденційність</Text>
            <Text style={styles.settingSubtitle}>Дані зберігаються локально</Text>
          </View>
        </TouchableOpacity>

        {/* Item 4 */}
        <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
          <View style={styles.iconBox}>
            <HelpCircle size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Допомога</Text>
            <Text style={styles.settingSubtitle}>FAQ та підтримка</Text>
          </View>
        </TouchableOpacity>

        {/* Item 5 */}
        <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
          <View style={styles.iconBox}>
            <Info size={20} color={Theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>Про додаток</Text>
            <Text style={styles.settingSubtitle}>NutriScan v1.0</Text>
          </View>
        </TouchableOpacity>

        {/* Item 6 (Delete) */}
        <TouchableOpacity style={[styles.settingCard, { marginTop: Theme.spacing.s }]} activeOpacity={0.7}>
          <View style={styles.iconBoxRed}>
            <Trash2 size={20} color={Theme.colors.destructive} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.settingTitle, { color: Theme.colors.destructive }]}>Видалити акаунт</Text>
          </View>
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
  header: {
    paddingHorizontal: Theme.spacing.pageHorizontal,
    paddingTop: Theme.spacing.m,
    paddingBottom: Theme.spacing.l,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
  },
  headerTitle: {
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 28,
    color: Theme.colors.foreground,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.pageHorizontal,
    paddingBottom: 40,
    gap: Theme.spacing.m,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(21, 191, 99, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(21, 191, 99, 0.2)',
  },
  iconBoxRed: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Destructive color with opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  settingTitle: {
    ...Theme.typography.body,
    fontSize: 16,
    color: Theme.colors.foreground,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Theme.typography.caption,
    fontSize: 13,
    color: Theme.colors.mutedForeground,
  },
});

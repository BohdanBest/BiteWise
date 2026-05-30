import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Utensils, Flame, Target, Camera, Award, Lock, ArrowLeft } from 'lucide-react-native';
import axiosClient from '../../api/axiosClient';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from '../../hooks/useTheme';

interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  isEarned: boolean;
  earnedAt: string | null;
}

export default function AchievementsScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const navigation = useNavigation();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axiosClient.get('/Achievement/my');
        setAchievements(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getIcon = (name: string, isEarned: boolean) => {
    const color = isEarned ? theme.colors.primaryForeground : theme.colors.mutedForeground;
    const size = 32;

    switch (name) {
      case 'Utensils': return <Utensils color={color} size={size} />;
      case 'Flame': return <Flame color={color} size={size} />;
      case 'Target': return <Target color={color} size={size} />;
      case 'Camera': return <Camera color={color} size={size} />;
      default: return <Award color={color} size={size} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft color={theme.colors.foreground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мої досягнення</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {achievements.map((item) => (
            <View key={item.id} style={[styles.card, !item.isEarned && styles.cardLocked]}>
              <View style={[styles.iconContainer, item.isEarned ? styles.iconEarned : styles.iconLocked]}>
                {getIcon(item.iconName, item.isEarned)}
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.title, !item.isEarned && styles.textMuted]}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                {item.isEarned && item.earnedAt && (
                  <Text style={styles.dateText}>
                    Отримано: {new Date(item.earnedAt).toLocaleDateString('uk-UA')}
                  </Text>
                )}
              </View>
              {!item.isEarned && (
                <View style={styles.lockBadge}>
                  <Lock size={16} color={theme.colors.mutedForeground} />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof Theme.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: theme.colors.foreground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  cardLocked: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderStyle: 'dashed',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconEarned: {
    backgroundColor: theme.colors.primary,
  },
  iconLocked: {
    backgroundColor: theme.colors.muted,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  textMuted: {
    color: theme.colors.mutedForeground,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.mutedForeground,
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.primary,
    marginTop: 8,
  },
  lockBadge: {
    marginLeft: 10,
  },
});

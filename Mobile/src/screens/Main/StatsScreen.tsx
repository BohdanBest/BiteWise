import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, DimensionValue, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import { useStatsStore } from '../../store/useStatsStore';
import { useIsFocused } from '@react-navigation/native';

export default function StatsScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const { stats, isLoading, fetchWeeklyStats } = useStatsStore();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchWeeklyStats();
    }
  }, [isFocused]);

  if (isLoading || !stats) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const GOAL_VALUE = stats.dailyCalorieGoal || 2000;
  // Calculate max chart value dynamically: slightly above max calorie day, or the goal, whichever is higher
  const maxCalorieValue = Math.max(stats.maxCalories.value, GOAL_VALUE);
  // Add 15% padding to the top of the chart so bars don't touch the very top
  const MAX_CHART_VALUE = maxCalorieValue > 0 ? Math.ceil(maxCalorieValue * 1.15 / 100) * 100 : 2500;

  // Generate 5 Y-axis labels
  const yLabels = [
    MAX_CHART_VALUE,
    Math.round(MAX_CHART_VALUE * 0.75),
    Math.round(MAX_CHART_VALUE * 0.5),
    Math.round(MAX_CHART_VALUE * 0.25),
    0
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Статистика</Text>
          <Text style={styles.headerSubtitle}>ОСТАННІЙ ТИЖДЕНЬ</Text>
        </View>

        {/* Main Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Калорії по днях</Text>
          
          <View style={styles.chartContainer}>
            {/* Y-Axis Labels */}
            <View style={styles.yAxis}>
              {yLabels.map((label, i) => (
                <Text key={i} style={styles.axisLabel}>{label}</Text>
              ))}
            </View>

            {/* Chart Area */}
            <View style={styles.barsArea}>
              <View style={styles.chartGrid}>
                {/* Horizontal grid lines */}
                {[0, 25, 50, 75, 100].map((percent, index) => (
                  <View 
                    key={`grid-${index}`} 
                    style={[styles.gridLine, { bottom: `${percent}%` as DimensionValue }]} 
                  />
                ))}

                {/* Goal Line */}
                <View style={[styles.goalLine, { bottom: `${(GOAL_VALUE / MAX_CHART_VALUE) * 100}%` as DimensionValue }]} />
                
                {/* Bars */}
                <View style={styles.barsContainer}>
                  {stats.dailyCalories.map((item, index) => {
                    // Cap at 100% so bars don't break out of the container
                    const rawPercent = (item.calories / MAX_CHART_VALUE) * 100;
                    const heightPercent = `${Math.min(rawPercent, 100)}%` as DimensionValue;
                    
                    return (
                      <View key={index} style={styles.barColumn}>
                        {item.calories > 0 && (
                          <LinearGradient
                            colors={[theme.colors.primary, 'rgba(21, 191, 99, 0.05)']}
                            style={[styles.bar, { height: heightPercent }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                          />
                        )}
                        <Text style={styles.barLabel}>{item.dayOfWeek}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={styles.legendColorBox} />
              <Text style={styles.legendText}>КАЛОРІЇ</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={{ color: theme.colors.primary, fontWeight: 'bold', letterSpacing: 2, fontSize: 14 }}>---</Text>
              <Text style={styles.legendText}>ЦІЛЬ</Text>
            </View>
          </View>
        </View>

        {/* Small Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.smallStatCard}>
            <Text style={[styles.smallStatValue, { color: theme.colors.primary }]}>{stats.averageCalories}</Text>
            <Text style={styles.smallStatLabel}>СЕРЕДНЄ</Text>
          </View>
          <View style={styles.smallStatCard}>
            <Text style={styles.smallStatValue}>{stats.maxCalories.value}</Text>
            <Text style={styles.smallStatLabel}>МАКС ({stats.maxCalories.dayOfWeek})</Text>
          </View>
          <View style={styles.smallStatCard}>
            <Text style={styles.smallStatValue}>{stats.minCalories.value}</Text>
            <Text style={styles.smallStatLabel}>МІН ({stats.minCalories.dayOfWeek})</Text>
          </View>
        </View>

        {/* Top 5 Meals */}
        <View style={styles.topMealsCard}>
          <Text style={styles.cardTitle}>Топ-5 страв</Text>
          
          <View style={styles.topMealsList}>
            {stats.topFoods.length === 0 ? (
              <Text style={styles.emptyText}>Ще немає даних</Text>
            ) : (
              stats.topFoods.map((meal, index) => (
                <View key={index} style={styles.topMealItem}>
                  <View style={styles.topMealLeft}>
                    <View style={styles.topMealRank}>
                      <Text style={styles.topMealRankText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.topMealName}>{meal.foodName}</Text>
                  </View>
                  <Text style={styles.topMealCount}>{meal.count}×</Text>
                </View>
              ))
            )}
          </View>
        </View>

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
    paddingBottom: 120, // Відступ для нижньої навігації
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: 28,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  
  // Chart Card
  chartCard: {
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
  chartContainer: {
    flexDirection: 'row',
    height: 180,
    marginBottom: theme.spacing.l,
    marginTop: theme.spacing.s,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: theme.spacing.m,
    paddingBottom: 20, // To match the height of x-axis labels
    alignItems: 'flex-end',
    width: 40,
  },
  axisLabel: {
    ...theme.typography.caption,
    fontSize: 11,
    color: theme.colors.mutedForeground,
    fontFamily: theme.typography.tabularNums.fontFamily,
  },
  barsArea: {
    flex: 1,
  },
  chartGrid: {
    flex: 1,
    position: 'relative',
    marginBottom: 20, // Space for x-axis labels
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    opacity: 0.3,
    zIndex: 1,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    opacity: 0.8,
    zIndex: 2,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barColumn: {
    alignItems: 'center',
    width: 32, // Width of each bar area
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 3,
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    ...theme.typography.caption,
    fontSize: 11,
    position: 'absolute',
    bottom: -20,
    color: theme.colors.mutedForeground,
  },
  
  // Legend
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.s,
    gap: theme.spacing.l,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColorBox: {
    width: 14,
    height: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  legendDashedLine: {
    width: 16,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    opacity: 0.8,
  },
  legendText: {
    ...theme.typography.caption,
    fontSize: 10,
    textTransform: 'uppercase',
  },

  // Small Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  smallStatCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallStatValue: {
    fontFamily: theme.typography.h2.fontFamily,
    fontSize: 20,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  smallStatLabel: {
    ...theme.typography.caption,
    fontSize: 10,
    textTransform: 'uppercase',
  },

  // Top Meals Card
  topMealsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  topMealsList: {
    gap: theme.spacing.m,
  },
  topMealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topMealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
  },
  topMealRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMealRankText: {
    fontFamily: theme.typography.h3.fontFamily,
    fontSize: 12,
    color: theme.colors.primaryForeground,
  },
  topMealName: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.foreground,
  },
  topMealCount: {
    fontFamily: theme.typography.tabularNums.fontFamily,
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
    fontStyle: 'italic',
  }
});

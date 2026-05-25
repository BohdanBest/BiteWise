import React from 'react';
import { View, Text, StyleSheet, ScrollView, DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../constants/theme';

const CHART_DATA = [
  { day: 'Пн', value: 2100 },
  { day: 'Вт', value: 2400 },
  { day: 'Ср', value: 1800 },
  { day: 'Чт', value: 2500 },
  { day: 'Пт', value: 2200 },
  { day: 'Сб', value: 2600 },
  { day: 'Нд', value: 1950 },
];

const TOP_MEALS = [
  { name: 'Курка гриль', count: 12 },
  { name: 'Вівсянка', count: 10 },
  { name: 'Сирники', count: 8 },
  { name: 'Грецький салат', count: 7 },
  { name: 'Омлет', count: 5 },
];

const MAX_CHART_VALUE = 2600;
const GOAL_VALUE = 2400;

export default function StatsScreen() {
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
              <Text style={styles.axisLabel}>2600</Text>
              <Text style={styles.axisLabel}>1950</Text>
              <Text style={styles.axisLabel}>1300</Text>
              <Text style={styles.axisLabel}>650</Text>
              <Text style={styles.axisLabel}>0</Text>
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
                  {CHART_DATA.map((item, index) => {
                    const heightPercent = `${(item.value / MAX_CHART_VALUE) * 100}%` as DimensionValue;
                    return (
                      <View key={index} style={styles.barColumn}>
                        <LinearGradient
                          colors={[Theme.colors.primary, 'rgba(21, 191, 99, 0.05)']} // Плавний градієнт до прозорого
                          style={[styles.bar, { height: heightPercent }]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                        />
                        <Text style={styles.barLabel}>{item.day}</Text>
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
              <View style={styles.legendDashedLine} />
              <Text style={styles.legendText}>ЦІЛЬ</Text>
            </View>
          </View>
        </View>

        {/* Small Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.smallStatCard}>
            <Text style={[styles.smallStatValue, { color: Theme.colors.primary }]}>2236</Text>
            <Text style={styles.smallStatLabel}>СЕРЕДНЄ</Text>
          </View>
          <View style={styles.smallStatCard}>
            <Text style={styles.smallStatValue}>2600</Text>
            <Text style={styles.smallStatLabel}>МАКС (СБ)</Text>
          </View>
          <View style={styles.smallStatCard}>
            <Text style={styles.smallStatValue}>1900</Text>
            <Text style={styles.smallStatLabel}>МІН (СР)</Text>
          </View>
        </View>

        {/* Top 5 Meals */}
        <View style={styles.topMealsCard}>
          <Text style={styles.cardTitle}>Топ-5 страв</Text>
          
          <View style={styles.topMealsList}>
            {TOP_MEALS.map((meal, index) => (
              <View key={index} style={styles.topMealItem}>
                <View style={styles.topMealLeft}>
                  <View style={styles.topMealRank}>
                    <Text style={styles.topMealRankText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.topMealName}>{meal.name}</Text>
                </View>
                <Text style={styles.topMealCount}>{meal.count}×</Text>
              </View>
            ))}
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
    paddingBottom: 120, // Відступ для нижньої навігації
  },
  header: {
    marginBottom: Theme.spacing.xl,
  },
  headerTitle: {
    fontFamily: Theme.typography.h1.fontFamily,
    fontSize: 28,
    color: Theme.colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Theme.typography.caption,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  
  // Chart Card
  chartCard: {
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
  chartContainer: {
    flexDirection: 'row',
    height: 180,
    marginBottom: Theme.spacing.l,
    marginTop: Theme.spacing.s,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: Theme.spacing.m,
    paddingBottom: 20, // To match the height of x-axis labels
    alignItems: 'flex-end',
    width: 40,
  },
  axisLabel: {
    ...Theme.typography.caption,
    fontSize: 11,
    color: Theme.colors.mutedForeground,
    fontFamily: Theme.typography.tabularNums.fontFamily,
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
    borderColor: Theme.colors.border,
    borderStyle: 'dashed',
    opacity: 0.3,
    zIndex: 1,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: Theme.colors.primary,
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
    ...Theme.typography.caption,
    fontSize: 11,
    position: 'absolute',
    bottom: -20,
    color: Theme.colors.mutedForeground,
  },
  
  // Legend
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.s,
    gap: Theme.spacing.l,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  legendDashedLine: {
    width: 16,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Theme.colors.primary,
    opacity: 0.8,
  },
  legendText: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: 'uppercase',
  },

  // Small Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
  },
  smallStatCard: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.m,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallStatValue: {
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: 20,
    color: Theme.colors.foreground,
    marginBottom: 4,
  },
  smallStatLabel: {
    ...Theme.typography.caption,
    fontSize: 10,
    textTransform: 'uppercase',
  },

  // Top Meals Card
  topMealsCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  topMealsList: {
    gap: Theme.spacing.m,
  },
  topMealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topMealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.m,
  },
  topMealRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMealRankText: {
    fontFamily: Theme.typography.h3.fontFamily,
    fontSize: 12,
    color: Theme.colors.primaryForeground,
  },
  topMealName: {
    ...Theme.typography.body,
    fontSize: 15,
    color: Theme.colors.foreground,
  },
  topMealCount: {
    fontFamily: Theme.typography.tabularNums.fontFamily,
    fontSize: 13,
    color: Theme.colors.mutedForeground,
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Екран Статистики</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Theme.colors.foreground,
    fontFamily: Theme.typography.h2.fontFamily,
    fontSize: Theme.typography.h2.fontSize,
  },
});

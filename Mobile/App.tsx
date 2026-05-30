import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  '"shadow*" style props are deprecated',
  'props.pointerEvents is deprecated'
]);
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { Theme } from './src/constants/theme';
import { useThemeStore } from './src/store/useThemeStore';

export default function App() {
  const isDark = useThemeStore((state) => state.isDark());
  const theme = useThemeStore((state) => state.getColors());

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: theme.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

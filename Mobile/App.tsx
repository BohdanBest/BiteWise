import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

// Шрифти
import { useFonts } from 'expo-font';
import { 
  Inter_400Regular, 
  Inter_600SemiBold 
} from '@expo-google-fonts/inter';
import { 
  SpaceGrotesk_400Regular, 
  SpaceGrotesk_600SemiBold, 
  SpaceGrotesk_700Bold 
} from '@expo-google-fonts/space-grotesk';
import { View, ActivityIndicator } from 'react-native';
import { Theme } from './src/constants/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: Theme.colors.background }}>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

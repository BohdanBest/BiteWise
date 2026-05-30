import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OnboardingGenderScreen from '../screens/Onboarding/OnboardingGenderScreen';
import OnboardingMetricsScreen from '../screens/Onboarding/OnboardingMetricsScreen';
import OnboardingGoalScreen from '../screens/Onboarding/OnboardingGoalScreen';
import OnboardingResultScreen from '../screens/Onboarding/OnboardingResultScreen';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/Main/SettingsScreen';
import EditProfileScreen from '../screens/Main/EditProfileScreen';
import SplashScreen from '../screens/Splash/SplashScreen';
import useAuthStore from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { profile } = useUserStore();
  const themeColors = useThemeStore((state) => state.getColors());
  const { token, isLoading, checkAuth } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Навігація рендериться під низом, щоб бути готовою після зникнення сплешу */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ 
          headerShown: false, 
          animation: 'fade',
          contentStyle: { backgroundColor: themeColors.background }
        }}>
          {token == null ? (
            // Екрани для НЕ авторизованого користувача
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="OnboardingGender" component={OnboardingGenderScreen} />
              <Stack.Screen name="OnboardingMetrics" component={OnboardingMetricsScreen} />
              <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
              <Stack.Screen name="OnboardingResult" component={OnboardingResultScreen} />
            </>
          ) : (
            // Екрани для авторизованого користувача
            <>
              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      {/* SplashScreen перекриває навігацію, поки не зникне */}
      {showSplash && (
        <SplashScreen 
          isReady={!isLoading} 
          onFinish={() => setShowSplash(false)} 
        />
      )}
    </View>
  );
}

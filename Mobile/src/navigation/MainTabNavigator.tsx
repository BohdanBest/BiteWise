import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Book, Camera, BarChart2, User } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { Theme } from "../constants/theme";

import HomeScreen from "../screens/Main/HomeScreen";
import DiaryScreen from "../screens/Diary/DiaryScreen";
import ScanScreen from "../screens/Main/ScanScreen";
import StatsScreen from "../screens/Main/StatsScreen";
import ProfileScreen from "../screens/Main/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabIcon = ({
  focused,
  IconComponent,
}: {
  focused: boolean;
  IconComponent: any;
}) => (
  <View style={styles.iconContainer}>
    {focused && <View style={styles.activeIndicator} />}
    <IconComponent
      size={24}
      color={focused ? Theme.colors.primary : Theme.colors.mutedForeground}
    />
  </View>
);

const CustomScanButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.scanButtonWrapper}
    onPress={onPress}
    activeOpacity={0.9}>
    <View style={styles.scanButton}>
      <Camera size={28} color={Theme.colors.primaryForeground} />
    </View>
    <Text style={styles.scanButtonLabel}>СКАН</Text>
  </TouchableOpacity>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={styles.blurContainer}>
            <BlurView
              tint="dark"
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(21, 30, 26, 0.65)" },
              ]}
            />
          </View>
        ),
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.mutedForeground,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: {
          backgroundColor: "transparent",
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "ГОЛОВНА",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Home} />
          ),
        }}
      />
      <Tab.Screen
        name="DiaryTab"
        component={DiaryScreen}
        options={{
          tabBarLabel: "ЩОДЕННИК",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Book} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <CustomScanButton {...props} />,
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          tabBarLabel: "СТАТИСТИКА",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={BarChart2} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "ПРОФІЛЬ",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={User} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    height: 72,
    backgroundColor: "transparent",
    elevation: 0,
    borderTopWidth: 0,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  tabBarLabel: {
    fontFamily: Theme.typography.caption.fontFamily,
    fontSize: 10,
    marginTop: 0,
    textTransform: "uppercase",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: "100%",
  },
  activeIndicator: {
    position: "absolute",
    top: -12, // Рівно по верхньому краю панелі
    width: 32,
    height: 3,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
    ...Theme.shadows.glowPrimary,
  },
  scanButtonWrapper: {
    top: -20, // Трохи опустили, щоб текст не прилипав до низу
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scanButton: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    ...Theme.shadows.glowPrimary,
  },
  scanButtonLabel: {
    fontFamily: Theme.typography.caption.fontFamily,
    fontSize: 10,
    color: Theme.colors.primary,
    textTransform: "uppercase",
  },
});

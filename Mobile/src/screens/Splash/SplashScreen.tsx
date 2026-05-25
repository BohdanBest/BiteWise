import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Theme } from '../../constants/theme';
import mascot from "../../../assets/mascot-wave.png";
const { width } = Dimensions.get('window');

interface SplashProps {
  isReady?: boolean;
  onFinish?: () => void;
}

export default function SplashScreen({ isReady, onFinish }: SplashProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current; // Для зникнення всього екрану

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 5,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Відстежуємо проп isReady: якщо true, плавно ховаємо весь екран
  useEffect(() => {
    if (isReady) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500, // Плавне зникнення за 0.5с
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }
  }, [isReady]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>

      <View style={styles.content}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], zIndex: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
          
          <View style={{ position: 'absolute', width: 400, height: 400, alignItems: 'center', justifyContent: 'center' }}>
            <Svg height="400" width="400">
              <Defs>
                <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                  <Stop offset="0%" stopColor={Theme.colors.primary} stopOpacity="0.3" />
                  <Stop offset="30%" stopColor={Theme.colors.primary} stopOpacity="0.1" />
                  <Stop offset="70%" stopColor={Theme.colors.primary} stopOpacity="0.02" />
                  <Stop offset="100%" stopColor={Theme.colors.primary} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="400" height="400" fill="url(#glow)" />
            </Svg>
          </View>

          <Image 
            source={mascot} 
            style={styles.mascot}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: Theme.colors.primary }]}>Nutri</Text>
            <Text style={[styles.logoText, { color: Theme.colors.foreground }]}>Scan</Text>
          </View>
          <Text style={styles.subtitle}>SMART NUTRITION TRACKING</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Перекриває весь екран
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 9999, // Завжди зверху
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    flexDirection: 'row',
  },
  logoText: {
    ...Theme.typography.displayXl,
  },
  subtitle: {
    ...Theme.typography.overline,
    color: Theme.colors.mutedForeground,
    marginTop: 10,
    letterSpacing: 4,
  },
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 9999,
  },
  circleLarge: {
    width: width * 1.5,
    height: width * 1.5,
    top: '40%',
    left: '10%',
  },
  circleSmall: {
    width: width * 1.1,
    height: width * 1.1,
    top: '50%',
    left: '20%',
  }
});

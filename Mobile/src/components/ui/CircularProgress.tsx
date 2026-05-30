import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  currentValue: number;
  maxValue: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export default function CircularProgress({ 
  size, 
  strokeWidth, 
  currentValue, 
  maxValue, 
  color, 
  backgroundColor,
  children
}: CircularProgressProps) {
  const theme = useTheme();
  
  const finalColor = color || theme.colors.primary;
  const finalBgColor = backgroundColor || theme.colors.border;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Обмеження значення
  const safeValue = Math.min(Math.max(currentValue, 0), maxValue);
  const percent = maxValue > 0 ? safeValue / maxValue : 0;
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          stroke={finalBgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={finalColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
        {children}
      </View>
    </View>
  );
}

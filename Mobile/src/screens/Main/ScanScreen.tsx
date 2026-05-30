import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";
import { useDiaryStore } from '../../store/useDiaryStore';
import useAuthStore from '../../store/useAuthStore';

import CaptureStep from '../../components/Scan/CaptureStep';
import LoadingStep from '../../components/Scan/LoadingStep';
import ResultStep from '../../components/Scan/ResultStep';
import ErrorStep from '../../components/Scan/ErrorStep';

type Step = 'capture' | 'loading' | 'result' | 'error';

export interface ScanResultDto {
  foodName: string;
  weightGrams: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  confidence: number;
  warning?: string;
  alternatives: any[];
}

export const mealTypeLabels: Record<string, string> = {
  breakfast: 'Сніданок',
  lunch: 'Обід',
  dinner: 'Вечеря',
  snack: 'Перекус',
};

export default function ScanScreen() {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const navigation = useNavigation<any>();
  const addFoodItem = useDiaryStore(state => state.addFoodItem);
  const token = useAuthStore(state => state.token);

  const [step, setStep] = useState<Step>('capture');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [weight, setWeight] = useState('200');
  const [mealType, setMealType] = useState('lunch');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  
  // Animations
  const spinValue = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (step === 'loading') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
    
    if (step === 'result') {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(500);
    }
  }, [step, spinValue, slideAnim]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleScan = async (uri: string) => {
    setStep('loading');

    // Використовуємо локальний IP Mac'а (192.168.31.149), щоб це працювало на реальному iPhone через Wi-Fi
    const apiUrl = 'http://192.168.31.149:5138/api/Scan';

    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      if (Platform.OS === 'web') {
        const res = await fetch(uri);
        const blob = await res.blob();
        formData.append('image', blob, 'photo.jpg');
      } else {
        formData.append('image', {
          uri,
          name: filename,
          type,
        } as any);
      }

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      const data: ScanResultDto = response.data;
      
      // Якщо фото не розпізнано або впевненість низька
      if (data.foodName === 'Не розпізнано' || data.foodName === 'unknown/not_food') {
        setStep('error');
        return;
      }

      // Форматуємо результат для ResultStep
      const formattedResults = [
        {
          food: {
            id: 'main',
            nameUa: data.foodName,
            calories: data.calories,
            protein: data.proteins,
            fat: data.fats,
            carbs: data.carbs
          },
          confidence: Math.round(data.confidence * 100),
          warning: data.warning
        }
      ];

      // Додаємо альтернативи
      if (data.alternatives && data.alternatives.length > 0) {
        data.alternatives.forEach((alt, index) => {
          formattedResults.push({
            food: {
              id: `alt-${index}`,
              nameUa: alt.foodName,
              calories: alt.calories,
              protein: alt.proteins,
              fat: alt.fats,
              carbs: alt.carbs
            },
            confidence: Math.round(data.confidence * 100) - (index + 1) * 5, // Трохи менша впевненість для альтернатив
            warning: undefined
          });
        });
      }

      setScanResults(formattedResults);
      setWeight(data.weightGrams?.toString() || '200');
      setStep('result');
    } catch (error) {
      console.error(error);
      Alert.alert('Помилка', 'Не вдалося розпізнати фото. Перевірте підключення до сервера.');
      setStep('capture');
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    setStep('loading');
    
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      
      if (response.data.status === 1 && response.data.product) {
        const product = response.data.product;
        const nutriments = product.nutriments || {};
        
        let kcal = nutriments['energy-kcal_100g'];
        let warningText;
        
        if (kcal === undefined || kcal === null) {
          if (nutriments['energy_100g']) {
            // Перевід кДж у ккал
            kcal = nutriments['energy_100g'] / 4.184;
          } else {
            kcal = 0;
            warningText = "У базі відсутня інформація про калорії. Встановлено 0 ккал.";
          }
        }
        
        const newResult = {
          food: {
            id: 'barcode-main',
            nameUa: product.product_name || 'Невідомий продукт',
            calories: Math.round(kcal),
            protein: Math.round(nutriments['proteins_100g'] || 0),
            fat: Math.round(nutriments['fat_100g'] || 0),
            carbs: Math.round(nutriments['carbohydrates_100g'] || 0),
          },
          confidence: 100,
          warning: warningText
        };
        
        setScanResults([newResult]);
        setWeight(product.product_quantity ? product.product_quantity.toString() : '100');
        setSelectedIndex(0);
        setStep('result');
      } else {
        Alert.alert('Помилка', 'Продукт не знайдено в базі даних штрихкодів.');
        setStep('capture');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Помилка', 'Не вдалося отримати дані за штрихкодом.');
      setStep('capture');
    }
  };

  const handleSubmit = () => {
    const selected = scanResults[selectedIndex];
    const factor = (Number(weight) || 0) / 100;
    
    addFoodItem({
      name: selected.food.nameUa,
      weight: Number(weight) || 0,
      calories: Math.round(selected.food.calories * factor),
      proteins: Number((selected.food.protein * factor).toFixed(1)),
      fats: Number((selected.food.fat * factor).toFixed(1)),
      carbs: Number((selected.food.carbs * factor).toFixed(1)),
      mealType: mealType as any,
    });

    setStep('capture');
    setWeight('200');
    setSelectedIndex(0);
    setIsDropdownOpen(false);
    navigation.navigate('DiaryTab');
  };

  const handleCancel = () => {
    // Reset and do NOT navigate
    setStep('capture');
    setWeight('200');
    setSelectedIndex(0);
    setIsDropdownOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {step === 'capture' && (
        <CaptureStep onScan={handleScan} onBarcodeScan={handleBarcodeScan} />
      )}
      
      {step === 'loading' && (
        <LoadingStep spin={spin} />
      )}
      
      {step === 'result' && scanResults.length > 0 && (
        <ResultStep 
          mockResults={scanResults}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          weight={weight}
          setWeight={setWeight}
          mealType={mealType}
          setMealType={setMealType}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          mealTypeLabels={mealTypeLabels}
          slideAnim={slideAnim}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {step === 'error' && (
        <ErrorStep 
          onRetry={() => setStep('capture')}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

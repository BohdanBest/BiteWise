import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image as RNImage, Alert } from 'react-native';
import { Camera, Image as ImageIcon, Barcode, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Theme } from '../../constants/theme';
import { useTheme, useStyles } from "../../hooks/useTheme";

interface CaptureStepProps {
  onScan: (uri: string) => void;
  onBarcodeScan?: (barcode: string) => void;
}

export default function CaptureStep({ onScan, onBarcodeScan }: CaptureStepProps) {
  const theme = useTheme();
  const styles = useStyles(createStyles);
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [isBarcodeScanning, setBarcodeScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const hasScannedRef = useRef(false);

  const startBarcodeScanning = () => {
    hasScannedRef.current = false;
    setBarcodeScanning(true);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Помилка', 'Потрібен дозвіл на використання камери!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Одразу переходимо до сканування
      onScan(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Помилка', 'Потрібен дозвіл на доступ до галереї!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Одразу переходимо до сканування
      onScan(result.assets[0].uri);
    }
  };

  if (isBarcodeScanning) {
    if (!permission?.granted) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Доступ до камери</Text>
            <Text style={styles.subtitle}>Нам потрібен доступ до камери для сканування штрихкодів</Text>
          </View>
          <View style={styles.centerContent}>
            <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
              <Camera size={20} color={theme.colors.primaryForeground} />
              <Text style={styles.primaryButtonText}>Надати дозвіл</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryButton, { marginTop: 16, width: '100%' }]} onPress={() => setBarcodeScanning(false)}>
              <Text style={{ color: theme.colors.primary, fontFamily: 'System', fontWeight: '600' }}>Назад</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Штрихкод</Text>
          <Text style={styles.subtitle}>Наведіть камеру на штрихкод</Text>
        </View>

        <View style={styles.barcodeScannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
            }}
            onBarcodeScanned={({ data }) => {
              if (hasScannedRef.current) return;
              hasScannedRef.current = true;
              
              setBarcodeScanning(false);
              if (onBarcodeScan) onBarcodeScan(data);
            }}
          />
          <View style={styles.barcodeOverlay}>
            <View style={styles.scanFrame} />
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }]} 
            activeOpacity={0.8}
            onPress={() => setBarcodeScanning(false)}
          >
            <X size={20} color={theme.colors.foreground} />
            <Text style={[styles.primaryButtonText, { color: theme.colors.foreground }]}>Скасувати</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Сканувати страву</Text>
        <Text style={styles.subtitle}>Сфотографуйте або оберіть фото</Text>
      </View>

      <View style={styles.centerContent}>
        <View style={styles.scannerBox}>
          {imageUri ? (
            <RNImage source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Camera size={64} color={theme.colors.mutedForeground} strokeWidth={1.5} opacity={0.5} />
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            activeOpacity={0.8}
            onPress={takePhoto}
          >
            <Camera size={20} color={theme.colors.primaryForeground} />
            <Text style={styles.primaryButtonText}>Зробити фото</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            activeOpacity={0.8}
            onPress={pickImage}
          >
            <ImageIcon size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            activeOpacity={0.8}
            onPress={startBarcodeScanning}
          >
            <Barcode size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.pageHorizontal,
    justifyContent: 'space-between',
    paddingBottom: 130, // Space for the bottom navigation bar
  },
  header: {
    paddingTop: theme.spacing.xl,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: 28,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'System',
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 100,
  },
  scannerBox: {
    width: 288,
    height: 288,
    borderRadius: 32,
    backgroundColor: 'rgba(21, 191, 99, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
    overflow: 'hidden', // Для картинки всередині
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 320,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    height: 56,
    gap: 8,
    ...theme.shadows.glowPrimary,
  },
  primaryButtonText: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeScannerContainer: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'black',
    marginBottom: 40,
    position: 'relative',
  },
  barcodeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
});

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useAuthStore from '../../store/useAuthStore';

export default function DiaryScreen() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Щоденник Харчування</Text>
      <Button title="Вийти з акаунту" onPress={logout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});

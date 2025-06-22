import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="student/(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

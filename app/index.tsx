import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { colors } from '../src/constants/colors';

export default function Index() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.default }}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (user) {
    if (user.role === 'student') {
      return <Redirect href="/student/(tabs)/dashboard" />;
    } else {
      return <Redirect href="/coach/(tabs)/dashboard" />;
    }
  }

  return <Redirect href="/auth/login" />;
}
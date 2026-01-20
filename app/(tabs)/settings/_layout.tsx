import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationTypeForReplace: 'pop',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="theme" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="language" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="storage" />
      <Stack.Screen name="help" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="about" />
    </Stack>
  );
}

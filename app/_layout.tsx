import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider, useResolvedColorScheme } from '../context/ThemeContext';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutContent() {
  const colorScheme = useResolvedColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" />
        </Stack>
      </AuthProvider>
    </Theme>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={tamaguiConfig}>
          <ThemeProvider>
            <RootLayoutContent />
          </ThemeProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

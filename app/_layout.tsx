import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider, useResolvedColorScheme } from '../context/ThemeContext';
import { ConnectivityProvider, useConnectivity } from '../context/ConnectivityContext';
import { TamaguiProvider, Theme, YStack, Text } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { syncQueue } from '../services/syncQueue';

/**
 * Offline Banner - shown when network is unavailable
 */
function OfflineBanner() {
  const { isOnline } = useConnectivity();

  if (isOnline) return null;

  return (
    <YStack
      bg="$red9"
      px="$4"
      py="$2"
      jc="center"
      ai="center"
      width="100%"
    >
      <Text color="white" size="$3" fontWeight="bold">
        📡 You're offline • Read-only mode
      </Text>
    </YStack>
  );
}

function RootLayoutContent() {
  const colorScheme = useResolvedColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Initialize sync queue on app start
    syncQueue.initialize();
  }, []);

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <YStack flex={1}>
        <OfflineBanner />
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
      </YStack>
    </Theme>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={tamaguiConfig}>
          <ThemeProvider>
            <ConnectivityProvider>
              <RootLayoutContent />
            </ConnectivityProvider>
          </ThemeProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

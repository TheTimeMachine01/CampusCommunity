import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme, useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

export default function ThemeSettings() {
  const { theme, setTheme } = useAppTheme();
  const [selected, setSelected] = useState(theme);
  const tamaguiTheme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#222222' : '#ffffff';
  const borderColor = isDark ? '#333333' : '#E5E7EB';
  const textColor = isDark ? '#ffffff' : '#1f2937';

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, [router]);

  useEffect(() => {
    setSelected(theme);
  }, [theme]);

  const choose = async (t: typeof theme) => {
    setSelected(t);
    await setTheme(t);
  };

  const ThemeOption = ({ label, value }: { label: string; value: typeof theme }) => (
    <TouchableOpacity onPress={() => choose(value)}>
      <XStack
        padding={16}
        borderTopWidth={1}
        borderTopColor={borderColor}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={16} color={textColor}>
          {label}
        </Text>
        <Text fontSize={16} color={selected === value ? '#6366F1' : 'transparent'}>
          ✓
        </Text>
      </XStack>
    </TouchableOpacity>
  );

  return (
    <YStack flex={1} backgroundColor={tamaguiTheme.background}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
        style={{
          height: 140,
          paddingTop: 50,
          paddingHorizontal: 20,
          paddingBottom: 25,
          justifyContent: 'center',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <XStack alignItems="center" justifyContent="space-between" marginBottom={10}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{
              paddingRight: 16,
              paddingVertical: 8,
            }}
          >
            <Text fontSize={32} fontWeight="600" color="white">
              ‹
            </Text>
          </TouchableOpacity>
          <YStack flex={1} alignItems="flex-end">
            <Text fontSize={28} fontWeight="bold" color="white">
              Theme
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            Choose your preferred theme
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={15}>
          <YStack backgroundColor={cardBg} borderRadius={12} padding={16} gap={0}>
            <Text fontSize={18} fontWeight="600" marginBottom={12} color={textColor}>
              Select Theme
            </Text>
            <ThemeOption label="System Default" value="system" />
            <ThemeOption label="Light" value="light" />
            <ThemeOption label="Dark" value="dark" />
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

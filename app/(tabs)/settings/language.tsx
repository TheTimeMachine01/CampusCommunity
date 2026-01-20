import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

type Language = 'en' | 'es' | 'fr' | 'de' | 'hi';

export default function LanguageSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const tamaguiTheme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#222222' : '#ffffff';
  const borderColor = isDark ? '#333333' : '#E5E7EB';
  const textColor = isDark ? '#ffffff' : '#1f2937';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, [router]);

  const languages: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  ];

  const LanguageOption = ({ code, name, native }: { code: Language; name: string; native: string }) => (
    <TouchableOpacity onPress={() => setSelectedLanguage(code)}>
      <XStack
        padding={16}
        borderTopWidth={1}
        borderTopColor={borderColor}
        justifyContent="space-between"
        alignItems="center"
      >
        <YStack gap={4}>
          <Text fontSize={16} fontWeight="500" color={textColor}>
            {name}
          </Text>
          <Text fontSize={14} color={isDark ? '#888888' : '#9ca3af'}>
            {native}
          </Text>
        </YStack>
        <Text fontSize={16} color={selectedLanguage === code ? '#6366F1' : 'transparent'}>
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
              Language
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            Choose your preferred language
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={15}>
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Select Language
              </Text>
            </YStack>
            {languages.map((lang) => (
              <LanguageOption key={lang.code} code={lang.code} name={lang.name} native={lang.native} />
            ))}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

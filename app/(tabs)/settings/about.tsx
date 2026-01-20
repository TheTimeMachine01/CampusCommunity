import React, { useEffect } from 'react';
import { TouchableOpacity, ScrollView, BackHandler, Linking } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

export default function AboutSettings() {
  const tamaguiTheme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#222222' : '#ffffff';
  const borderColor = isDark ? '#333333' : '#E5E7EB';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const secondaryTextColor = isDark ? '#d1d5db' : '#6b7280';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, [router]);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
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
      <Text fontSize={16} fontWeight="500" color={secondaryTextColor}>
        {value}
      </Text>
    </XStack>
  );

  const LinkRow = ({ label, value, url }: { label: string; value: string; url: string }) => (
    <TouchableOpacity onPress={() => Linking.openURL(url)}>
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
        <XStack alignItems="center" gap={8}>
          <Text fontSize={16} fontWeight="500" color="#6366F1">
            {value}
          </Text>
          <Text fontSize={20} color={isDark ? '#888888' : '#d1d5db'}>›</Text>
        </XStack>
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
              About
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            App information and legal
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={20}>
          {/* App Info */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                App Information
              </Text>
            </YStack>
            <InfoRow label="App Name" value="Campus Community" />
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Build Number" value="100" />
            <InfoRow label="Platform" value="React Native Expo" />
          </YStack>

          {/* Legal */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Legal
              </Text>
            </YStack>
            <LinkRow label="Terms of Service" value="View" url="https://campuscommunity.app/terms" />
            <LinkRow label="Privacy Policy" value="View" url="https://campuscommunity.app/privacy" />
            <LinkRow label="Licenses" value="View" url="https://campuscommunity.app/licenses" />
          </YStack>

          {/* Description */}
          <YStack backgroundColor={cardBg} borderRadius={12} padding={20} gap={12}>
            <Text fontSize={18} fontWeight="600" color={textColor} marginBottom={8}>
              About Campus Community
            </Text>
            <Text fontSize={14} color={secondaryTextColor} lineHeight={22}>
              Campus Community is a comprehensive platform designed to connect students, 
              facilitate club management, and keep the campus informed about the latest news and events. 
              Our mission is to create a vibrant digital space where campus life thrives.
            </Text>
            <Text fontSize={14} color={secondaryTextColor} lineHeight={22} marginTop={8}>
              Built with ❤️ for students, by students.
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

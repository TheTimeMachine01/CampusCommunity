import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { YStack, XStack, Text, useTheme, Separator } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useResolvedColorScheme } from '../../../context/ThemeContext';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const colorScheme = useResolvedColorScheme() as 'light' | 'dark'; // Ensure type safety

  // Determine if we're in dark mode based on color scheme
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#222222' : '#ffffff';
  const sectionTitleColor = isDark ? '#999999' : '#6B7280';
  const borderColor = isDark ? '#333333' : '#F3F4F6';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, onPress }: {
    icon: string;
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress}>
      <XStack padding={16} alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderBottomColor={borderColor}>
        <XStack alignItems="center" gap={12}>
          <Text fontSize={20}>{icon}</Text>
          <Text fontSize={16} fontWeight="500" color={isDark ? '#ffffff' : '#1f2937'}>
            {title}
          </Text>
        </XStack>
        <Text fontSize={20} color={isDark ? '#888888' : '#d1d5db'}>›</Text>
      </XStack>
    </TouchableOpacity>
  );

  return (
    <YStack flex={1} backgroundColor={theme.background}>
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
        <Text fontSize={28} fontWeight="bold" color="white" marginBottom={5}>
          Settings
        </Text>
        <Text fontSize={16} color="rgba(255,255,255,0.9)">
          Manage your account
        </Text>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <YStack padding={20} gap={15}>
          <XStack 
            backgroundColor={cardBg} 
            borderRadius={12} 
            padding={20} 
            alignItems="center"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
            elevation={2}
          >
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }}
              style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }}
            />
            <YStack flex={1} gap={4}>
              <Text fontSize={18} fontWeight="600" color={isDark ? '#ffffff' : '#1f2937'}>
                {user?.name || 'User'}
              </Text>
              <Text fontSize={14} color={isDark ? '#d1d5db' : '#6b7280'}>
                {user?.email}
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {/* Account Settings */}
        <YStack paddingHorizontal={20} gap={0} marginTop={20}>
          <Text fontSize={14} fontWeight="700" color={sectionTitleColor} marginBottom={10} textTransform="uppercase" letterSpacing={1}>
            Account
          </Text>
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <SettingItem
              icon="👤"
              title="Edit Profile"
              onPress={() => router.push('/(tabs)/settings/profile')}
            />
            <SettingItem
              icon="🔒"
              title="Privacy & Security"
              onPress={() => router.push('/(tabs)/settings/privacy')}
            />
            <SettingItem
              icon="🔔"
              title="Notifications"
              onPress={() => router.push('/(tabs)/settings/notifications')}
            />
          </YStack>
        </YStack>

        {/* App Settings */}
        <YStack paddingHorizontal={20} gap={0} marginTop={20}>
          <Text fontSize={14} fontWeight="700" color={sectionTitleColor} marginBottom={10} textTransform="uppercase" letterSpacing={1}>
            App
          </Text>
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <SettingItem
              icon="🌙"
              title="Theme"
              onPress={() => router.push('/(tabs)/settings/theme')}
            />
            <SettingItem
              icon="🌍"
              title="Language"
              onPress={() => router.push('/(tabs)/settings/language')}
            />
            <SettingItem
              icon="💾"
              title="Storage"
              onPress={() => router.push('/(tabs)/settings/storage')}
            />
          </YStack>
        </YStack>

        {/* Support */}
        <YStack paddingHorizontal={20} gap={0} marginTop={20}>
          <Text fontSize={14} fontWeight="700" color={sectionTitleColor} marginBottom={10} textTransform="uppercase" letterSpacing={1}>
            Support
          </Text>
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <SettingItem
              icon="❓"
              title="Help & FAQ"
              onPress={() => router.push('/(tabs)/settings/help')}
            />
            <SettingItem
              icon="📧"
              title="Contact Us"
              onPress={() => router.push('/(tabs)/settings/contact')}
            />
            <SettingItem
              icon="ℹ️"
              title="About"
              onPress={() => router.push('/(tabs)/settings/about')}
            />
          </YStack>
        </YStack>

        {/* Logout */}
        <YStack padding={20}>
          <TouchableOpacity onPress={handleLogout}>
            <XStack 
              backgroundColor={isDark ? '#3a1a1a' : '#FEF2F2'} 
              padding={16} 
              borderRadius={12} 
              borderWidth={1} 
              borderColor={isDark ? '#5a3a3a' : '#FECACA'}
              alignItems="center"
              gap={12}
            >
              <Text fontSize={20}>🚪</Text>
              <Text fontSize={16} fontWeight="600" color={isDark ? '#ff6b6b' : '#DC2626'}>
                Logout
              </Text>
            </XStack>
          </TouchableOpacity>
        </YStack>

        <YStack alignItems="center" padding={20} marginBottom={20}>
          <Text fontSize={12} color={isDark ? '#666666' : '#d1d5db'}>
            Campus Community v1.0.0
          </Text>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

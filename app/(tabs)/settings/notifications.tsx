import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, BackHandler, Switch } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

export default function NotificationSettings() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [newsUpdates, setNewsUpdates] = useState(true);
  const [clubUpdates, setClubUpdates] = useState(true);
  const [eventsReminders, setEventsReminders] = useState(true);
  const [achievements, setAchievements] = useState(true);
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

  const NotificationOption = ({ 
    title, 
    description, 
    value, 
    onValueChange 
  }: { 
    title: string; 
    description: string; 
    value: boolean; 
    onValueChange: (value: boolean) => void;
  }) => (
    <XStack
      padding={16}
      borderTopWidth={1}
      borderTopColor={borderColor}
      justifyContent="space-between"
      alignItems="center"
    >
      <YStack flex={1} gap={4}>
        <Text fontSize={16} fontWeight="500" color={textColor}>
          {title}
        </Text>
        <Text fontSize={14} color={secondaryTextColor}>
          {description}
        </Text>
      </YStack>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: isDark ? '#444444' : '#d1d5db', true: '#6366F1' }}
        thumbColor={value ? '#ffffff' : isDark ? '#666666' : '#f4f3f4'}
      />
    </XStack>
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
              Notifications
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            Manage your notification preferences
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={20}>
          {/* General Notifications */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                General
              </Text>
            </YStack>
            <NotificationOption
              title="Push Notifications"
              description="Receive push notifications on your device"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
            <NotificationOption
              title="Email Notifications"
              description="Receive notifications via email"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </YStack>

          {/* Content Notifications */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Content Updates
              </Text>
            </YStack>
            <NotificationOption
              title="News Updates"
              description="Get notified about campus news"
              value={newsUpdates}
              onValueChange={setNewsUpdates}
            />
            <NotificationOption
              title="Club Updates"
              description="Receive updates from your clubs"
              value={clubUpdates}
              onValueChange={setClubUpdates}
            />
            <NotificationOption
              title="Event Reminders"
              description="Get reminders for upcoming events"
              value={eventsReminders}
              onValueChange={setEventsReminders}
            />
            <NotificationOption
              title="Achievements"
              description="Get notified about your achievements"
              value={achievements}
              onValueChange={setAchievements}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

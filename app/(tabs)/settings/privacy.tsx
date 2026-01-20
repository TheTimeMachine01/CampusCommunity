import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, BackHandler, Switch, Alert } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

export default function PrivacySettings() {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [analytics, setAnalytics] = useState(true);
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

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality will be implemented');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account Deletion', 'This feature will be implemented') }
      ]
    );
  };

  const PrivacyOption = ({ 
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

  const ActionButton = ({ title, onPress, destructive = false }: { title: string; onPress: () => void; destructive?: boolean }) => (
    <TouchableOpacity onPress={onPress}>
      <XStack
        padding={16}
        borderTopWidth={1}
        borderTopColor={borderColor}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={16} fontWeight="500" color={destructive ? '#EF4444' : '#6366F1'}>
          {title}
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
              Privacy & Security
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            Control your privacy settings
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={20}>
          {/* Privacy Settings */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Privacy Settings
              </Text>
            </YStack>
            <PrivacyOption
              title="Profile Visibility"
              description="Allow others to view your profile"
              value={profileVisibility}
              onValueChange={setProfileVisibility}
            />
            <PrivacyOption
              title="Data Collection"
              description="Allow app to collect usage data"
              value={dataCollection}
              onValueChange={setDataCollection}
            />
            <PrivacyOption
              title="Analytics"
              description="Help improve the app with analytics"
              value={analytics}
              onValueChange={setAnalytics}
            />
          </YStack>

          {/* Security Settings */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Security
              </Text>
            </YStack>
            <ActionButton title="Change Password" onPress={handleChangePassword} />
            <ActionButton title="Two-Factor Authentication" onPress={() => Alert.alert('2FA', 'Two-factor authentication will be implemented')} />
          </YStack>

          {/* Account Management */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Account Management
              </Text>
            </YStack>
            <ActionButton title="Export My Data" onPress={() => Alert.alert('Export Data', 'Data export will be implemented')} />
            <ActionButton title="Delete Account" onPress={handleDeleteAccount} destructive />
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

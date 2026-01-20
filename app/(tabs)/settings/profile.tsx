import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, BackHandler, TextInput, Image, Alert } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const tamaguiTheme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#222222' : '#ffffff';
  const borderColor = isDark ? '#333333' : '#E5E7EB';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const inputBg = isDark ? '#2a2a2a' : '#f9fafb';
  const inputTextColor = isDark ? '#ffffff' : '#1f2937';
  const placeholderColor = isDark ? '#666666' : '#9ca3af';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, [router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSave = () => {
    // In a real app, this would save to the backend
    Alert.alert('Success', 'Profile updated successfully!');
    router.push('/(tabs)/settings');
  };

  const handleChangeAvatar = () => {
    Alert.alert('Change Avatar', 'Avatar change functionality will be implemented with image picker');
  };

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
              Edit Profile
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            Update your personal information
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={20}>
          {/* Avatar Section */}
          <YStack alignItems="center" gap={15}>
            <Image
              source={{ uri: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <TouchableOpacity onPress={handleChangeAvatar}>
              <Text fontSize={16} color="#6366F1" fontWeight="600">
                Change Avatar
              </Text>
            </TouchableOpacity>
          </YStack>

          {/* Form Section */}
          <YStack backgroundColor={cardBg} borderRadius={12} padding={20} gap={20}>
            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600" color={textColor} marginBottom={4}>
                Full Name
              </Text>
              <TextInput
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 12,
                  padding: 15,
                  fontSize: 16,
                  color: inputTextColor,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
                placeholder="Enter your name"
                placeholderTextColor={placeholderColor}
                value={name}
                onChangeText={setName}
              />
            </YStack>

            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600" color={textColor} marginBottom={4}>
                Email Address
              </Text>
              <TextInput
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 12,
                  padding: 15,
                  fontSize: 16,
                  color: inputTextColor,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
                placeholder="Enter your email"
                placeholderTextColor={placeholderColor}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </YStack>

            <Button
              onPress={handleSave}
              backgroundColor="#6366F1"
              color="white"
              borderRadius={12}
              paddingVertical={15}
            >
              Save Changes
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

import React, { useEffect } from 'react';
import { TouchableOpacity, ScrollView, BackHandler, Alert } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

export default function StorageSettings() {
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

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data? This will free up storage space.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'Cache cleared successfully!')
        }
      ]
    );
  };

  const handleClearDownloads = () => {
    Alert.alert(
      'Clear Downloads',
      'Are you sure you want to clear all downloaded files?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'Downloads cleared successfully!')
        }
      ]
    );
  };

  const StorageItem = ({ 
    title, 
    size, 
    description, 
    onPress 
  }: { 
    title: string; 
    size: string; 
    description: string; 
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress}>
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
        <XStack alignItems="center" gap={8}>
          <Text fontSize={14} color={secondaryTextColor}>
            {size}
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
              Storage
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            Manage your storage usage
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={20}>
          {/* Storage Overview */}
          <YStack backgroundColor={cardBg} borderRadius={12} padding={20} gap={12}>
            <Text fontSize={18} fontWeight="600" color={textColor} marginBottom={8}>
              Storage Overview
            </Text>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={14} color={secondaryTextColor}>
                Total Used
              </Text>
              <Text fontSize={16} fontWeight="600" color={textColor}>
                245 MB
              </Text>
            </XStack>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={14} color={secondaryTextColor}>
                Available
              </Text>
              <Text fontSize={16} fontWeight="600" color={textColor}>
                12.5 GB
              </Text>
            </XStack>
          </YStack>

          {/* Storage Options */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Storage Management
              </Text>
            </YStack>
            <StorageItem
              title="Cache"
              size="128 MB"
              description="Temporary files and cached data"
              onPress={handleClearCache}
            />
            <StorageItem
              title="Downloads"
              size="45 MB"
              description="Downloaded files and documents"
              onPress={handleClearDownloads}
            />
            <StorageItem
              title="Images"
              size="72 MB"
              description="Saved images and media"
              onPress={() => Alert.alert('Images', 'Image management will be implemented')}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

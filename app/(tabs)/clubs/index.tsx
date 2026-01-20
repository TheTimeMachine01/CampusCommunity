import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { YStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { ClubCard } from '../../../components/ui/ClubCard';
import { clubsApi } from '../../../services/api';
import { Club } from '../../../constants/types';
import { useResolvedColorScheme } from '../../../context/ThemeContext';

export default function ClubsScreen() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const colorScheme = useResolvedColorScheme();

  const isDark = colorScheme === 'dark';

  const loadClubs = async () => {
    try {
      const response = await clubsApi.getClubs();
      setClubs(response.data);
    } catch (error) {
      console.error('Failed to load clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClubs();
    setRefreshing(false);
  };

  useEffect(() => {
    loadClubs();
  }, []);

  return (
    <YStack flex={1} backgroundColor={theme.background}>
      <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
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
          My Clubs
        </Text>
        <Text fontSize={16} color="rgba(255,255,255,0.9)">
          Your subscribed communities
        </Text>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={15}>
          <Text fontSize={20} fontWeight="bold" color={isDark ? '#ffffff' : '#1f2937'} marginBottom={10}>
            Active Communities
          </Text>
          {loading ? (
            <Text fontSize={16} color={isDark ? '#d1d5db' : '#6b7280'} textAlign="center" padding={20}>
              Loading clubs...
            </Text>
          ) : clubs.length === 0 ? (
            <YStack alignItems="center" padding={40} gap={10}>
              <Text fontSize={18} fontWeight="600" color={isDark ? '#ffffff' : '#1f2937'}>
                No clubs subscribed yet
              </Text>
              <Text fontSize={14} color={isDark ? '#d1d5db' : '#6b7280'} textAlign="center">
                Join some clubs to see updates here
              </Text>
            </YStack>
          ) : (
            clubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onPress={() => {
                  console.log('Club pressed:', club.name);
                }}
                isDark={isDark}
              />
            ))
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

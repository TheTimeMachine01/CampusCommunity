import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Pressable, Alert } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { ClubCard } from '../../../components/ui/ClubCard';
import { RoleGuard } from '../../../components/RoleGuard';
import { ClubUpdateModal } from '../../../components/modals/ClubUpdateModal';
import { clubsApi } from '../../../services/api';
import { useConnectivity } from '../../../context/ConnectivityContext';
import { clubsCache } from '../../../services/storage';
import { Club, Update } from '../../../constants/types';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../hooks/useAuth';

const CLUB_CATEGORIES = ['All', 'Technical', 'Sports', 'Cultural', 'Academic', 'Social'] as const;
type ClubCategory = typeof CLUB_CATEGORIES[number];

export default function ClubsScreen() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory>('All');
  const theme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const { user } = useAuth();
  const { isOnline } = useConnectivity();

  const isDark = colorScheme === 'dark';

  // Filter clubs based on selected category
  const filteredClubs = selectedCategory === 'All'
    ? clubs
    : clubs.filter(club => club.category.toLowerCase() === selectedCategory.toLowerCase());

  const loadClubs = async () => {
    try {
      // Try to load from API if online
      if (isOnline) {
        const response = await clubsApi.getClubs();
        setClubs(response.data);
      } else {
        // Load from cache when offline
        const cachedClubs = await clubsCache.get();
        setClubs(cachedClubs || []);
      }
    } catch (error) {
      console.error('Failed to load clubs:', error);
      // Fallback to cache on API error
      const cachedClubs = await clubsCache.get();
      setClubs(cachedClubs || []);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClubs();
    setRefreshing(false);
  };

  const canPostUpdate = (clubId: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'club_lead' && user.clubId === clubId) return true;
    return false;
  };

  const handlePostUpdate = (clubId: string) => {
    if (canPostUpdate(clubId)) {
      setSelectedClubId(clubId);
      setUpdateModalVisible(true);
    } else {
      Alert.alert('Permission Denied', 'You do not have permission to post updates for this club.');
    }
  };

  const handleUpdateSuccess = async (update: Update) => {
    // Reload clubs from API to get fresh data without duplicates
    await loadClubs();
    Alert.alert('Success', 'Your update has been posted to the club feed.');
  };

  useEffect(() => {
    loadClubs();
  }, [isOnline]);

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
        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
          style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}
        >
          {CLUB_CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  selectedCategory === category
                    ? '#10B981'
                    : isDark
                    ? '#374151'
                    : '#e5e7eb',
              }}
            >
              <Text
                fontSize={12}
                fontWeight="600"
                color={selectedCategory === category ? 'white' : isDark ? '#d1d5db' : '#4b5563'}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <YStack padding={20} gap={15}>
          <YStack gap={10}>
            <Text fontSize={20} fontWeight="bold" color={isDark ? '#ffffff' : '#1f2937'} marginBottom={10}>
              Active Communities
            </Text>
            <RoleGuard allowedRoles={['admin', 'club_lead']}>
              <Pressable
                style={{
                  backgroundColor: '#10B981',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                onPress={() => {
                  if (clubs.length > 0 && canPostUpdate(clubs[0].id)) {
                    handlePostUpdate(clubs[0].id);
                  } else {
                    Alert.alert('No Clubs', 'Subscribe to a club first or check your permissions.');
                  }
                }}
              >
                <Text color="white" fontWeight="bold" textAlign="center">
                  + Post Update
                </Text>
              </Pressable>
            </RoleGuard>
          </YStack>
          {loading ? (
            <Text fontSize={16} color={isDark ? '#d1d5db' : '#6b7280'} textAlign="center" padding={20}>
              Loading clubs...
            </Text>
          ) : filteredClubs.length === 0 ? (
            <YStack alignItems="center" padding={40} gap={10}>
              <Text fontSize={18} fontWeight="600" color={isDark ? '#ffffff' : '#1f2937'}>
                {clubs.length === 0 ? 'No clubs subscribed yet' : 'No clubs in this category'}
              </Text>
              <Text fontSize={14} color={isDark ? '#d1d5db' : '#6b7280'} textAlign="center">
                {clubs.length === 0 ? 'Join some clubs to see updates here' : 'Try selecting a different category'}
              </Text>
            </YStack>
          ) : (
            filteredClubs.map((club) => (
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

      <ClubUpdateModal
        visible={updateModalVisible}
        clubId={selectedClubId}
        onClose={() => setUpdateModalVisible(false)}
        onSuccess={handleUpdateSuccess}
        authorName={user?.name || 'Club Member'}
      />
    </YStack>
  );
}

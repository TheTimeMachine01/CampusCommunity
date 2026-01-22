import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Pressable, Alert, TextInput } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { NewsCard } from '../../../components/ui/NewsCard';
import { RoleGuard } from '../../../components/RoleGuard';
import { NewsModal } from '../../../components/modals/NewsModal';
import { NotificationCenter } from '../../../components/modals/NotificationCenter';
import { NotificationBell } from '../../../components/ui/NotificationBell';
import { newsApi } from '../../../services/api';
import { useConnectivity } from '../../../context/ConnectivityContext';
import { newsCache } from '../../../services/storage';
import { NewsItem } from '../../../constants/types';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../hooks/useAuth';
import { useSearch } from '../../../hooks/useSearch';

export default function DashboardScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newsModalVisible, setNewsModalVisible] = useState(false);
  const [notificationCenterVisible, setNotificationCenterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const { user } = useAuth();
  const { isOnline } = useConnectivity();

  const isDark = colorScheme === 'dark';

  // Filter news based on search query
  const filteredNews = useSearch(news, searchQuery);

  const loadNews = async () => {
    try {
      // Try to load from API if online
      if (isOnline) {
        const response = await newsApi.getNews();
        setNews(response.data);
      } else {
        // Load from cache when offline
        const cachedNews = await newsCache.get();
        setNews(cachedNews || []);
      }
    } catch (error) {
      console.error('Failed to load news:', error);
      // Fallback to cache on API error
      const cachedNews = await newsCache.get();
      setNews(cachedNews || []);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const handleNewsSuccess = async (newNews: NewsItem) => {
    // Reload news from API to get fresh data without duplicates
    await loadNews();
    Alert.alert('Success', 'Your announcement has been published to the campus feed.');
  };

  useEffect(() => {
    loadNews();
  }, [isOnline]);

  return (
    <YStack flex={1} backgroundColor={theme.background}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={{
          paddingTop: 50,
          paddingHorizontal: 20,
          paddingBottom: 20,
          justifyContent: 'space-between',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        {/* Header with Bell */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom={15}>
          <YStack flex={1}>
            <Text fontSize={28} fontWeight="bold" color="white" marginBottom={2}>
              Welcome to Campus
            </Text>
            <Text fontSize={14} color="rgba(255,255,255,0.85)">
              Stay updated with latest news
            </Text>
          </YStack>
          <NotificationBell 
            onPress={() => setNotificationCenterVisible(true)}
            color="white"
            size={24}
          />
        </XStack>

        {/* Search Bar */}
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          <TextInput
            placeholder="Search news..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500',
            }}
          />
        </View>
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
          <YStack gap={10}>
            <Text fontSize={20} fontWeight="bold" color={isDark ? '#ffffff' : '#1f2937'}>
              Latest News
            </Text>
            <RoleGuard allowedRoles={['admin']}>
              <Pressable
                style={{
                  backgroundColor: '#667eea',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                onPress={() => setNewsModalVisible(true)}
              >
                <Text color="white" fontWeight="bold" textAlign="center">
                  + Create News Post
                </Text>
              </Pressable>
            </RoleGuard>
          </YStack>
          {loading ? (
            <Text fontSize={16} color={isDark ? '#d1d5db' : '#6b7280'} textAlign="center" padding={20}>
              Loading news...
            </Text>
          ) : filteredNews.length === 0 ? (
            <YStack alignItems="center" padding={40} gap={10}>
              <Text fontSize={18} fontWeight="600" color={isDark ? '#ffffff' : '#1f2937'}>
                {searchQuery ? 'No results found' : 'No news yet'}
              </Text>
              <Text fontSize={14} color={isDark ? '#d1d5db' : '#6b7280'} textAlign="center">
                {searchQuery ? 'Try a different search' : 'Check back soon for updates'}
              </Text>
            </YStack>
          ) : (
            filteredNews.map((item) => (
              <NewsCard
                key={item.id}
                newsItem={item}
                onPress={() => {
                  console.log('News item pressed:', item.title);
                }}
                isDark={isDark}
              />
            ))
          )}
        </YStack>
      </ScrollView>

      <NewsModal
        visible={newsModalVisible}
        onClose={() => setNewsModalVisible(false)}
        onSuccess={handleNewsSuccess}
        authorName={user?.name || 'Campus Admin'}
      />

      <NotificationCenter
        visible={notificationCenterVisible}
        onClose={() => setNotificationCenterVisible(false)}
      />
    </YStack>
  );
}

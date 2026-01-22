import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  Pressable,
  RefreshControl,
  View,
  StyleSheet,
} from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Button,
  useTheme,
  Separator,
} from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '../../constants/types';
import { notificationService } from '../../services/notificationService';
import { useResolvedColorScheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Notification Center Modal
 * Displays all notifications with role-based filtering
 */
export function NotificationCenter({ visible, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const { user } = useAuth();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (visible) {
      loadNotifications();
    }
  }, [visible]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      if (user) {
        const filtered = await notificationService.getNotificationsForRole(
          user.role,
          user.clubId
        );
        setNotifications(filtered);
      }
    } catch (error) {
      console.error('[NotificationCenter] Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('[NotificationCenter] Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('[NotificationCenter] Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return '✅';
      case 'news':
        return '📰';
      case 'club':
        return '🎭';
      case 'admin':
        return '👑';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'system':
        return isDark ? '#10b981' : '#059669';
      case 'news':
        return isDark ? '#3b82f6' : '#2563eb';
      case 'club':
        return isDark ? '#f59e0b' : '#d97706';
      case 'admin':
        return isDark ? '#ef4444' : '#dc2626';
      default:
        return isDark ? '#6b7280' : '#4b5563';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <YStack
        flex={1}
        backgroundColor={theme.background}
        paddingTop={50}
      >
        {/* Header */}
        <XStack
          paddingHorizontal={16}
          paddingVertical={12}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor={isDark ? '#374151' : '#e5e7eb'}
        >
          <Text fontSize={20} fontWeight="bold" color={theme.color}>
            Notifications
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={24}
              color={isDark ? '#d1d5db' : '#1f2937'}
            />
          </Pressable>
        </XStack>

        {/* Action Buttons */}
        {notifications.some((n) => !n.isRead) && (
          <XStack
            paddingHorizontal={16}
            paddingVertical={10}
            justifyContent="flex-end"
            gap={10}
          >
            <Button
              size="$3"
              backgroundColor="$blue10"
              color="white"
              onPress={handleMarkAllAsRead}
            >
              <Text fontSize={12} fontWeight="600" color="white">
                Mark All Read
              </Text>
            </Button>
          </XStack>
        )}

        {/* Notifications List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadNotifications} />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading && !notifications.length ? (
            <YStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              paddingVertical={40}
            >
              <Text fontSize={16} color={isDark ? '#d1d5db' : '#6b7280'}>
                Loading notifications...
              </Text>
            </YStack>
          ) : notifications.length === 0 ? (
            <YStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              paddingVertical={60}
              gap={10}
            >
              <Ionicons
                name="notifications-off"
                size={48}
                color={isDark ? '#6b7280' : '#d1d5db'}
              />
              <Text fontSize={16} fontWeight="600" color={theme.color}>
                No Notifications
              </Text>
              <Text fontSize={14} color={isDark ? '#9ca3af' : '#9ca3af'}>
                You're all caught up!
              </Text>
            </YStack>
          ) : (
            notifications.map((notification, index) => (
              <YStack
                key={notification.id}
                paddingHorizontal={16}
                paddingVertical={12}
                backgroundColor={
                  !notification.isRead
                    ? isDark
                      ? 'rgba(102, 126, 234, 0.1)'
                      : 'rgba(102, 126, 234, 0.05)'
                    : 'transparent'
                }
                borderRadius={8}
                marginHorizontal={12}
                marginVertical={6}
              >
                {/* Notification Item */}
                <Pressable
                  onPress={() => handleMarkAsRead(notification.id)}
                  style={{ opacity: notification.isRead ? 0.7 : 1 }}
                >
                  <XStack gap={12} alignItems="flex-start">
                    {/* Icon */}
                    <YStack
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor={getNotificationColor(notification.type)}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={20}>
                        {getNotificationIcon(notification.type)}
                      </Text>
                    </YStack>

                    {/* Content */}
                    <YStack flex={1} gap={2}>
                      <XStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={10}
                      >
                        <YStack flex={1} gap={2}>
                          <Text
                            fontSize={14}
                            fontWeight="700"
                            color={theme.color}
                            numberOfLines={1}
                          >
                            {notification.title}
                          </Text>
                          <Text
                            fontSize={13}
                            color={isDark ? '#9ca3af' : '#6b7280'}
                            numberOfLines={2}
                          >
                            {notification.message}
                          </Text>
                        </YStack>

                        {/* Unread Indicator */}
                        {!notification.isRead && (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#667eea',
                              marginTop: 4,
                            }}
                          />
                        )}
                      </XStack>

                      {/* Timestamp */}
                      <Text
                        fontSize={11}
                        color={isDark ? '#6b7280' : '#9ca3af'}
                      >
                        {formatTime(notification.timestamp)}
                      </Text>
                    </YStack>
                  </XStack>
                </Pressable>

                {/* Divider */}
                {index < notifications.length - 1 && (
                  <Separator
                    marginVertical={8}
                    backgroundColor={isDark ? '#374151' : '#e5e7eb'}
                  />
                )}
              </YStack>
            ))
          )}
        </ScrollView>
      </YStack>
    </Modal>
  );
}

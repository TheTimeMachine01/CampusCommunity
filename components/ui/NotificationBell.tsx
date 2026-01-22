import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { YStack, Circle, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../../services/notificationService';

interface NotificationBellProps {
  onPress: () => void;
  color?: string;
  size?: number;
}

/**
 * Notification Bell Icon with Unread Badge
 * Shows red dot when there are unread notifications
 */
export function NotificationBell({ 
  onPress, 
  color = '#667eea', 
  size = 24 
}: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load unread count on mount
    loadUnreadCount();

    // Set up periodic check for unread notifications
    const interval = setInterval(loadUnreadCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('[NotificationBell] Failed to load unread count:', error);
    }
  };

  return (
    <Pressable onPress={onPress} style={{ position: 'relative' }}>
      <YStack width={size + 8} height={size + 8} justifyContent="center" alignItems="center">
        <Ionicons 
          name="notifications-outline" 
          size={size} 
          color={color} 
        />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <Circle
            position="absolute"
            top={-4}
            right={-4}
            width={20}
            height={20}
            backgroundColor="$red10"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              fontSize={10}
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </Circle>
        )}
      </YStack>
    </Pressable>
  );
}

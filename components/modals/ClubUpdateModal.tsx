import React, { useState } from 'react';
import { Modal, View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { YStack, XStack, TextArea, Text, Button, useTheme } from 'tamagui';
import { clubsApi } from '../../services/api';
import { useConnectivity } from '../../context/ConnectivityContext';
import { Update } from '../../constants/types';

interface ClubUpdateModalProps {
  visible: boolean;
  clubId: string;
  onClose: () => void;
  onSuccess: (update: Update) => void;
  authorName: string;
}

export function ClubUpdateModal({
  visible,
  clubId,
  onClose,
  onSuccess,
  authorName,
}: ClubUpdateModalProps) {
  const theme = useTheme();
  const { isOnline } = useConnectivity();
  const [content, setContent] = useState('');
  const [type, setType] = useState<'event' | 'announcement' | 'achievement'>('announcement');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isOnline) {
      alert('You must be online to post updates');
      return;
    }

    if (!content.trim()) {
      alert('Please enter update content');
      return;
    }

    setLoading(true);
    try {
      const response = await clubsApi.addClubUpdate(clubId, {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        content,
        type,
      });

      onSuccess(response.data);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create update:', error);
      alert('Failed to create update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setType('announcement');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.container, { backgroundColor: theme.background?.val as string }]}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <YStack gap={15} padding={20}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={20} fontWeight="bold">
                  Post Update
                </Text>
                <Pressable onPress={handleClose}>
                  <Text fontSize={24} fontWeight="bold" color="#666">
                    ✕
                  </Text>
                </Pressable>
              </XStack>

              {/* Meta Information */}
              <YStack gap={8} backgroundColor="#f5f5f5" padding={12} borderRadius={8}>
                <XStack justifyContent="space-between">
                  <Text fontSize={13} color="#666">
                    Author:
                  </Text>
                  <Text fontSize={13} fontWeight="600">
                    {authorName}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize={13} color="#666">
                    Date:
                  </Text>
                  <Text fontSize={13} fontWeight="600">
                    {currentDate}
                  </Text>
                </XStack>
              </YStack>

              {/* Content Input */}
              <YStack gap={5}>
                <Text fontSize={14} fontWeight="600">
                  Update Content *
                </Text>
                <TextArea
                  placeholder="What's new in your club?"
                  value={content}
                  onChangeText={setContent}
                  editable={!loading}
                  numberOfLines={8}
                  placeholderTextColor="#999"
                  style={{ paddingVertical: 12, paddingHorizontal: 12, minHeight: 140 }}
                />
              </YStack>

              {/* Type Selection */}
              <YStack gap={5}>
                <Text fontSize={14} fontWeight="600">
                  Update Type
                </Text>
                <XStack gap={10} flexWrap="wrap">
                  {(['announcement', 'event', 'achievement'] as const).map((updateType) => (
                    <Pressable
                      key={updateType}
                      onPress={() => setType(updateType)}
                      disabled={loading}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: type === updateType ? '#10B981' : '#ddd',
                        backgroundColor: type === updateType ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      }}
                    >
                      <Text
                        fontSize={13}
                        fontWeight="500"
                        color={type === updateType ? '#10B981' : '#666'}
                        textTransform="capitalize"
                      >
                        {updateType}
                      </Text>
                    </Pressable>
                  ))}
                </XStack>
              </YStack>

              {/* Buttons */}
              <XStack gap={10} marginTop={20}>
                <Button
                  flex={1}
                  backgroundColor="#666"
                  onPress={handleClose}
                  disabled={loading}
                  opacity={loading ? 0.6 : 1}
                >
                  <Text color="white" fontWeight="bold">
                    Discard
                  </Text>
                </Button>
                <Button
                  flex={1}
                  backgroundColor={isOnline ? '#10B981' : '#ccc'}
                  onPress={handleSubmit}
                  disabled={loading || !isOnline}
                  opacity={loading || !isOnline ? 0.6 : 1}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text color="white" fontWeight="bold">
                      {isOnline ? 'Post' : 'Offline'}
                    </Text>
                  )}
                </Button>
              </XStack>
            </YStack>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

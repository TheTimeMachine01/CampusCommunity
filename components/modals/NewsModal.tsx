import React, { useState } from 'react';
import { Modal, View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { YStack, XStack, Input, TextArea, Text, Button, useTheme } from 'tamagui';
import { newsApi } from '../../services/api';
import { NewsItem } from '../../constants/types';

interface NewsModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newsItem: NewsItem) => void;
  authorName: string;
}

export function NewsModal({ visible, onClose, onSuccess, authorName }: NewsModalProps) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400');
  const [category, setCategory] = useState<'event' | 'announcement' | 'achievement'>('announcement');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await newsApi.createNews({
        title,
        description,
        imageUrl,
        category,
        author: authorName,
      });
      
      onSuccess(response.data);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create news:', error);
      alert('Failed to create news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400');
    setCategory('announcement');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
                  Create News
                </Text>
                <Pressable onPress={handleClose}>
                  <Text fontSize={24} fontWeight="bold" color="#666">
                    ✕
                  </Text>
                </Pressable>
              </XStack>

              {/* Title Input */}
              <YStack gap={5}>
                <Text fontSize={14} fontWeight="600">
                  Title *
                </Text>
                <Input
                  placeholder="Enter news title"
                  value={title}
                  onChangeText={setTitle}
                  editable={!loading}
                  placeholderTextColor="#999"
                  style={{ paddingVertical: 12, paddingHorizontal: 12 }}
                />
              </YStack>

              {/* Description Input */}
              <YStack gap={5}>
                <Text fontSize={14} fontWeight="600">
                  Description *
                </Text>
                <TextArea
                  placeholder="Enter news description"
                  value={description}
                  onChangeText={setDescription}
                  editable={!loading}
                  numberOfLines={6}
                  placeholderTextColor="#999"
                  style={{ paddingVertical: 12, paddingHorizontal: 12, minHeight: 120 }}
                />
              </YStack>

              {/* Image URL Input */}
              <YStack gap={5}>
                <Text fontSize={14} fontWeight="600">
                  Image URL
                </Text>
                <Input
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  editable={!loading}
                  placeholderTextColor="#999"
                  style={{ paddingVertical: 12, paddingHorizontal: 12 }}
                />
              </YStack>

              {/* Category Picker */}
              <YStack gap={5}>
                <Text fontSize={14} fontWeight="600">
                  Category
                </Text>
                <XStack gap={10}>
                  {(['announcement', 'event', 'achievement'] as const).map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      disabled={loading}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: category === cat ? '#667eea' : '#ddd',
                        backgroundColor: category === cat ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      }}
                    >
                      <Text
                        fontSize={13}
                        fontWeight="500"
                        color={category === cat ? '#667eea' : '#666'}
                        textTransform="capitalize"
                      >
                        {cat}
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
                    Cancel
                  </Text>
                </Button>
                <Button
                  flex={1}
                  backgroundColor="#667eea"
                  onPress={handleSubmit}
                  disabled={loading}
                  opacity={loading ? 0.6 : 1}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text color="white" fontWeight="bold">
                      Publish
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

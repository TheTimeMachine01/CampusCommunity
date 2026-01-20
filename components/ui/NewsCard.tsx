import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { NewsItem } from '../../constants/types';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  newsItem: NewsItem;
  onPress?: () => void;
  isDark?: boolean;
}

export function NewsCard({ newsItem, onPress, isDark = false }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event':
        return '#3B82F6';
      case 'announcement':
        return '#10B981';
      case 'achievement':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'event':
        return '📅';
      case 'announcement':
        return '📢';
      case 'achievement':
        return '🏆';
      default:
        return '📄';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card marginBottom={12} isDark={isDark}>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 8 
            }}>
              <Text style={{ 
                fontSize: 16, 
                marginRight: 8 
              }}>
                {getCategoryIcon(newsItem.category)}
              </Text>
              <Text style={{ 
                fontSize: 12, 
                color: getCategoryColor(newsItem.category),
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {newsItem.category}
              </Text>
            </View>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              marginBottom: 8,
              lineHeight: 22,
              color: isDark ? '#ffffff' : '#1f2937'
            }}>
              {newsItem.title}
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: isDark ? '#d1d5db' : '#6B7280',
              lineHeight: 20,
              marginBottom: 12
            }}>
              {newsItem.description}
            </Text>
          </View>
          <Image
            source={{ uri: newsItem.imageUrl }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              marginLeft: 12
            }}
            resizeMode="cover"
          />
        </View>
        
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={{ 
            fontSize: 12, 
            color: isDark ? '#9ca3af' : '#9CA3AF'
          }}>
            {formatDistanceToNow(newsItem.timestamp, { addSuffix: true })}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ 
              fontSize: 12, 
              color: isDark ? '#9ca3af' : '#9CA3AF',
              marginRight: 8
            }}>
              👁️ {newsItem.readCount}
            </Text>
            <Text style={{ 
              fontSize: 12, 
              color: isDark ? '#9ca3af' : '#9CA3AF'
            }}>
              by {newsItem.author}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

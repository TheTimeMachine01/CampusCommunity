import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { Club } from '../../constants/types';

interface ClubCardProps {
  club: Club;
  onPress?: () => void;
  isDark?: boolean;
}

export function ClubCard({ club, onPress, isDark = false }: ClubCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return '#3B82F6';
      case 'sports':
        return '#10B981';
      case 'cultural':
        return '#8B5CF6';
      case 'technical':
        return '#F59E0B';
      case 'social':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return '📚';
      case 'sports':
        return '⚽';
      case 'cultural':
        return '🎭';
      case 'technical':
        return '💻';
      case 'social':
        return '👥';
      default:
        return '🏛️';
    }
  };

  const unreadUpdates = club.updates.filter(update => 
    new Date(update.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card marginBottom={12} isDark={isDark}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ 
            width: 60, 
            height: 60, 
            borderRadius: 30,
            backgroundColor: getCategoryColor(club.category),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
          }}>
            {club.imageUrl ? (
              <Image
                source={{ uri: club.imageUrl }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ fontSize: 24 }}>
                {getCategoryIcon(club.category)}
              </Text>
            )}
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              marginBottom: 4
            }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600',
                marginRight: 8,
                color: isDark ? '#ffffff' : '#1f2937'
              }}>
                {club.name}
              </Text>
              {unreadUpdates > 0 && (
                <View style={{
                  backgroundColor: '#EF4444',
                  borderRadius: 10,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  minWidth: 20,
                  alignItems: 'center'
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 10, 
                    fontWeight: '600' 
                  }}>
                    {unreadUpdates}
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={{ 
              fontSize: 14, 
              color: isDark ? '#d1d5db' : '#6B7280',
              marginBottom: 8,
              lineHeight: 18
            }}>
              {club.description}
            </Text>
            
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{ 
                fontSize: 12, 
                color: isDark ? '#9ca3af' : '#9CA3AF'
              }}>
                👥 {club.memberCount} members
              </Text>
              <Text style={{ 
                fontSize: 12, 
                color: getCategoryColor(club.category),
                fontWeight: '500'
              }}>
                {club.category.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

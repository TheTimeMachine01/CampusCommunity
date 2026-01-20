import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function OAuthCallbackScreen() {
  useEffect(() => {
    // Simulate OAuth callback processing
    const timer = setTimeout(() => {
      router.replace('/(tabs)/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={{ flex: 1 }}
    >
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
      }}>
        <View style={{ 
          backgroundColor: 'rgba(255,255,255,0.95)', 
          borderRadius: 20, 
          padding: 40,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10
        }}>
          <ActivityIndicator size="large" color="#4F46E5" style={{ marginBottom: 20 }} />
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600', 
            color: '#1F2937',
            textAlign: 'center'
          }}>
            Completing Authentication...
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: '#6B7280',
            textAlign: 'center',
            marginTop: 10
          }}>
            Please wait while we set up your account
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

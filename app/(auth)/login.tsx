import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../constants/types';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth() as unknown as { login: (credentials: LoginCredentials) => Promise<boolean> };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Login attempt with:', email);
      const success = await login({ email, password });
      console.log('Login result:', success);
      if (success) {
        console.log('Login successful, navigating to dashboard');
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Error', 'Invalid credentials. Try: test@example.com / password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={{ flex: 1 }}
      >
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          padding: 20,
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{ 
            backgroundColor: 'rgba(255,255,255,0.95)', 
            borderRadius: 20, 
            padding: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10
          }}>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: 30,
              color: '#1F2937'
            }}>
              Welcome Back
            </Text>
            
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                padding: 15,
                marginBottom: 15,
                fontSize: 16,
                backgroundColor: 'white'
              }}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                padding: 15,
                marginBottom: 25,
                fontSize: 16,
                backgroundColor: 'white'
              }}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <Button
              onPress={handleLogin}
              loading={loading}
              backgroundColor="#4F46E5"
              color="white"
              borderRadius={12}
              paddingVertical={15}
              marginBottom={15}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Sign In
              </Text>
            </Button>
            
            <Button
              onPress={handleSignup}
              backgroundColor="transparent"
              borderRadius={12}
              style={{ borderWidth: 1, borderColor: '#4F46E5', paddingVertical: 15 }}
            >
              <Text style={{ color: '#4F46E5', fontSize: 16, fontWeight: '600' }}>
                Create Account
                </Text>
              </Button>
              
              <Text style={{ 
                textAlign: 'center', 
                marginTop: 20, 
                color: '#6B7280',
                fontSize: 12
              }}>
                Demo: test@example.com / password
              </Text>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

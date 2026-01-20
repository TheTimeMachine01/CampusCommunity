import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { SignupCredentials } from '../../constants/types';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const success = await signup({ name, email, password });
      if (success) {
        Alert.alert('Success', 'Account created! Please sign in.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') }
        ]);
      } else {
        Alert.alert('Error', 'Signup failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
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
              Join Campus Community
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
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            
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
              onPress={handleSignup}
              loading={loading}
              backgroundColor="#4F46E5"
              color="white"
              borderRadius={12}
              paddingVertical={15}
              marginBottom={15}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Create Account
              </Text>
            </Button>
            
            <Button
              onPress={handleLogin}
              backgroundColor="transparent"
              borderWidth={1}
              borderColor="#4F46E5"
              borderRadius={12}
              paddingVertical={15}
            >
              <Text style={{ color: '#4F46E5', fontSize: 16, fontWeight: '600' }}>
                Already have an account? Sign In
              </Text>
            </Button>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

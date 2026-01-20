import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, BackHandler, TextInput, Alert, Linking } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';
import { Button } from '../../../components/ui/Button';

export default function ContactSettings() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const tamaguiTheme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#222222' : '#ffffff';
  const borderColor = isDark ? '#333333' : '#E5E7EB';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const inputBg = isDark ? '#2a2a2a' : '#f9fafb';
  const inputTextColor = isDark ? '#ffffff' : '#1f2937';
  const placeholderColor = isDark ? '#666666' : '#9ca3af';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, [router]);

  const handleSubmit = () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We will get back to you as soon as possible.',
      [{ text: 'OK', onPress: () => {
        setSubject('');
        setMessage('');
        router.push('/(tabs)/settings');
      }}]
    );
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@campuscommunity.app?subject=Support Request');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const ContactMethod = ({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress}>
      <XStack
        padding={16}
        borderTopWidth={1}
        borderTopColor={borderColor}
        alignItems="center"
        gap={12}
      >
        <Text fontSize={24}>{icon}</Text>
        <YStack flex={1} gap={4}>
          <Text fontSize={16} fontWeight="500" color={textColor}>
            {title}
          </Text>
          <Text fontSize={14} color={isDark ? '#888888' : '#9ca3af'}>
            {subtitle}
          </Text>
        </YStack>
        <Text fontSize={20} color={isDark ? '#888888' : '#d1d5db'}>›</Text>
      </XStack>
    </TouchableOpacity>
  );

  return (
    <YStack flex={1} backgroundColor={tamaguiTheme.background}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
        style={{
          height: 140,
          paddingTop: 50,
          paddingHorizontal: 20,
          paddingBottom: 25,
          justifyContent: 'center',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <XStack alignItems="center" justifyContent="space-between" marginBottom={10}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{
              paddingRight: 16,
              paddingVertical: 8,
            }}
          >
            <Text fontSize={32} fontWeight="600" color="white">
              ‹
            </Text>
          </TouchableOpacity>
          <YStack flex={1} alignItems="flex-end">
            <Text fontSize={28} fontWeight="bold" color="white">
              Contact Us
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            Get in touch with our support team
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={20}>
          {/* Contact Methods */}
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Quick Contact
              </Text>
            </YStack>
            <ContactMethod
              icon="📧"
              title="Email"
              subtitle="support@campuscommunity.app"
              onPress={handleEmailPress}
            />
            <ContactMethod
              icon="📞"
              title="Phone"
              subtitle="+1 (234) 567-8900"
              onPress={handlePhonePress}
            />
          </YStack>

          {/* Contact Form */}
          <YStack backgroundColor={cardBg} borderRadius={12} padding={20} gap={20}>
            <Text fontSize={18} fontWeight="600" color={textColor} marginBottom={8}>
              Send us a Message
            </Text>
            
            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600" color={textColor} marginBottom={4}>
                Subject
              </Text>
              <TextInput
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 12,
                  padding: 15,
                  fontSize: 16,
                  color: inputTextColor,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
                placeholder="Enter subject"
                placeholderTextColor={placeholderColor}
                value={subject}
                onChangeText={setSubject}
              />
            </YStack>

            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600" color={textColor} marginBottom={4}>
                Message
              </Text>
              <TextInput
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 12,
                  padding: 15,
                  fontSize: 16,
                  color: inputTextColor,
                  borderWidth: 1,
                  borderColor: borderColor,
                  minHeight: 150,
                  textAlignVertical: 'top',
                }}
                placeholder="Enter your message"
                placeholderTextColor={placeholderColor}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
              />
            </YStack>

            <Button
              onPress={handleSubmit}
              backgroundColor="#6366F1"
              color="white"
              borderRadius={12}
              paddingVertical={15}
            >
              Send Message
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

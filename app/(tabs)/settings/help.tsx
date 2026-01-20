import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useResolvedColorScheme } from '../../../context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

interface FAQ {
  question: string;
  answer: string;
}

export default function HelpSettings() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const tamaguiTheme = useTheme();
  const colorScheme = useResolvedColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#222222' : '#ffffff';
  const borderColor = isDark ? '#333333' : '#E5E7EB';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const secondaryTextColor = isDark ? '#d1d5db' : '#6b7280';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, [router]);

  const faqs: FAQ[] = [
    {
      question: 'How do I join a club?',
      answer: 'Navigate to the Clubs tab and browse available clubs. Tap on a club you\'re interested in and click the "Join" button. You\'ll receive notifications about club updates once you\'re a member.',
    },
    {
      question: 'How do I update my profile?',
      answer: 'Go to Settings > Edit Profile. You can update your name, email, and profile picture from there. Changes are saved automatically when you tap "Save Changes".',
    },
    {
      question: 'Can I change the app theme?',
      answer: 'Yes! Go to Settings > Theme and choose from System Default, Light, or Dark mode. The theme will update immediately.',
    },
    {
      question: 'How do I manage notifications?',
      answer: 'Navigate to Settings > Notifications. You can toggle different types of notifications including push notifications, email notifications, news updates, and club updates.',
    },
    {
      question: 'What if I forgot my password?',
      answer: 'On the login screen, tap "Forgot Password" and follow the instructions to reset your password via email.',
    },
    {
      question: 'How do I report an issue?',
      answer: 'You can report issues by going to Settings > Contact Us and filling out the contact form. Our support team will get back to you as soon as possible.',
    },
  ];

  const FAQItem = ({ faq, index }: { faq: FAQ; index: number }) => {
    const isExpanded = expandedIndex === index;

    return (
      <YStack borderTopWidth={1} borderTopColor={borderColor}>
        <TouchableOpacity onPress={() => setExpandedIndex(isExpanded ? null : index)}>
          <XStack
            padding={16}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize={16} fontWeight="500" color={textColor} flex={1}>
              {faq.question}
            </Text>
            <Text fontSize={20} color={isDark ? '#888888' : '#d1d5db'}>
              {isExpanded ? '▼' : '▶'}
            </Text>
          </XStack>
        </TouchableOpacity>
        {isExpanded && (
          <YStack padding={16} paddingTop={0}>
            <Text fontSize={14} color={secondaryTextColor} lineHeight={20}>
              {faq.answer}
            </Text>
          </YStack>
        )}
      </YStack>
    );
  };

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
              Help & FAQ
            </Text>
          </YStack>
        </XStack>
        <XStack justifyContent="flex-end">
          <Text fontSize={16} color="rgba(255,255,255,0.9)">
            Find answers to common questions
          </Text>
        </XStack>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding={20} gap={20}>
          <YStack backgroundColor={cardBg} borderRadius={12} overflow="hidden">
            <YStack padding={16} borderBottomWidth={1} borderBottomColor={borderColor}>
              <Text fontSize={18} fontWeight="600" color={textColor}>
                Frequently Asked Questions
              </Text>
            </YStack>
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

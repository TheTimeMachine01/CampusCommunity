import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useAuth } from '../../hooks/useAuth';

interface MyFloatingTabBarProps extends BottomTabBarProps {
  visibleRoutes?: string[];
}

function MyFloatingTabBar({ state, descriptors, navigation, visibleRoutes = [] }: MyFloatingTabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const tabBarBackgroundColor = isDark
    ? 'rgba(0, 0, 0, 0.7)'
    : 'rgba(255, 255, 255, 0.9)';

  const activeTintColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveTintColor = isDark ? '#BBBBBB' : '#666666';

  const getIconName = (routeName: string, focused: boolean): any => {
    switch (routeName) {
      case 'dashboard':
        return focused ? 'home' : 'home-outline';
      case 'clubs':
        return focused ? 'account-group' : 'account-group-outline';
      case 'settings':
        return focused ? 'cog' : 'cog-outline';
      default:
        return 'information-outline';
    }
  };

  // Filter routes based on visible routes
  const filteredRoutes = state.routes.filter(route => 
    visibleRoutes.length === 0 || visibleRoutes.includes(route.name)
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <BlurView
        intensity={90}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[styles.tabBarContainer, { backgroundColor: tabBarBackgroundColor }]}>
        {filteredRoutes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabBarButton}
            >
              <MaterialCommunityIcons
                name={getIconName(route.name, isFocused)}
                size={24}
                color={isFocused ? activeTintColor : inactiveTintColor}
              />
              <Text
                style={{
                  color: isFocused ? activeTintColor : inactiveTintColor,
                  fontSize: 10,
                  marginTop: 2,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  const { user } = useAuth();

  // Define which routes are visible for each role
  const getVisibleRoutes = () => {
    if (!user) return [];

    const baseRoutes = ['dashboard', 'settings'];
    
    switch (user.role) {
      case 'admin':
        // Admin can see all routes
        return ['dashboard', 'clubs', 'settings'];
      case 'club_lead':
        // Club leads can see clubs and settings
        return ['clubs', 'settings'];
      case 'student':
        // Students can see dashboard, clubs, and settings
        return ['dashboard', 'clubs', 'settings'];
      case 'guest':
      default:
        // Guests shouldn't reach tabs, but if they do, show minimal access
        return ['dashboard'];
    }
  };

  const visibleRoutes = getVisibleRoutes();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <MyFloatingTabBar {...props} visibleRoutes={visibleRoutes} />}
    >
      {visibleRoutes.includes('dashboard') && (
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
          }}
        />
      )}
      {visibleRoutes.includes('clubs') && (
        <Tabs.Screen
          name="clubs"
          options={{
            title: 'Clubs',
          }}
        />
      )}
      {visibleRoutes.includes('settings') && (
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
      )}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    height: 60,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
});

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: Platform.select({ ios: 88, android: 68, default: 68 }),
          paddingBottom: Platform.select({ ios: 28, android: 10, default: 10 }),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Outfit_600SemiBold',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'today' : 'today-outline'} size={22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Medicines',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'medkit' : 'medkit-outline'} size={22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'ScanRx',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'scan-circle' : 'scan-circle-outline'} size={26} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Adherence',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Clinic Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={22} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}

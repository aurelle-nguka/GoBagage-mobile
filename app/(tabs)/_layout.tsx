/**
 * Go Bagage — Tabs Layout
 *
 * SENDER   : Home | Search | Profile
 * TRAVELER : Home | Publish | My Trips | Profile
 * BOTH     : Home | Search | Publish | My Trips | Profile
 */

import { Platform } from 'react-native'
import { Tabs } from 'expo-router'
import { Home, PlusCircle, Search, Map, User } from 'lucide-react-native'
import { useAuthStore } from '../../store/auth.store'
import { Colors } from '../../theme'

export default function TabsLayout() {
  const { user } = useAuthStore()

  const isSender = user?.roles.includes('SENDER') ?? false
  const isTraveler = user?.roles.includes('TRAVELER') ?? false
  const isBoth = isSender && isTraveler

  const showSearch = isSender || isBoth
  const showPublish = isTraveler || isBoth
  const showTrips = isTraveler || isBoth

  const tabBarHeight = Platform.OS === 'ios' ? 83 : 60
  const tabBarPaddingBottom = Platform.OS === 'ios' ? 28 : 40

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
          elevation: 8,
          shadowOpacity: 0.08,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size - 2} />
          ),
        }}
      />

      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Search color={color} size={size - 2} />
          ),
          tabBarItemStyle: showSearch ? undefined : { display: 'none' },
          href: showSearch ? undefined : null,
        }}
      />

      <Tabs.Screen
        name='publish'
        options={{
          title: 'Publish',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle color={color} size={size - 2} />
          ),
          tabBarItemStyle: showPublish ? undefined : { display: 'none' },
          href: showPublish ? undefined : null,
        }}
      />

      <Tabs.Screen
        name='trips'
        options={{
          title: 'My Trips',
          tabBarIcon: ({ color, size }) => (
            <Map color={color} size={size - 2} />
          ),
          tabBarItemStyle: showTrips ? undefined : { display: 'none' },
          href: showTrips ? undefined : null,
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size - 2} />
          ),
        }}
      />
    </Tabs>
  )
}

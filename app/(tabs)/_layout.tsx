import { useEffect } from 'react'
import { Platform, Dimensions } from 'react-native'
import { Tabs, useRouter } from 'expo-router'
import { Home, PlusCircle, Search, Map, User } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/auth.store'
import { Colors } from '../../theme'

const { height } = Dimensions.get('window')
const isSmallScreen = height < 700

export default function TabsLayout() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user?.roles.includes('ADMIN')) {
      router.replace('/(admin)/dashboard')
    }
  }, [user])

  const isSender = user?.roles.includes('SENDER') ?? false
  const isTraveler = user?.roles.includes('TRAVELER') ?? false
  const isBoth = isSender && isTraveler

  const showSearch = isSender || isBoth
  const showPublish = isTraveler || isBoth
  const showTrips = isTraveler || isBoth

  const tabBarHeight = Platform.OS === 'ios' ? 83 : isSmallScreen ? 58 : 62
  const tabBarPaddingBottom = Platform.OS === 'ios' ? 28 : 2
  const tabBarPaddingTop = 4

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: tabBarPaddingTop,
          elevation: 8,
          shadowOpacity: 0.08,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size - 2} />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: t('nav.search'),
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
          title: t('nav.publish'),
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
          title: t('nav.my_trips'),
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
          title: t('nav.profile'),
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size - 2} />
          ),
        }}
      />
    </Tabs>
  )
}

import { Stack, useRouter } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { StripeProvider } from '@stripe/stripe-react-native'
import { StatusBar, Platform, View } from 'react-native'
import { useEffect, useRef } from 'react'
import type * as Notifications from 'expo-notifications'
import '../i18n'
import { useAuthStore } from '../store/auth.store'
import {
  registerForPushNotifications,
  sendTokenToBackend,
  handleNotificationNavigation,
  isExpoGo,
} from '../shared/services/notification.service'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
})

function AppContent() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { user } = useAuthStore()
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  )
  const responseListener = useRef<Notifications.EventSubscription | null>(
    null,
  )

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent')
      StatusBar.setTranslucent(true)
      StatusBar.setBarStyle('dark-content')
    }
  }, [])

  useEffect(() => {
    if (!user || isExpoGo) return

    // require() dynamique : voir shared/services/notification.service.ts pour le pourquoi.
    const NotificationsModule: typeof Notifications = require('expo-notifications')

    registerForPushNotifications().then((token) => {
      if (token) sendTokenToBackend(token)
    })

    notificationListener.current =
      NotificationsModule.addNotificationReceivedListener((notification) => {
        console.log('[NOTIF] Received:', notification.request.content)
      })

    responseListener.current =
      NotificationsModule.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as any
        console.log('[NOTIF] Clicked:', data)
        handleNotificationNavigation(data, router)
      })

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [user])

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? insets.top : 0,
      }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='(modals)' options={{ presentation: 'modal' }} />
        <Stack.Screen name='(admin)' />
      </Stack>
    </View>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <StripeProvider
              publishableKey={
                process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
              }
              merchantIdentifier='merchant.com.gobagage'
            >
              <AppContent />
            </StripeProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { StripeProvider } from '@stripe/stripe-react-native'
import { StatusBar, Platform, View } from 'react-native'
import { useEffect } from 'react'
import '../i18n'

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

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent')
      StatusBar.setTranslucent(true)
      StatusBar.setBarStyle('dark-content')
    }
  }, [])

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

import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
})

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style='auto' />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='(auth)' />
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='(modals)' options={{ presentation: 'modal' }} />
            <Stack.Screen name='(admin)' />
          </Stack>
        </QueryClientProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}

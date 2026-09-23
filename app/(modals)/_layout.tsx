import { Stack } from 'expo-router'
import { StripeProvider } from '@stripe/stripe-react-native'

export default function ModalsLayout() {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    >
      <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <Stack.Screen name='parcel-declare' />
        <Stack.Screen name='payment' />
        <Stack.Screen name='tracking/[bookingId]' />
        <Stack.Screen name='chat/[bookingId]' />
        <Stack.Screen name='review/[bookingId]' />
        <Stack.Screen name='trip-requests/[tripId]' />
        <Stack.Screen name='traveler-booking/[bookingId]' />
        <Stack.Screen name='notifications' />
        <Stack.Screen name='conversations' />
        <Stack.Screen name='activity' />
      </Stack>
    </StripeProvider>
  )
}

import { Stack } from 'expo-router'

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name='parcel-declare' />
      <Stack.Screen name='payment' />
      <Stack.Screen name='tracking/[bookingId]' />
      <Stack.Screen name='chat/[bookingId]' />
      <Stack.Screen name='review/[bookingId]' />
      <Stack.Screen name='trip-requests/[tripId]' />
      <Stack.Screen name='traveler-booking/[bookingId]' />
      <Stack.Screen name='payment-success' />
      <Stack.Screen name='activity' />
      <Stack.Screen name='edit-profile' />
      <Stack.Screen name='language' />
    </Stack>
  )
}

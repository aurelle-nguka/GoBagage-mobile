import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { useAuthStore } from '../../store/auth.store'

export default function AdminLayout() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user && !user.roles.includes('ADMIN')) {
      router.replace('/(tabs)/')
    }
    if (!user) {
      router.replace('/(auth)/login')
    }
  }, [user])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='dashboard' />
      <Stack.Screen name='kyc-queue' />
      <Stack.Screen name='corridors' />
    </Stack>
  )
}

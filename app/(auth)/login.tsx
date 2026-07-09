/**
 * Go Bagage — Page Login
 * Redirige vers /(admin)/dashboard si ADMIN, sinon /(tabs)/
 */

import { useRouter, useLocalSearchParams } from 'expo-router'
import { LoginScreen } from '../../features/auth/screens/LoginScreen'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

export default function LoginPage() {
  const router = useRouter()
  const { role } = useLocalSearchParams<{ role?: RoleChoice }>()

  return (
    <LoginScreen
      role={role}
      onLoginSuccess={(isAdmin: boolean) => {
        if (isAdmin) {
          router.replace('/(admin)/dashboard')
        } else {
          router.replace('/(tabs)/')
        }
      }}
      onForgotPassword={() => router.push('/(auth)/forgot-password')}
      onCreateAccount={() =>
        router.push({
          pathname: '/(auth)/register',
          params: { role: role ?? 'BOTH' },
        })
      }
    />
  )
}

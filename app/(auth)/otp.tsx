import { useRouter, useLocalSearchParams } from 'expo-router'
import { OtpScreen } from '../../features/auth/screens/OtpScreen'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

export default function OtpPage() {
  const router = useRouter()
  const { role, phone } = useLocalSearchParams<{
    role: RoleChoice
    phone: string
  }>()

  return (
    <OtpScreen
      role={role ?? 'BOTH'}
      phone={phone ?? ''}
      onBack={() => router.back()}
      onSuccess={() =>
        router.replace({
          pathname: '/(auth)/login',
          params: { role },
        })
      }
    />
  )
}

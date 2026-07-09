import { useRouter, useLocalSearchParams } from 'expo-router'
import { KycUploadScreen } from '../../features/auth/screens/KycUploadScreen'
import { useAuthStore } from '../../store/auth.store'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

export default function KycPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const { role } = useLocalSearchParams<{ role: RoleChoice }>()

  return (
    <KycUploadScreen
      role={role ?? 'BOTH'}
      kycStatus={user?.kycStatus}
      onBack={() => router.back()}
      onSuccess={() => router.push('/(auth)/kyc-pending')}
      onSkip={() => router.replace('/(tabs)/')}
    />
  )
}

import { useMemo } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { KycUploadScreen } from '../../features/auth/screens/KycUploadScreen'
import { useAuthStore } from '../../store/auth.store'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

export default function KycPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const params = useLocalSearchParams<{ role?: RoleChoice }>()

  const resolvedRole: RoleChoice = useMemo(() => {
    if (params.role) return params.role
    if (user?.roles && user.roles.length > 0) {
      const isTraveler = user.roles.includes('TRAVELER')
      const isSender = user.roles.includes('SENDER')
      if (isTraveler && isSender) return 'BOTH'
      if (isTraveler) return 'TRAVELER'
      if (isSender) return 'SENDER'
    }
    return 'BOTH'
  }, [params.role, user?.roles])

  return (
    <KycUploadScreen
      role={resolvedRole}
      kycStatus={user?.kycStatus}
      onBack={() => router.back()}
      onSuccess={() => router.push('/(auth)/kyc-pending')}
      onSkip={() => router.replace('/(tabs)/')}
    />
  )
}

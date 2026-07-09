import { useRouter } from 'expo-router'
import { useKycGuard } from '../../shared/hooks/useKycGuard'
import { KycGateBanner } from '../../shared/components/feedback/KycGateBanner'
import { PublishTripScreen } from '../../features/trips/screens/PublishTripScreen'

export default function PublishPage() {
  const router = useRouter()
  const { canTransact, kycStatus } = useKycGuard()

  if (!canTransact) {
    return (
      <KycGateBanner
        kycStatus={kycStatus}
        onGoToKyc={() => router.push('/(auth)/kyc')}
      />
    )
  }

  return (
    <PublishTripScreen
      onBack={() => router.back()}
      onSuccess={() => router.replace('/(tabs)/')}
    />
  )
}

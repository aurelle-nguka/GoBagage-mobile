import { useRouter, useLocalSearchParams } from 'expo-router'
import { PaymentScreen } from '../../features/payments/screens/PaymentScreen'
import type { PaymentProvider } from '../../features/payments/types/payment.types'

export default function PaymentPage() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    bookingId: string
    travelerId: string
    from?: string
    to?: string
    travelerName?: string
    departureDate?: string
    pricePerKg: string
    weight: string
  }>()

  return (
    <PaymentScreen
      bookingId={params.bookingId}
      from={params.from ?? 'Montreal'}
      to={params.to ?? 'Douala'}
      travelerName={params.travelerName ?? 'your traveler'}
      departureDate={params.departureDate ?? ''}
      weightKg={Number(params.weight)}
      pricePerKg={Number(params.pricePerKg)}
      onBack={() => router.back()}
      onSuccess={(_provider: PaymentProvider) => {
        router.replace({
          pathname: '/(modals)/tracking',
          params: { bookingId: params.bookingId },
        })
      }}
    />
  )
}

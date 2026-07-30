import { useRouter, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { PaymentScreen } from '../../features/payments/screens/PaymentScreen'
import type { PaymentProvider } from '../../features/payments/types/payment.types'
import { calculateCommission } from '../../shared/utils/currency.utils'

export default function PaymentPage() {
  const { t } = useTranslation()
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

  const subtotalBase = Number(params.weight) * Number(params.pricePerKg)
  const { total } = calculateCommission(subtotalBase)

  return (
    <PaymentScreen
      bookingId={params.bookingId}
      from={params.from ?? 'Montreal'}
      to={params.to ?? 'Douala'}
      travelerName={
        params.travelerName ?? t('payment.traveler_fallback', 'Your traveler')
      }
      departureDate={params.departureDate ?? ''}
      weightKg={Number(params.weight)}
      pricePerKg={Number(params.pricePerKg)}
      onBack={() => router.back()}
      onSuccess={(_provider: PaymentProvider) => {
        router.replace({
          pathname: '/(modals)/payment-success',
          params: {
            bookingId: params.bookingId,
            amount: String(total),
            from: params.from ?? '',
            to: params.to ?? '',
            travelerName: params.travelerName ?? '',
          },
        })
      }}
    />
  )
}

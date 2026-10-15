import { useRouter, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { PaymentSuccessScreen } from '../../features/payments/screens/PaymentSuccessScreen'

export default function PaymentSuccessPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useLocalSearchParams<{
    bookingId: string
    amount: string
    from: string
    to: string
    travelerName: string
  }>()

  return (
    <PaymentSuccessScreen
      amount={Number(params.amount)}
      from={params.from ?? 'Unknown'}
      to={params.to ?? 'Unknown'}
      travelerName={
        params.travelerName ?? t('payment.traveler_fallback', 'Your traveler')
      }
      onTrack={() =>
        router.replace({
          pathname: '/(modals)/tracking',
          params: { bookingId: params.bookingId },
        })
      }
    />
  )
}

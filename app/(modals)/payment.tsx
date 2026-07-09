/**
 * Go Bagage — Modale Payment
 */

import { useRouter, useLocalSearchParams } from 'expo-router'
import { PaymentScreen } from '../../features/payments/screens/PaymentScreen'

export default function PaymentPage() {
  const router = useRouter()
  const params = useLocalSearchParams<{
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
      from={params.from ?? 'Montreal'}
      to={params.to ?? 'Douala'}
      travelerName={params.travelerName ?? 'your traveler'}
      departureDate={params.departureDate ?? ''}
      weightKg={Number(params.weight)}
      pricePerKg={Number(params.pricePerKg)}
      onBack={() => router.back()}
      onSuccess={(provider) => {
        // TODO: créer le booking + initier le paiement réel via payments.api.ts
        // puis rediriger vers le tracking du booking nouvellement créé
        router.replace('/(tabs)/')
      }}
    />
  )
}

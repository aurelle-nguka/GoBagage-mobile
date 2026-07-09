/**
 * Go Bagage — Modale Declare Parcel
 */

import { useRouter, useLocalSearchParams } from 'expo-router'

import { useAuthStore } from '../../store/auth.store'
import { DeclareParcelScreen } from '../../features/parcels/screens/DeclareParcelScree'

export default function ParcelDeclarePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const params = useLocalSearchParams<{
    travelerId: string
    initials: string
    name: string
    from: string
    to: string
    departureDate: string
    pricePerKg: string
    availableKg: string
  }>()

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User'

  return (
    <DeclareParcelScreen
      traveler={{
        initials: params.initials,
        name: params.name,
        from: params.from,
        to: params.to,
        departureDate: params.departureDate,
        pricePerKg: Number(params.pricePerKg),
        availableKg: Number(params.availableKg),
      }}
      currentUserFullName={fullName}
      onBack={() => router.back()}
      onContinueToPayment={(parcel) => {
        // TODO: créer le colis via l'API avant de transmettre son id réel au paiement
        router.push({
          pathname: '/(modals)/payment',
          params: {
            travelerId: params.travelerId,
            from: params.from,
            to: params.to,
            travelerName: params.name,
            departureDate: params.departureDate,
            pricePerKg: params.pricePerKg,
            weight: String(parcel.estimatedWeight),
          },
        })
      }}
    />
  )
}

import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuthStore } from '../../store/auth.store'
import { DeclareParcelScreen } from '../../features/parcels/screens/DeclareParcelScree'

export default function ParcelDeclarePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const params = useLocalSearchParams<{
    tripId: string
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
        tripId: params.tripId,
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
      onSuccess={(bookingId) => {
        router.push({
          pathname: '/(modals)/payment',
          params: {
            bookingId,
            travelerId: params.travelerId,
            from: params.from,
            to: params.to,
            travelerName: params.name,
            departureDate: params.departureDate,
            pricePerKg: params.pricePerKg,
            weight: params.availableKg,
          },
        })
      }}
    />
  )
}

import { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReviewScreen } from '../../../features/reviews/screens/ReviewScreen'
import { useSubmitReview } from '../../../features/reviews/hooks/useSubmitReview'
import { getBooking } from '../../../features/bookings/api/bookings.api'
import { Colors } from '../../../theme'
import { BookingDTO } from '../../../features/bookings/types/booking.type'

export default function ReviewPage() {
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  const [booking, setBooking] = useState<BookingDTO | null>(null)
  const [loading, setLoading] = useState(true)

  const { submit } = useSubmitReview()

  useEffect(() => {
    getBooking(bookingId)
      .then((data) => setBooking(data))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false))
  }, [bookingId])

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </SafeAreaView>
    )
  }

  const b = booking as any
  const traveler = b?.traveler ?? b?.trip?.traveler
  const corridor = b?.trip?.corridor

  const travelerName = traveler
    ? `${traveler.firstName} ${traveler.lastNameInitial}.`
    : 'Your traveler'

  const travelerInitials = traveler
    ? `${(traveler.firstName ?? 'T')[0]}${traveler.lastNameInitial ?? ''}`.toUpperCase()
    : 'T'

  const releasedAmount = b?.travelerAmountCad ?? 0

  return (
    <ReviewScreen
      corridor={corridor}
      departureDate={b?.trip?.departureDate ?? ''}
      releasedAmount={releasedAmount}
      revieweeInitials={travelerInitials}
      revieweeName={travelerName}
      revieweeContext={corridor ? `Your traveler on ${corridor.departureCity} - ${corridor.arrivalCity}` : 'Your traveler'}
      onBack={() => router.back()}
      onSubmit={async ({ rating, badges, comment }) => {
        if (!booking || !traveler) return

        const ok = await submit({
          bookingId: Number(bookingId),
          revieweeId: traveler.id,
          rating,
          comment: comment || undefined,
          badges,
        })

        if (ok) {
          router.replace('/(tabs)/')
        }
      }}
    />
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
})

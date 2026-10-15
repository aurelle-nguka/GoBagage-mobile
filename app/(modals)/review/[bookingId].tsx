import { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ReviewScreen } from '../../../features/reviews/screens/ReviewScreen'
import { useSubmitReview } from '../../../features/reviews/hooks/useSubmitReview'
import { getBooking } from '../../../features/bookings/api/bookings.api'
import { Colors } from '../../../theme'
import { BookingDTO } from '../../../features/bookings/types/booking.type'

export default function ReviewPage() {
  const { t } = useTranslation()
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

  const routeLabel = corridor
    ? `${corridor.departureCity} → ${corridor.arrivalCity}`
    : t('review.your_trip_fallback', 'Your trip')

  const travelerName = traveler
    ? `${traveler.firstName} ${traveler.lastNameInitial}.`
    : t('review.your_traveler_fallback', 'Your traveler')

  const travelerInitials = traveler
    ? `${(traveler.firstName ?? 'T')[0]}${traveler.lastNameInitial ?? ''}`.toUpperCase()
    : 'T'

  const releasedAmount = b?.travelerAmountCad ?? 0

  return (
    <ReviewScreen
      routeLabel={routeLabel}
      departureDate={b?.trip?.departureDate ?? ''}
      releasedAmount={releasedAmount}
      revieweeInitials={travelerInitials}
      revieweeName={travelerName}
      revieweeContext={t('review.traveler_on_route', 'Your traveler on {{route}}', {
        route: routeLabel,
      })}
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

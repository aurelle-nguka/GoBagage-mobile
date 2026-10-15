import { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { TravelerBookingScreen } from '../../../features/bookings/screens/TravelerBookingScreen'
import { useBookingActions } from '../../../features/bookings/hooks/useBookingActions'
import { getBooking } from '../../../features/bookings/api/bookings.api'
import { Colors, FontSize, Spacing } from '../../../theme'
import { BookingDTO } from '../../../features/bookings/types/booking.type'

export default function TravelerBookingPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  const [booking, setBooking] = useState<BookingDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { pickUp, deliver, loading: actionLoading } = useBookingActions()

  const load = async () => {
    setLoading(true)
    try {
      const data = await getBooking(bookingId)
      console.log('=== BOOKING DETAIL ===', JSON.stringify(data))
      setBooking(data)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          t('booking.errors.load_failed', 'Failed to load booking.'),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [bookingId])

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </SafeAreaView>
    )
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>
          {error || t('booking.errors.not_found', 'Booking not found.')}
        </Text>
      </SafeAreaView>
    )
  }

  const b = booking as any
  const sender = b.sender
  const parcel = b.parcel
  const corridor = b.trip?.corridor

  const senderName = sender
    ? `${sender.firstName} ${sender.lastNameInitial}.`.trim()
    : `Sender #${booking.senderId}`
  const senderInitials = sender
    ? `${(sender.firstName ?? 'S')[0]}${sender.lastNameInitial ?? ''}`.toUpperCase()
    : 'S?'

  return (
    <TravelerBookingScreen
      from={corridor?.departureCity ?? 'Unknown'}
      to={corridor?.arrivalCity ?? 'Unknown'}
      departureDate={b.trip?.departureDate ?? ''}
      status={booking.status}
      parcel={{
        description: parcel?.description ?? 'Parcel',
        category: parcel?.category ?? 'OTHER',
        weightKg: booking.requestedKg ?? 0,
        recipientName: parcel?.recipientName ?? 'Recipient',
      }}
      sender={{
        initials: senderInitials,
        name: senderName,
      }}
      onBack={() => router.back()}
      onChat={() => router.push(`/(modals)/chat/${bookingId}`)}
      onMarkPickedUp={async () => {
        const result = await pickUp(bookingId)
        if (result) setBooking({ ...booking, status: 'PICKED_UP' })
      }}
      onMarkDelivered={async () => {
        const result = await deliver(bookingId)
        if (result) setBooking({ ...booking, status: 'DELIVERED' })
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
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
})

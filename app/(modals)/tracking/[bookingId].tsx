import { useRouter, useLocalSearchParams } from 'expo-router'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { TrackingScreen } from '../../../features/bookings/screens/TrackingScreen'
import { useBookingTracking } from '../../../features/bookings/hooks/useBookingTracking'
import { Colors, FontSize, Spacing } from '../../../theme'

export default function TrackingPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  const { data, loading, error, confirming, confirm } =
    useBookingTracking(bookingId)

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </SafeAreaView>
    )
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>
          {error || t('booking.errors.not_found', 'Booking not found.')}
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <TrackingScreen
      from={data.from}
      to={data.to}
      departureDate={data.departureDate}
      status={data.status}
      paymentStatus={data.paymentStatus}
      progressPercent={data.progressPercent}
      parcel={data.parcel}
      traveler={data.traveler}
      onBack={() => router.back()}
      onChat={() => router.push(`/(modals)/chat/${bookingId}`)}
      onCall={() => {}}
      onReportProblem={() => router.push(`/(modals)/dispute/${bookingId}`)}
      onConfirmDelivery={async () => {
        const ok = await confirm()
        if (ok) {
          router.replace({
            pathname: '/(modals)/review',
            params: { bookingId },
          })
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
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
})

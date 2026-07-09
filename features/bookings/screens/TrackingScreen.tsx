/**
 * Go Bagage — TrackingScreen
 * Suivi en temps réel du colis (CDC section 6.3 — "Suivi en temps réel du statut du colis").
 * Migré depuis Tracking.tsx (maquette web) → React Native.
 */

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { BookingStatus } from '../types/booking.type'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { TrackingMapPlaceholder } from '../components/TrackingMapPlaceholder'
import { TrackingTimeline } from '../components/TrackingTimeline'
import { PackageDetailsCard } from '../components/PackageDetailsCard'
import { TravelerContactCard } from '../components/TravelerContactCard'
import { ConfirmDeliveryButton } from '../components/ConfirmDeliveryButton'

interface TrackingScreenProps {
  from: string
  to: string
  departureDate: string
  status: BookingStatus
  progressPercent: number
  parcel: {
    description: string
    category: string
    weightKg: number
    recipientName: string
  }
  traveler: {
    initials: string
    name: string
    rating: number
    reviewCount: number
    verified: boolean
  }
  onBack: () => void
  onChat: () => void
  onCall: () => void
  onConfirmDelivery: () => void
}

// TODO: remplacer par features/bookings/hooks/useBookingTracking(bookingId)
const TIMELINE_STEPS = [
  {
    status: 'ACCEPTED' as BookingStatus,
    label: 'Booking confirmed',
    sublabel: 'Jun 13, 2026 at 10:32 AM',
  },
  {
    status: 'PICKED_UP' as BookingStatus,
    label: 'Package picked up',
    sublabel: 'Jun 16, 2026 · Montreal Airport',
  },
  {
    status: 'IN_TRANSIT' as BookingStatus,
    label: 'In transit',
    sublabel: 'Currently in flight — ETA Jun 18',
  },
  {
    status: 'DELIVERED' as BookingStatus,
    label: 'Delivered to recipient',
    sublabel: 'Pending arrival',
  },
  {
    status: 'CONFIRMED' as BookingStatus,
    label: 'Payment released',
    sublabel: 'After delivery confirmation',
  },
]

export function TrackingScreen({
  from,
  to,
  departureDate,
  status,
  progressPercent,
  parcel,
  traveler,
  onBack,
  onChat,
  onCall,
  onConfirmDelivery,
}: TrackingScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <Text style={styles.headerSubtitle}>
            {from} → {to} · {departureDate}
          </Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <TrackingMapPlaceholder
          from={from}
          to={to}
          progressPercent={progressPercent}
          statusLabel={`🔄 In Transit — ${progressPercent}% complete`}
        />

        <View style={styles.content}>
          <TrackingTimeline steps={TIMELINE_STEPS} currentStatus={status} />

          <PackageDetailsCard
            description={parcel.description}
            category={parcel.category}
            weightKg={parcel.weightKg}
            recipientName={parcel.recipientName}
          />

          <TravelerContactCard
            initials={traveler.initials}
            name={traveler.name}
            rating={traveler.rating}
            reviewCount={traveler.reviewCount}
            verified={traveler.verified}
            onChat={onChat}
            onCall={onCall}
          />

          <ConfirmDeliveryButton
            status={status}
            onConfirm={onConfirmDelivery}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  liveText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
  },
})

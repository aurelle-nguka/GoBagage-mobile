import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Router } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { BookingStatus } from '../types/booking.type'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { TrackingMapPlaceholder } from '../components/TrackingMapPlaceholder'
import { TrackingTimeline } from '../components/TrackingTimeline'
import { PackageDetailsCard } from '../components/PackageDetailsCard'
import { TravelerContactCard } from '../components/TravelerContactCard'
import { ConfirmDeliveryButton } from '../components/ConfirmDeliveryButton'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

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

const TIMELINE_STEPS = (t: (key: string) => string) => [
  {
    status: 'ACCEPTED' as BookingStatus,
    label: t('tracking.step_confirmed'),
    sublabel: t('tracking.step_confirmed_sub'),
  },
  {
    status: 'PICKED_UP' as BookingStatus,
    label: t('tracking.step_pickup'),
    sublabel: t('tracking.step_pickup_sub'),
  },
  {
    status: 'IN_TRANSIT' as BookingStatus,
    label: t('tracking.step_transit'),
    sublabel: t('tracking.step_transit_sub'),
  },
  {
    status: 'DELIVERED' as BookingStatus,
    label: t('tracking.step_delivered'),
    sublabel: t('tracking.step_delivered_sub'),
  },
  {
    status: 'CONFIRMED' as BookingStatus,
    label: t('tracking.step_released'),
    sublabel: t('tracking.step_released_sub'),
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
  const { t } = useTranslation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>
            {t('tracking.title', 'Live Tracking')}
          </Text>
          <Text style={styles.headerSubtitle}>
            <RouteLabel from={from} to={to} /> . {departureDate}
          </Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{t('tracking.live', 'Live')}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <TrackingMapPlaceholder
          from={from}
          to={to}
          progressPercent={progressPercent}
          statusLabel={t('tracking.in_transit', { percent: progressPercent })}
        />

        <View style={styles.content}>
          <TrackingTimeline steps={TIMELINE_STEPS(t)} currentStatus={status} />
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
  },
  headerTextBlock: { flex: 1 },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
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
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing[5], paddingTop: Spacing[5] },
})

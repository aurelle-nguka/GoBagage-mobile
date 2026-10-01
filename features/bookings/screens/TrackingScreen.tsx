import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
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

  const statusKey = (status || '').toLowerCase()
  const statusTranslated = t(`booking.status.${statusKey}`, {
    defaultValue: status,
  })

  const timelineSteps = [
    {
      status: 'ACCEPTED' as BookingStatus,
      label: t('tracking.step_accepted', {
        defaultValue: 'Réservation confirmée',
      }),
      sublabel: t('tracking.step_accepted_sub', {
        defaultValue: 'Demande acceptée',
      }),
    },
    {
      status: 'PICKED_UP' as BookingStatus,
      label: t('tracking.step_picked_up', { defaultValue: 'Colis récupéré' }),
      sublabel: t('tracking.step_picked_up_sub', {
        defaultValue: 'Colis pris en charge par le voyageur',
      }),
    },
    {
      status: 'IN_TRANSIT' as BookingStatus,
      label: t('tracking.step_in_transit', { defaultValue: 'En transit' }),
      sublabel: t('tracking.step_in_transit_sub', {
        defaultValue: 'Pendant le voyage',
      }),
    },
    {
      status: 'DELIVERED' as BookingStatus,
      label: t('tracking.step_delivered', {
        defaultValue: 'Livré au destinataire',
      }),
      sublabel: t('tracking.step_delivered_sub', {
        defaultValue: 'Colis remis en main propre',
      }),
    },
    {
      status: 'CONFIRMED' as BookingStatus,
      label: t('tracking.step_confirmed', { defaultValue: 'Paiement libéré' }),
      sublabel: t('tracking.step_confirmed_sub', {
        defaultValue: 'Après confirmation de livraison',
      }),
    },
  ]

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
          <Text style={styles.headerTitle}>
            {t('tracking.title', { defaultValue: 'Suivi en Direct' })}
          </Text>
          <RouteLabel
            from={from}
            to={to}
            suffix={` · ${departureDate}`}
            size='xs'
            color='#a7f3d0'
            arrowColor='#a7f3d0'
            fontWeight='normal'
          />
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>
            {t('tracking.live', { defaultValue: 'En Direct' })}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <TrackingMapPlaceholder
          from={from}
          to={to}
          progressPercent={progressPercent}
          statusLabel={`🔄 ${statusTranslated} — ${progressPercent}% ${t('tracking.complete', { defaultValue: 'complété' })}`}
        />

        <View style={styles.content}>
          <TrackingTimeline steps={timelineSteps} currentStatus={status} />

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

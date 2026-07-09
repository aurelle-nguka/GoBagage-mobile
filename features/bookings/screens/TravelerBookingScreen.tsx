/**
 * Go Bagage — TravelerBookingScreen
 * Vue voyageur d'une réservation acceptée : timeline + détails colis + actions de progression.
 * Symétrique de TrackingScreen (vue expéditeur), mais avec des actions au lieu d'un bouton confirm.
 * Écran absent de la maquette — complète le parcours voyageur défini au CDC section 3.1, étapes 5-7.
 */

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, MessageCircle } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { TrackingTimeline } from '../components/TrackingTimeline'
import { PackageDetailsCard } from '../components/PackageDetailsCard'
import { BookingStatus } from '../types/booking.type'
import { TravelerActionButton } from '../components/TravelerActionButton'

interface TravelerBookingScreenProps {
  from: string
  to: string
  departureDate: string
  status: BookingStatus
  parcel: {
    description: string
    category: string
    weightKg: number
    recipientName: string
  }
  sender: {
    initials: string
    name: string
  }
  onBack: () => void
  onChat: () => void
  onMarkPickedUp: () => void
  onMarkDelivered: () => void
}

// Réutilise le même référentiel d'étapes que la vue expéditeur (TrackingScreen)
const TIMELINE_STEPS = [
  {
    status: 'ACCEPTED' as BookingStatus,
    label: 'Booking confirmed',
    sublabel: 'You accepted this request',
  },
  {
    status: 'PICKED_UP' as BookingStatus,
    label: 'Package picked up',
    sublabel: 'Confirm once you have the parcel',
  },
  {
    status: 'IN_TRANSIT' as BookingStatus,
    label: 'In transit',
    sublabel: 'During your flight',
  },
  {
    status: 'DELIVERED' as BookingStatus,
    label: 'Delivered to recipient',
    sublabel: 'Confirm once handed over',
  },
  {
    status: 'CONFIRMED' as BookingStatus,
    label: 'Payment released',
    sublabel: 'After sender confirmation',
  },
]

export function TravelerBookingScreen({
  from,
  to,
  departureDate,
  status,
  parcel,
  sender,
  onBack,
  onChat,
  onMarkPickedUp,
  onMarkDelivered,
}: TravelerBookingScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <Text style={styles.headerSubtitle}>
            {from} → {to} · {departureDate}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={onChat}
          activeOpacity={0.8}
        >
          <MessageCircle size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.senderBanner}>
          <View style={styles.senderAvatar}>
            <Text style={styles.senderAvatarText}>{sender.initials}</Text>
          </View>
          <Text style={styles.senderText}>Sender: {sender.name}</Text>
        </View>

        <TrackingTimeline steps={TIMELINE_STEPS} currentStatus={status} />

        <PackageDetailsCard
          description={parcel.description}
          category={parcel.category}
          weightKg={parcel.weightKg}
          recipientName={parcel.recipientName}
        />

        <TravelerActionButton
          status={status}
          onMarkPickedUp={onMarkPickedUp}
          onMarkDelivered={onMarkDelivered}
        />
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
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  chatButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
  },
  senderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing[3],
    marginBottom: Spacing[4],
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderAvatarText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
  },
  senderText: {
    fontSize: FontSize.base,
    color: Colors.foreground,
    fontWeight: FontWeight.medium,
  },
})

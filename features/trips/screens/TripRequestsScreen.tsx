/**
 * Go Bagage — TripRequestsScreen
 * Détail d'un trajet + liste des demandes de réservation reçues (CDC section 6.2/9.5).
 * Écran absent de la maquette — construit à partir du parcours utilisateur du CDC :
 * "Le voyageur (A) accepte" (étape 4 du parcours, section 3.1).
 */

import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { TripDetailSummary } from '../components/TripDetailSummary'
import { BookingRequestCard } from '../components/BookingRequestCard'
import { BookingStatus } from '../../bookings/types/booking.type'

// TODO: remplacer par features/bookings/hooks/useTripRequests(tripId) → GET /bookings?tripId=
interface RequestListItem {
  id: string
  senderInitials: string
  senderName: string
  senderRating: number
  senderVerified: boolean
  parcelDescription: string
  weightKg: number
  amount: number
  status: BookingStatus
}

const MOCK_REQUESTS: RequestListItem[] = [
  {
    id: 'b1',
    senderInitials: 'ML',
    senderName: 'Marie Laurent',
    senderRating: 4.7,
    senderVerified: true,
    parcelDescription: 'Clothing & family gifts',
    weightKg: 4,
    amount: 53.76,
    status: 'PENDING',
  },
  {
    id: 'b2',
    senderInitials: 'JD',
    senderName: 'Jean Diallo',
    senderRating: 4.5,
    senderVerified: true,
    parcelDescription: 'Documents',
    weightKg: 1.5,
    amount: 20.16,
    status: 'PENDING',
  },
  {
    id: 'b3',
    senderInitials: 'SK',
    senderName: 'Sarah Kone',
    senderRating: 4.9,
    senderVerified: false,
    parcelDescription: 'Electronics',
    weightKg: 3,
    amount: 40.32,
    status: 'ACCEPTED',
  },
]

interface TripRequestsScreenProps {
  tripId: string
  from: string
  to: string
  departureDate: string
  availableKg: number
  onBack: () => void
  onOpenBooking: (bookingId: string) => void
}

export function TripRequestsScreen({
  from,
  to,
  departureDate,
  availableKg,
  onBack,
  onOpenBooking,
}: TripRequestsScreenProps) {
  const [requests, setRequests] = useState(MOCK_REQUESTS)

  const bookedKg = requests
    .filter((r) => r.status === 'ACCEPTED')
    .reduce((sum, r) => sum + r.weightKg, 0)

  const handleAccept = (id: string) => {
    // TODO: brancher features/bookings/api/bookings.api.ts → PATCH /bookings/{id}/accept
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'ACCEPTED' as BookingStatus } : r,
      ),
    )
  }

  const handleReject = (id: string) => {
    // TODO: brancher features/bookings/api/bookings.api.ts → PATCH /bookings/{id}/reject
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'REJECTED' as BookingStatus } : r,
      ),
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Trip Requests</Text>
      </View>

      <TripDetailSummary
        from={from}
        to={to}
        departureDate={departureDate}
        availableKg={availableKg}
        bookedKg={bookedKg}
      />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BookingRequestCard
            senderInitials={item.senderInitials}
            senderName={item.senderName}
            senderRating={item.senderRating}
            senderVerified={item.senderVerified}
            parcelDescription={item.parcelDescription}
            weightKg={item.weightKg}
            amount={item.amount}
            status={item.status}
            onAccept={() => handleAccept(item.id)}
            onReject={() => handleReject(item.id)}
            onPress={() => onOpenBooking(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No booking requests yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  navTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  listContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[6],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
  },
})

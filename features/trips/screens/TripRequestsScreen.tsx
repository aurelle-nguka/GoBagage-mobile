import { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Inbox } from 'lucide-react-native'
import { useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { TripDetailSummary } from '../components/TripDetailSummary'
import { BookingRequestCard } from '../components/BookingRequestCard'
import { useBookingActions } from '../../bookings/hooks/useBookingActions'
import apiClient from '../../../shared/services/api.client'
import { BookingStatus } from '../../bookings/types/booking.type'

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
  tripId,
  from,
  to,
  departureDate,
  availableKg,
  onBack,
  onOpenBooking,
}: TripRequestsScreenProps) {
  const { t } = useTranslation()
  const [requests, setRequests] = useState<RequestListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const { accept, reject, loading: actionLoading } = useBookingActions()

  const loadRequests = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError('')

      try {
        console.log('=== LOAD REQUESTS ===')
        console.log('tripId:', tripId)
        const response = await apiClient.get('/bookings', {
          params: { tripId },
        })
        console.log('status:', response.status)
        console.log('data:', JSON.stringify(response.data))

        const raw = Array.isArray(response.data)
          ? response.data
          : (response.data?.content ?? [])

        console.log('premier booking:', JSON.stringify(raw[0]))
        console.log(
          'tous les bookings:',
          raw.map((b: any) => ({
            id: b.id,
            status: b.status,
            tripId: b.tripId,
          })),
        )

        const mapped: RequestListItem[] = raw.map((booking: any) => {
          const sender = booking.sender
          const parcel = booking.parcel

          return {
            id: String(booking.id),
            senderInitials: sender
              ? `${(sender.firstName ?? 'S')[0]}${sender.lastNameInitial ?? ''}`.toUpperCase()
              : 'S?',
            senderName: sender
              ? `${sender.firstName ?? ''} ${sender.lastNameInitial ?? ''}`.trim()
              : `Sender #${booking.senderId}`,
            senderRating: sender?.averageRating ?? 0,
            senderVerified: sender?.kycVerified ?? false,
            parcelDescription: parcel?.description ?? 'Parcel',
            weightKg: booking.requestedKg ?? 0,
            amount: booking.totalAmountCad ?? 0,
            status: booking.status ?? 'PENDING',
          }
        })

        setRequests(mapped)
      } catch (err: any) {
        console.log(
          '❌ Error:',
          err?.response?.status,
          JSON.stringify(err?.response?.data),
        )
        setError(
          err?.response?.data?.message ??
            t('trip.errors.load_requests_failed', 'Failed to load booking requests.'),
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [tripId, t],
  )

  useFocusEffect(
    useCallback(() => {
      loadRequests()
    }, [loadRequests]),
  )

  const handleAccept = async (id: string) => {
    Alert.alert(
      t('booking.accept_title', 'Accept Booking'),
      t('booking.accept_msg', 'Are you sure you want to accept this booking request?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('booking.accept', 'Accept'),
          onPress: async () => {
            const result = await accept(id)
            if (result) {
              setRequests((prev) =>
                prev.map((r) =>
                  r.id === id ? { ...r, status: 'ACCEPTED' } : r,
                ),
              )
            }
          },
        },
      ],
    )
  }

  const handleReject = async (id: string) => {
    Alert.alert(
      t('booking.reject_title', 'Reject Booking'),
      t('booking.reject_msg', 'Are you sure you want to reject this booking request?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('booking.reject', 'Reject'),
          style: 'destructive',
          onPress: async () => {
            const result = await reject(id)
            if (result) {
              setRequests((prev) =>
                prev.map((r) =>
                  r.id === id ? { ...r, status: 'REJECTED' } : r,
                ),
              )
            }
          },
        },
      ],
    )
  }

  const bookedKg = requests
    .filter((r) => r.status === 'ACCEPTED')
    .reduce((sum, r) => sum + r.weightKg, 0)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.navTitle}>{t('trip.requests_title', 'Trip Requests')}</Text>
          <Text style={styles.navSubtitle}>
            {t('trip.requests_count', { count: requests.length })}
          </Text>
        </View>
      </View>

      <TripDetailSummary
        from={from}
        to={to}
        departureDate={departureDate}
        availableKg={availableKg}
        bookedKg={bookedKg}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadRequests(true)}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
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
              onAccept={
                item.status === 'AWAITING_ACCEPTANCE'
                  ? () => handleAccept(item.id)
                  : undefined
              }
              onReject={
                item.status === 'AWAITING_ACCEPTANCE'
                  ? () => handleReject(item.id)
                  : undefined
              }
              onPress={() => onOpenBooking(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Inbox size={48} color='#d1d5db' />
              <Text style={styles.emptyText}>
                {t('booking.no_requests', 'No booking requests yet')}
              </Text>
              <Text style={styles.emptySubtext}>
                {t(
                  'booking.no_requests_subtitle',
                  'Requests will appear here when senders book your trip.',
                )}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  navTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  navSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  listContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[6],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
  },
  emptyText: {
    color: Colors.foreground,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing[2],
  },
  emptySubtext: {
    color: '#9ca3af',
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
})

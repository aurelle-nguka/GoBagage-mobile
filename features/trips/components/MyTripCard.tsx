/**
 * Go Bagage — MyTripCard
 */

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { TripStatus } from '../types/trip.types'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

const STATUS_CONFIG: Record<
  TripStatus,
  { label: string; bg: string; color: string }
> = {
  OPEN: { label: 'Open', bg: '#f3f4f6', color: Colors.mutedForeground },
  BOOKED: { label: 'Booked', bg: '#e8faf0', color: Colors.primary },
  IN_TRANSIT: { label: 'In Transit', bg: '#e8f4fd', color: Colors.secondary },
  DELIVERED: { label: 'Delivered', bg: '#fff8e8', color: Colors.warning },
  COMPLETED: { label: 'Completed', bg: '#e8faf0', color: Colors.primary },
  CANCELLED: { label: 'Cancelled', bg: '#fef2f2', color: Colors.destructive },
}

interface MyTripCardProps {
  from: string
  to: string
  departureDate: string
  availableKg: number
  status: TripStatus
  pendingRequestsCount: number
  onPress: () => void
}

export function MyTripCard({
  from,
  to,
  departureDate,
  availableKg,
  status,
  pendingRequestsCount,
  onPress,
}: MyTripCardProps) {
  const config = STATUS_CONFIG[status]

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.headerRow}>
        <RouteLabel from={from} to={to} size='md' />
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Text style={[styles.statusText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📅 {departureDate}</Text>
        <Text style={styles.metaText}>⚖️ {availableKg} kg available</Text>
      </View>

      <View style={styles.footerRow}>
        {pendingRequestsCount > 0 ? (
          <View style={styles.requestsBadge}>
            <Text style={styles.requestsText}>
              📩 {pendingRequestsCount} pending request
              {pendingRequestsCount > 1 ? 's' : ''}
            </Text>
          </View>
        ) : (
          <Text style={styles.noRequestsText}>No requests yet</Text>
        )}
        <ChevronRight size={16} color='#d1d5db' />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  statusBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  statusText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing[4],
    marginBottom: Spacing[3],
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  requestsBadge: {
    backgroundColor: '#fff8e8',
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  requestsText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    fontWeight: FontWeight.semibold,
  },
  noRequestsText: {
    fontSize: FontSize.sm,
    color: '#9ca3af',
  },
})

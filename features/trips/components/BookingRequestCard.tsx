/**
 * Go Bagage — BookingRequestCard
 * Carte d'une demande de réservation reçue par le voyageur, avec actions Accept/Reject.
 * Couvre les endpoints CDC : PATCH /bookings/{id}/accept et /reject (section 9.5).
 */

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { CheckCircle, Star } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { BookingStatus } from '../../bookings/types/booking.type'
import { formatCAD } from '../../../shared/utils/currency.utils'

interface BookingRequestCardProps {
  senderInitials: string
  senderName: string
  senderRating: number
  senderVerified: boolean
  parcelDescription: string
  weightKg: number
  amount: number
  status: BookingStatus
  onAccept: () => void
  onReject: () => void
  onPress: () => void
}

export function BookingRequestCard({
  senderInitials,
  senderName,
  senderRating,
  senderVerified,
  parcelDescription,
  weightKg,
  amount,
  status,
  onAccept,
  onReject,
  onPress,
}: BookingRequestCardProps) {
  const isPending = status === 'PENDING'

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{senderInitials}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{senderName}</Text>
            {senderVerified && <CheckCircle size={12} color={Colors.primary} />}
          </View>
          <View style={styles.ratingRow}>
            <Star size={11} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.ratingText}>{senderRating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.amount}>{formatCAD(amount)}</Text>
      </View>

      <View style={styles.parcelRow}>
        <Text style={styles.parcelText}>
          📦 {parcelDescription} · {weightKg} kg
        </Text>
      </View>

      {isPending ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={onReject}
            activeOpacity={0.85}
          >
            <Text style={styles.rejectLabel}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={onAccept}
            activeOpacity={0.85}
          >
            <Text style={styles.acceptLabel}>Accept</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.statusRow}>
          <Text
            style={[
              styles.statusLabel,
              {
                color:
                  status === 'REJECTED' ? Colors.destructive : Colors.primary,
              },
            ]}
          >
            {status === 'ACCEPTED'
              ? '✅ Accepted'
              : status === 'REJECTED'
                ? '❌ Declined'
                : status}
          </Text>
        </View>
      )}
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
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  amount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  parcelRow: {
    marginBottom: Spacing[3],
  },
  parcelText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  rejectButton: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#fecaca',
    alignItems: 'center',
  },
  rejectLabel: {
    color: Colors.destructive,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  acceptLabel: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  statusRow: {
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statusLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
})

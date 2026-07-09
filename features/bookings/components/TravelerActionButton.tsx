/**
 * Go Bagage — TravelerActionButton
 * Bouton d'action contextuel pour le voyageur, qui fait progresser le colis dans le workflow :
 * ACCEPTED → (Mark as Picked Up) → PICKED_UP → (Mark as Delivered) → DELIVERED
 * Couvre les endpoints CDC : PATCH /bookings/{id}/picked-up et /delivered (section 9.5).
 */

import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { BookingStatus } from '../types/booking.type'

interface TravelerActionButtonProps {
  status: BookingStatus
  onMarkPickedUp: () => void
  onMarkDelivered: () => void
}

export function TravelerActionButton({
  status,
  onMarkPickedUp,
  onMarkDelivered,
}: TravelerActionButtonProps) {
  if (status === 'ACCEPTED') {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={onMarkPickedUp}
        activeOpacity={0.85}
      >
        <Text style={styles.label}>📦 Mark as Picked Up</Text>
      </TouchableOpacity>
    )
  }

  if (status === 'PICKED_UP' || status === 'IN_TRANSIT') {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={onMarkDelivered}
        activeOpacity={0.85}
      >
        <Text style={styles.label}>✅ Mark as Delivered</Text>
      </TouchableOpacity>
    )
  }

  // DELIVERED, CONFIRMED, REJECTED, CANCELLED → en attente de l'expéditeur ou terminé
  return (
    <TouchableOpacity
      style={[styles.button, styles.buttonDisabled]}
      disabled
      activeOpacity={1}
    >
      <Text style={styles.labelDisabled}>
        {status === 'DELIVERED' ? '⏳ Waiting for sender confirmation' : status}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[4],
    borderRadius: Radius.xl,
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  buttonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  label: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  labelDisabled: {
    color: '#9ca3af',
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
})

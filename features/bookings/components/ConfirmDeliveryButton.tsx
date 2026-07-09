/**
 * Go Bagage — ConfirmDeliveryButton
 * Bouton de confirmation de réception (CDC étape 7 du parcours, POST /bookings/{id}/confirm).
 * Reste désactivé tant que le statut n'est pas DELIVERED.
 */

import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { BookingStatus } from '../types/booking.type'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface ConfirmDeliveryButtonProps {
  status: BookingStatus
  onConfirm: () => void
}

export function ConfirmDeliveryButton({
  status,
  onConfirm,
}: ConfirmDeliveryButtonProps) {
  const isEnabled = status === 'DELIVERED'

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isEnabled ? styles.buttonEnabled : styles.buttonDisabled,
      ]}
      onPress={onConfirm}
      disabled={!isEnabled}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.label,
          isEnabled ? styles.labelEnabled : styles.labelDisabled,
        ]}
      >
        {isEnabled
          ? '✅ Confirm Delivery'
          : '⏳ Confirm Delivery (available on arrival)'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing[4],
    borderRadius: Radius.xl,
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  buttonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  buttonEnabled: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  labelDisabled: {
    color: '#9ca3af',
  },
  labelEnabled: {
    color: Colors.white,
  },
})

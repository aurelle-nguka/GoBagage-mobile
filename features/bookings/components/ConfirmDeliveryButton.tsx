import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
          ? t('tracking.confirm_delivery', {
              defaultValue: 'Confirmer la Réception',
            })
          : t('tracking.confirm_delivery_pending', {
              defaultValue: 'Confirmer la Réception (disponible à l’arrivée)',
            })}
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

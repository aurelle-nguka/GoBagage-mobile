import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Clock } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { BookingStatus } from '../types/booking.type'

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
      {isEnabled ? (
        <CheckCircle size={18} color={Colors.white} />
      ) : (
        <Clock size={18} color='#9ca3af' />
      )}
      <Text
        style={[
          styles.label,
          isEnabled ? styles.labelEnabled : styles.labelDisabled,
        ]}
      >
        {isEnabled
          ? t('tracking.confirm_delivery', 'Confirm Delivery')
          : t(
              'tracking.confirm_delivery_pending',
              'Confirm Delivery (available on arrival)',
            )}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[4],
    borderRadius: Radius.xl,
    marginBottom: Spacing[6],
  },
  buttonDisabled: { backgroundColor: '#f3f4f6' },
  buttonEnabled: { backgroundColor: Colors.primary },
  label: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  labelDisabled: { color: '#9ca3af' },
  labelEnabled: { color: Colors.white },
})

import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'
import { Package, CheckCircle, Clock } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const handlePickedUp = () => {
    Alert.alert(t('booking.confirm_pickup'), t('booking.confirm_pickup_msg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('booking.yes_picked_up', 'Yes, I have it'),
        onPress: onMarkPickedUp,
      },
    ])
  }

  const handleDelivered = () => {
    Alert.alert(
      t('booking.confirm_delivery'),
      t('booking.confirm_delivery_msg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('booking.yes_delivered', 'Yes, delivered'),
          style: 'default',
          onPress: onMarkDelivered,
        },
      ],
    )
  }

  if (status === 'ACCEPTED') {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={handlePickedUp}
        activeOpacity={0.85}
      >
        <Package size={18} color={Colors.white} />
        <Text style={styles.label}>{t('booking.mark_picked_up')}</Text>
      </TouchableOpacity>
    )
  }

  if (status === 'PICKED_UP' || status === 'IN_TRANSIT') {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={handleDelivered}
        activeOpacity={0.85}
      >
        <CheckCircle size={18} color={Colors.white} />
        <Text style={styles.label}>{t('booking.mark_delivered')}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.button, styles.buttonDisabled]}
      disabled
      activeOpacity={1}
    >
      <Clock size={18} color='#9ca3af' />
      <Text style={styles.labelDisabled}>
        {status === 'DELIVERED'
          ? t('booking.waiting_sender')
          : status === 'CONFIRMED'
            ? t('booking.payment_released')
            : status}
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
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[4],
    borderRadius: Radius.xl,
    marginBottom: Spacing[6],
  },
  buttonDisabled: { backgroundColor: '#f3f4f6' },
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

import { View, Text, StyleSheet } from 'react-native'
import { CheckCircle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { formatCAD } from '../../../shared/utils/currency.utils'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface DeliveryConfirmedBannerProps {
  releasedAmount: number
  travelerName: string
}

export function DeliveryConfirmedBanner({
  releasedAmount,
  travelerName,
}: DeliveryConfirmedBannerProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.banner}>
      <CheckCircle size={22} color={Colors.primary} />
      <View>
        <Text style={styles.title}>
          {t('review.delivery_confirmed_title', 'Delivery Confirmed')}
        </Text>
        <Text style={styles.description}>
          {t(
            'review.delivery_confirmed_desc',
            'Payment of {{amount}} has been released to {{traveler}}',
            { amount: formatCAD(releasedAmount), traveler: travelerName },
          )}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#e8faf0',
    borderWidth: 1,
    borderColor: '#c8f5df',
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[6],
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
})

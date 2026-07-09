/**
 * Go Bagage — DeliveryConfirmedBanner
 * Bandeau confirmant que le paiement a été libéré vers le voyageur (CDC étape 8).
 */

import { View, Text, StyleSheet } from 'react-native'
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
  return (
    <View style={styles.banner}>
      <Text style={styles.emoji}>✅</Text>
      <View>
        <Text style={styles.title}>Delivery Confirmed</Text>
        <Text style={styles.description}>
          Payment of {formatCAD(releasedAmount)} has been released to{' '}
          {travelerName}
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
  emoji: {
    fontSize: 22,
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

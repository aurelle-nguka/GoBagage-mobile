/**
 * Go Bagage — EscrowBadge
 * Bandeau explicatif du mécanisme de séquestre (CDC section 6.4).
 */

import { View, Text, StyleSheet } from 'react-native'
import { Shield } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

export function EscrowBadge() {
  return (
    <View style={styles.banner}>
      <Shield size={22} color={Colors.primary} style={styles.icon} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>Payment held in escrow</Text>
        <Text style={styles.description}>
          Your payment is secured by Go Bagage. The traveler is only paid{' '}
          <Text style={styles.bold}>after you confirm delivery</Text>. Full
          refund if anything goes wrong.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: Spacing[3],
    backgroundColor: '#e8faf0',
    borderWidth: 1,
    borderColor: '#c8f5df',
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[5],
  },
  icon: {
    marginTop: 2,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: 4,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    lineHeight: FontSize.sm * 1.6,
  },
  bold: {
    fontWeight: FontWeight.bold,
  },
})

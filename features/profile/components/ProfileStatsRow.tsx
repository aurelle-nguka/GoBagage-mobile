/**
 * Go Bagage — ProfileStatsRow
 * Ligne de 3 statistiques rapides (trajets, colis envoyés, revenus).
 */

import { View, Text, StyleSheet } from 'react-native'
import { FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { formatCAD } from '../../../shared/utils/currency.utils'

interface ProfileStatsRowProps {
  tripsCount: number
  parcelsSentCount: number
  totalEarnings: number
}

export function ProfileStatsRow({
  tripsCount,
  parcelsSentCount,
  totalEarnings,
}: ProfileStatsRowProps) {
  return (
    <View style={styles.row}>
      <StatBox
        emoji='✈️'
        value={String(tripsCount)}
        label='Trips'
        backgroundColor='#e8faf0'
      />
      <StatBox
        emoji='📦'
        value={String(parcelsSentCount)}
        label='Parcels sent'
        backgroundColor='#e8f4fd'
      />
      <StatBox
        emoji='💰'
        value={formatCAD(totalEarnings)}
        label='Earnings'
        backgroundColor='#fff8e8'
        small
      />
    </View>
  )
}

function StatBox({
  emoji,
  value,
  label,
  backgroundColor,
  small = false,
}: {
  emoji: string
  value: string
  label: string
  backgroundColor: string
  small?: boolean
}) {
  return (
    <View style={[styles.box, { backgroundColor }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, small && styles.valueSmall]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  box: {
    flex: 1,
    borderRadius: Radius['2xl'],
    paddingVertical: Spacing[3],
    alignItems: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: '#2C3E50',
    marginTop: 2,
  },
  valueSmall: {
    fontSize: FontSize.lg,
  },
  label: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
})

/**
 * Go Bagage — SelectedTravelerSummary
 */

import { View, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface SelectedTravelerSummaryProps {
  initials: string
  name: string
  from: string
  to: string
  departureDate: string
  pricePerKg: number
}

export function SelectedTravelerSummary({
  initials,
  name,
  from,
  to,
  departureDate,
  pricePerKg,
}: SelectedTravelerSummaryProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.routeRow}>
          <RouteLabel
            from={from}
            to={to}
            size='xs'
            arrowColor={Colors.mutedForeground}
            color={Colors.mutedForeground}
            fontWeight='normal'
          />
          <Text style={styles.date}> · {departureDate}</Text>
        </View>
      </View>
      <Text style={styles.price}>${pricePerKg}/kg</Text>
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
    marginBottom: Spacing[5],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
})

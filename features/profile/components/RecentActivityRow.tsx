/**
 * Go Bagage — RecentActivityRow
 * Ligne d'historique : trajet effectué ou colis envoyé, avec montant +/-.
 */

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { formatCAD } from '../../../shared/utils/currency.utils'

export interface ActivityItem {
  id: string
  type: 'trip' | 'parcel'
  label: string
  amount: number
  date: string
  status: string
}

interface RecentActivityRowProps {
  activity: ActivityItem
  onPress: () => void
}

export function RecentActivityRow({
  activity,
  onPress,
}: RecentActivityRowProps) {
  const isPositive = activity.amount >= 0
  const isTrip = activity.type === 'trip'

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <View
        style={[
          styles.iconBox,
          { backgroundColor: isTrip ? '#e8faf0' : '#e8f4fd' },
        ]}
      >
        <Text style={styles.emoji}>{isTrip ? '✈️' : '📦'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>{activity.label}</Text>
        <Text style={styles.meta}>
          {activity.date} · {activity.status}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: isPositive ? Colors.primary : Colors.destructive },
        ]}
      >
        {isPositive ? '+' : ''}
        {formatCAD(activity.amount)}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    padding: Spacing[4],
    borderRadius: Radius.xl,
    marginBottom: Spacing[2],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  amount: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
})

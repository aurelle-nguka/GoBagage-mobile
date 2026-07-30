import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Plane, Package } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'
import { formatCAD } from '../../../shared/utils/currency.utils'

export interface ActivityItem {
  id: string
  type: 'trip' | 'parcel'
  from: string
  to: string
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
  const Icon = isTrip ? Plane : Package
  const iconColor = isTrip ? Colors.primary : Colors.secondary
  const iconBg = isTrip ? '#e8faf0' : '#e8f4fd'

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Icon size={18} color={iconColor} />
      </View>

      <View style={styles.info}>
        <RouteLabel from={activity.from} to={activity.to} size='sm' />
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
  info: { flex: 1 },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  amount: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
})

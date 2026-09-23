import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Plane, Package, Star } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
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
  onRate?: () => void
}

export function RecentActivityRow({
  activity,
  onPress,
  onRate,
}: RecentActivityRowProps) {
  const { t } = useTranslation()
  const isPositive = activity.amount >= 0
  const isTrip = activity.type === 'trip'
  const Icon = isTrip ? Plane : Package
  const iconColor = isTrip ? Colors.primary : Colors.secondary
  const iconBg = isTrip ? '#e8faf0' : '#e8f4fd'
  const getStatusTranslation = (status: string) => {
    const key = (status || '').toLowerCase()
    const i18nKey = `booking.status.${key}`
    const translated = t(i18nKey)
    if (translated && translated !== i18nKey) {
      return translated
    }
    const map: Record<string, string> = {
      pending: t('bookings.status_pending', { defaultValue: 'En attente' }),
      awaiting_acceptance: t('bookings.status_awaiting_acceptance', { defaultValue: 'En attente d’acceptation' }),
      accepted: t('bookings.status_accepted', { defaultValue: 'Accepté' }),
      confirmed: t('bookings.status_confirmed', { defaultValue: 'Confirmé' }),
      picked_up: t('bookings.status_picked_up', { defaultValue: 'Pris en charge' }),
      in_transit: t('bookings.status_in_transit', { defaultValue: 'En transit' }),
      delivered: t('bookings.status_delivered', { defaultValue: 'Livré' }),
      rejected: t('bookings.status_rejected', { defaultValue: 'Refusé' }),
      cancelled: t('bookings.status_cancelled', { defaultValue: 'Annulé' }),
      open: t('trips.status_open', { defaultValue: 'Ouvert' }),
      completed: t('bookings.status_completed', { defaultValue: 'Terminé' }),
    }
    return map[key] || status
  }

  const canRate = (activity.status === 'CONFIRMED' || activity.status === 'DELIVERED') && Boolean(onRate)

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Icon size={18} color={iconColor} />
      </View>

      <View style={styles.info}>
        <RouteLabel from={activity.from} to={activity.to} size='sm' />
        <Text style={styles.meta}>
          {activity.date} · {getStatusTranslation(activity.status)}
        </Text>
      </View>

      <View style={styles.rightColumn}>
        <Text
          style={[
            styles.amount,
            { color: isPositive ? Colors.primary : Colors.destructive },
          ]}
        >
          {isPositive ? '+' : ''}
          {formatCAD(activity.amount)}
        </Text>
        {canRate && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={onRate}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Star size={12} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.rateButtonText}>
              {t('profile.rate_action', 'Rate')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
  rightColumn: { alignItems: 'flex-end', gap: 4 },
  amount: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fff8e8',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
  },
  rateButtonText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.warning,
  },
})

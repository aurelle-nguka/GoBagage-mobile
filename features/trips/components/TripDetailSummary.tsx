/**
 * Go Bagage — TripDetailSummary
 */

import { View, Text, StyleSheet } from 'react-native'
import { Plane } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface TripDetailSummaryProps {
  from: string
  to: string
  departureDate: string
  availableKg: number
  bookedKg: number
}

export function TripDetailSummary({
  from,
  to,
  departureDate,
  availableKg,
  bookedKg,
}: TripDetailSummaryProps) {
  const { t } = useTranslation()
  const remainingKg = Math.max(availableKg - bookedKg, 0)
  const progress = availableKg > 0 ? Math.min(bookedKg / availableKg, 1) : 0

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Plane size={28} color={Colors.primary} />
        <View style={styles.routeBlock}>
          <RouteLabel
            from={from}
            to={to}
            size='lg'
            color={Colors.foreground}
            arrowColor={Colors.primary}
          />
          <Text style={styles.date}>{departureDate}</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={styles.weightText}>
        {t(
          'trip.weight_summary',
          '{{booked}} kg booked · {{remaining}} kg remaining of {{available}} kg',
          { booked: bookedKg, remaining: remainingKg, available: availableKg },
        )}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  routeBlock: {
    flex: 1,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
    marginBottom: Spacing[2],
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  weightText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
})

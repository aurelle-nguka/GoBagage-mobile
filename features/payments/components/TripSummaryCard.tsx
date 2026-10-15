/**
 * Go Bagage — TripSummaryCard
 */

import { View, Text, StyleSheet } from 'react-native'
import { Plane } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'
import { formatCAD } from '../../../shared/utils/currency.utils'

function LineItem({
  label,
  value,
  muted = false,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <View style={styles.lineItem}>
      <Text style={[styles.lineLabel, muted && styles.lineLabelMuted]}>
        {label}
      </Text>
      <Text style={[styles.lineValue, muted && styles.lineValueMuted]}>
        {value}
      </Text>
    </View>
  )
}

interface TripSummaryCardProps {
  from: string
  to: string
  travelerName: string
  departureDate: string
  weightKg: number
  pricePerKg: number
  subtotal: number
  commission: number
  total: number
}

export function TripSummaryCard({
  from,
  to,
  travelerName,
  departureDate,
  weightKg,
  pricePerKg,
  subtotal,
  commission,
  total,
}: TripSummaryCardProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('payment.trip_summary', 'Trip Summary')}</Text>

      <View style={styles.tripRow}>
        <Plane size={24} color={Colors.primary} style={styles.planeIcon} />
        <View style={styles.tripInfo}>
          <RouteLabel from={from} to={to} size='md' />
          <Text style={styles.tripMeta}>
            {t('payment.via', 'via {{traveler}} · {{date}}', {
              traveler: travelerName,
              date: departureDate,
            })}
          </Text>
        </View>
      </View>

      <View style={styles.lineItems}>
        <LineItem
          label={`${weightKg} kg × ${formatCAD(pricePerKg)}/kg`}
          value={formatCAD(subtotal)}
        />
        <LineItem
          label={t('payment.service_fee', 'Service fee (12%)')}
          value={formatCAD(commission)}
          muted
        />
        <View style={styles.totalRow}>
          <View style={styles.totalContent}>
            <Text style={styles.totalLabel}>{t('payment.total', 'Total')}</Text>
            <Text style={styles.totalValue}>{formatCAD(total)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[5],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    marginBottom: Spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingBottom: Spacing[4],
    marginBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  planeIcon: {
    marginRight: 2,
  },
  tripInfo: {
    flex: 1,
  },
  tripMeta: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  lineItems: {
    gap: Spacing[3],
  },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineLabel: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
  },
  lineLabelMuted: {
    color: '#9ca3af',
  },
  lineValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.foreground,
  },
  lineValueMuted: {
    color: '#9ca3af',
  },
  totalRow: {
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  totalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  totalValue: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
})

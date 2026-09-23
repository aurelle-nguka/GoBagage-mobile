import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Plane, Package, DollarSign } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { formatCAD } from '../../../shared/utils/currency.utils'

interface ProfileStatsRowProps {
  tripsCount?: number
  parcelsSentCount?: number
  totalEarnings?: number
}

export function ProfileStatsRow({
  tripsCount = 0,
  parcelsSentCount = 0,
  totalEarnings = 0,
}: ProfileStatsRowProps) {
  const { t } = useTranslation()
  const safeTrips = typeof tripsCount === 'number' && !isNaN(tripsCount) ? tripsCount : 0
  const safeParcels = typeof parcelsSentCount === 'number' && !isNaN(parcelsSentCount) ? parcelsSentCount : 0
  const safeEarnings = typeof totalEarnings === 'number' && !isNaN(totalEarnings) ? totalEarnings : 0

  return (
    <View style={styles.row}>
      <StatBox
        icon={<Plane size={20} color='#00C853' />}
        value={String(safeTrips)}
        label={t('profile.trips', { defaultValue: 'Trajets' })}
        backgroundColor='#e8faf0'
      />
      <StatBox
        icon={<Package size={20} color='#2196F3' />}
        value={String(safeParcels)}
        label={t('profile.parcels_sent', { defaultValue: 'Colis envoyés' })}
        backgroundColor='#e8f4fd'
      />
      <StatBox
        icon={<DollarSign size={20} color='#FF9800' />}
        value={formatCAD(safeEarnings)}
        label={t('profile.earnings', { defaultValue: 'Gains' })}
        backgroundColor='#fff8e8'
        small
      />
    </View>
  )
}

function StatBox({
  icon,
  value,
  label,
  backgroundColor,
  small = false,
}: {
  icon: React.ReactNode
  value: string
  label: string
  backgroundColor: string
  small?: boolean
}) {
  return (
    <View style={[styles.box, { backgroundColor }]}>
      {icon}
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
    gap: 4,
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

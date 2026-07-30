import { View, Text, StyleSheet } from 'react-native'
import { Plane, Package, DollarSign } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  return (
    <View style={styles.row}>
      <StatBox
        icon={<Plane size={20} color='#00C853' />}
        value={String(tripsCount)}
        label={t('profile.trips', 'Trips')}
        backgroundColor='#e8faf0'
      />
      <StatBox
        icon={<Package size={20} color='#2196F3' />}
        value={String(parcelsSentCount)}
        label={t('profile.parcels_sent', 'Parcels sent')}
        backgroundColor='#e8f4fd'
      />
      <StatBox
        icon={<DollarSign size={20} color='#FF9800' />}
        value={formatCAD(totalEarnings)}
        label={t('profile.earnings', 'Earnings')}
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

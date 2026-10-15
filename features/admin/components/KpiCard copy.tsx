import { View, Text, StyleSheet } from 'react-native'
import { FontSize, Spacing, Radius } from '../../../theme'

interface KpiCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  backgroundColor: string
}

export function KpiCard({
  icon,
  label,
  value,
  subtitle,
  backgroundColor,
}: KpiCardProps) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    alignItems: 'center',
    minWidth: '45%',
  },
  iconWrapper: { marginBottom: 4 },
  value: { fontSize: FontSize['2xl'], fontWeight: '800', color: '#2C3E50' },
  label: {
    fontSize: FontSize.sm,
    color: '#6b7280',
    marginTop: 2,
    textAlign: 'center',
  },
  subtitle: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
})

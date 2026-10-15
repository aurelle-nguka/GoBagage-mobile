import { View, Text, StyleSheet } from 'react-native'
import { FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  suffix?: string
  backgroundColor: string
}

export function StatCard({
  icon,
  value,
  label,
  suffix,
  backgroundColor,
}: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.value}>
        {value}
        {suffix ? <Text style={styles.suffix}> {suffix}</Text> : null}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius['2xl'],
    paddingVertical: Spacing[3],
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 2,
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#2C3E50',
    marginTop: 2,
  },
  suffix: {
    fontSize: 10,
    fontWeight: FontWeight.normal,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
})

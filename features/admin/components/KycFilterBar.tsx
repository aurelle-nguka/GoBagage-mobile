import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import type { KycStatus } from '../../../types/user.types'

type Filter = KycStatus | 'ALL'

const FILTERS: { id: Filter; label: string; color: string }[] = [
  { id: 'ALL', label: 'All', color: Colors.foreground },
  { id: 'PENDING', label: 'Pending', color: Colors.warning },
  { id: 'UNDER_REVIEW', label: 'Under Review', color: Colors.secondary },
  { id: 'VERIFIED', label: 'Verified', color: Colors.primary },
  { id: 'REJECTED', label: 'Rejected', color: Colors.destructive },
]

interface KycFilterBarProps {
  active: Filter
  onSelect: (filter: Filter) => void
}

export function KycFilterBar({ active, onSelect }: KycFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((f) => {
        const isActive = f.id === active
        return (
          <TouchableOpacity
            key={f.id}
            onPress={() => onSelect(f.id)}
            activeOpacity={0.85}
            style={[
              styles.chip,
              isActive && { backgroundColor: f.color, borderColor: f.color },
            ]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[2],
  },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    fontWeight: FontWeight.medium,
    lineHeight: 18,
  },
  labelActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
})

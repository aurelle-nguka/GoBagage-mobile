import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

export type TripFilter = 'ALL' | 'OPEN' | 'BOOKED' | 'COMPLETED'

const FILTER_KEYS: { id: TripFilter; key: string; fallback: string }[] = [
  { id: 'ALL', key: 'trip.filter_all', fallback: 'All' },
  { id: 'OPEN', key: 'trip.open', fallback: 'Open' },
  { id: 'BOOKED', key: 'trip.booked', fallback: 'Booked' },
  { id: 'COMPLETED', key: 'trip.completed', fallback: 'Completed' },
]

interface TripStatusFilterProps {
  selected: TripFilter
  onSelect: (filter: TripFilter) => void
}

export function TripStatusFilter({
  selected,
  onSelect,
}: TripStatusFilterProps) {
  const { t } = useTranslation()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTER_KEYS.map((filter) => {
        const isActive = filter.id === selected
        return (
          <TouchableOpacity
            key={filter.id}
            onPress={() => onSelect(filter.id)}
            activeOpacity={0.85}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(filter.key, filter.fallback)}
            </Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing[2],
    paddingBottom: Spacing[1],
  },
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    fontWeight: FontWeight.medium,
  },
  labelActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
})

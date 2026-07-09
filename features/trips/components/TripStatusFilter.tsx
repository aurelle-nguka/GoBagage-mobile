/**
 * Go Bagage — TripStatusFilter
 * Filtre horizontal scrollable par statut de trajet.
 */

import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

export type TripFilter = 'ALL' | 'OPEN' | 'BOOKED' | 'COMPLETED'

const FILTERS: { id: TripFilter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'OPEN', label: 'Open' },
  { id: 'BOOKED', label: 'Booked' },
  { id: 'COMPLETED', label: 'Completed' },
]

interface TripStatusFilterProps {
  selected: TripFilter
  onSelect: (filter: TripFilter) => void
}

export function TripStatusFilter({
  selected,
  onSelect,
}: TripStatusFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((filter) => {
        const isActive = filter.id === selected
        return (
          <TouchableOpacity
            key={filter.id}
            onPress={() => onSelect(filter.id)}
            activeOpacity={0.85}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {filter.label}
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

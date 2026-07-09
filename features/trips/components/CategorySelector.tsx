/**
 * Go Bagage — CategorySelector
 * Sélection multiple des catégories de colis acceptées par le voyageur.
 * Utilise l'enum ParcelCategory défini dans le cahier des charges (section 10.1).
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { ParcelCategory } from '../../../types/common.types'

const CATEGORY_LABELS: Record<ParcelCategory, string> = {
  CLOTHING: 'Clothing',
  FOOD: 'Food',
  ELECTRONICS: 'Electronics',
  COSMETICS: 'Cosmetics',
  DOCUMENTS: 'Documents',
  BOOKS: 'Books',
  OTHER: 'Other',
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ParcelCategory[]

interface CategorySelectorProps {
  selected: ParcelCategory[]
  onToggle: (category: ParcelCategory) => void
}

export function CategorySelector({
  selected,
  onToggle,
}: CategorySelectorProps) {
  return (
    <View style={styles.row}>
      {ALL_CATEGORIES.map((category) => {
        const isActive = selected.includes(category)
        return (
          <TouchableOpacity
            key={category}
            onPress={() => onToggle(category)}
            activeOpacity={0.8}
            style={[
              styles.chip,
              isActive ? styles.chipActive : styles.chipInactive,
            ]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {CATEGORY_LABELS[category]}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.xl,
    borderWidth: 1.5,
  },
  chipInactive: {
    backgroundColor: Colors.inputBackground,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    fontWeight: FontWeight.normal,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
})

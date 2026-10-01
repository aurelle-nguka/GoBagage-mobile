import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { ParcelCategory } from '../../../types/common.types'

const CATEGORY_KEYS: Record<ParcelCategory, { key: string; fallback: string }> =
  {
    CLOTHING: { key: 'parcel.categories.clothing', fallback: 'Clothing' },
    FOOD: { key: 'parcel.categories.food', fallback: 'Food' },
    ELECTRONICS: {
      key: 'parcel.categories.electronics',
      fallback: 'Electronics',
    },
    COSMETICS: { key: 'parcel.categories.cosmetics', fallback: 'Cosmetics' },
    DOCUMENTS: { key: 'parcel.categories.documents', fallback: 'Documents' },
    BOOKS: { key: 'parcel.categories.books', fallback: 'Books' },
    OTHER: { key: 'parcel.categories.other', fallback: 'Other' },
  }

const ALL_CATEGORIES = Object.keys(CATEGORY_KEYS) as ParcelCategory[]

interface CategorySelectorProps {
  selected: ParcelCategory[]
  onToggle: (category: ParcelCategory) => void
}

export function CategorySelector({
  selected,
  onToggle,
}: CategorySelectorProps) {
  const { t } = useTranslation()

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
              {t(CATEGORY_KEYS[category].key, CATEGORY_KEYS[category].fallback)}
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

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import type { ParcelCategory } from '../../../types/common.types'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

const CATEGORY_KEYS: Record<ParcelCategory, { key: string; fallback: string }> = {
  CLOTHING: { key: 'parcel.categories.clothing', fallback: 'Clothing' },
  FOOD: { key: 'parcel.categories.food', fallback: 'Food' },
  ELECTRONICS: { key: 'parcel.categories.electronics', fallback: 'Electronics' },
  COSMETICS: { key: 'parcel.categories.cosmetics', fallback: 'Cosmetics' },
  DOCUMENTS: { key: 'parcel.categories.documents', fallback: 'Documents' },
  BOOKS: { key: 'parcel.categories.books', fallback: 'Books' },
  OTHER: { key: 'parcel.categories.other', fallback: 'Other' },
}

const ALL_CATEGORIES = Object.keys(CATEGORY_KEYS) as ParcelCategory[]

interface ParcelCategoryPickerProps {
  selected: ParcelCategory
  onSelect: (category: ParcelCategory) => void
  otherDetails?: string
  onOtherDetailsChange?: (value: string) => void
  otherDetailsError?: string
}

export function ParcelCategoryPicker({
  selected,
  onSelect,
  otherDetails = '',
  onOtherDetailsChange,
  otherDetailsError,
}: ParcelCategoryPickerProps) {
  const { t } = useTranslation()

  return (
    <View>
      <Text style={styles.label}>{`${t('parcel.category', 'Category')} *`}</Text>
      <View style={styles.row}>
        {ALL_CATEGORIES.map((category) => {
          const isActive = category === selected
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelect(category)}
              activeOpacity={0.8}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {t(CATEGORY_KEYS[category].key, CATEGORY_KEYS[category].fallback)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {selected === 'OTHER' && (
        <View style={styles.otherWrapper}>
          <Text style={styles.otherLabel}>{`${t('parcel.other_details', 'Please describe the content')} *`}</Text>
          <TextInput
            value={otherDetails}
            onChangeText={onOtherDetailsChange}
            placeholder={t('parcel.other_placeholder', 'e.g. Handmade crafts, spare parts, toys...')}
            placeholderTextColor='#9ca3af'
            style={[
              styles.otherInput,
              otherDetailsError ? styles.otherInputError : null,
            ]}
            multiline
            numberOfLines={2}
          />
          {otherDetailsError ? (
            <Text style={styles.errorText}>{otherDetailsError}</Text>
          ) : null}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: Radius.lg,
    backgroundColor: Colors.inputBackground,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
  otherWrapper: {
    marginTop: Spacing[3],
  },
  otherLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  otherInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.base,
    color: Colors.foreground,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  otherInputError: {
    borderColor: Colors.destructive,
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    marginTop: Spacing[1],
  },
})

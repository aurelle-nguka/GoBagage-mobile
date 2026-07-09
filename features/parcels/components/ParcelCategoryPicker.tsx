import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ParcelCategory } from '../../../types/common.types';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme';


const CATEGORY_LABELS: Record<ParcelCategory, string> = {
  CLOTHING: 'Clothing',
  FOOD: 'Food',
  ELECTRONICS: 'Electronics',
  COSMETICS: 'Cosmetics',
  DOCUMENTS: 'Documents',
  BOOKS: 'Books',
  OTHER: 'Other',
};

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ParcelCategory[];

interface ParcelCategoryPickerProps {
  selected: ParcelCategory;
  onSelect: (category: ParcelCategory) => void;
}

export function ParcelCategoryPicker({ selected, onSelect }: ParcelCategoryPickerProps) {
  return (
    <View>
      <Text style={styles.label}>Category</Text>
      <View style={styles.row}>
        {ALL_CATEGORIES.map((category) => {
          const isActive = category === selected;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelect(category)}
              activeOpacity={0.8}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {CATEGORY_LABELS[category]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
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
});

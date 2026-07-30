import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import type { KycStatus } from '../../../types/user.types'

type Filter = KycStatus | 'ALL'

interface KycFilterBarProps {
  active: Filter
  onSelect: (filter: Filter) => void
}

export function KycFilterBar({ active, onSelect }: KycFilterBarProps) {
  const { t } = useTranslation()

  const FILTERS: { id: Filter; label: string; color: string }[] = [
    { id: 'ALL', label: t('admin.all', 'All'), color: Colors.foreground },
    { id: 'PENDING', label: t('admin.pending'), color: Colors.warning },
    {
      id: 'UNDER_REVIEW',
      label: t('admin.under_review'),
      color: Colors.secondary,
    },
    { id: 'VERIFIED', label: t('admin.verified'), color: Colors.primary },
    { id: 'REJECTED', label: t('admin.rejected'), color: Colors.destructive },
  ]

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
    gap: Spacing[1],
    paddingVertical: 0,
    paddingHorizontal: Spacing[1],
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

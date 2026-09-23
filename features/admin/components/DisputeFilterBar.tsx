import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import type { DisputeStatusFilter } from '../hooks/useAdminDisputes'

interface DisputeFilterBarProps {
  active: DisputeStatusFilter
  onSelect: (filter: DisputeStatusFilter) => void
}

export function DisputeFilterBar({ active, onSelect }: DisputeFilterBarProps) {
  const { t } = useTranslation()

  const FILTERS: { id: DisputeStatusFilter; label: string; color: string }[] = [
    { id: 'ALL', label: t('admin.all', 'All'), color: Colors.foreground },
    { id: 'OPEN', label: t('admin.disputes.status_open', 'Open'), color: Colors.destructive },
    {
      id: 'UNDER_INVESTIGATION',
      label: t('admin.disputes.status_under_investigation', 'Investigating'),
      color: Colors.secondary,
    },
    { id: 'DECIDED', label: t('admin.disputes.status_decided', 'Decided'), color: Colors.warning },
    { id: 'CLOSED', label: t('admin.disputes.status_closed', 'Closed'), color: Colors.primary },
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

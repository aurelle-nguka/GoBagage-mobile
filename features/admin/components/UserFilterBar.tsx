import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { UserFilter } from '../hooks/useAdminUsers'

interface UserFilterBarProps {
  activeFilter: UserFilter
  onSelectFilter: (filter: UserFilter) => void
}

export function UserFilterBar({
  activeFilter,
  onSelectFilter,
}: UserFilterBarProps) {
  const { t } = useTranslation()

  const FILTERS: { id: UserFilter; label: string; isDanger?: boolean }[] = [
    { id: 'ALL', label: t('admin.all', 'All') },
    { id: 'SENDER', label: t('home.role_sender', 'Sender') },
    { id: 'TRAVELER', label: t('home.role_traveler', 'Traveler') },
    { id: 'ADMIN', label: 'Admin' },
    { id: 'SUSPENDED', label: t('admin.users.status_suspended', 'Suspended'), isDanger: true },
  ]

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((f) => {
        const isActive = f.id === activeFilter
        return (
          <TouchableOpacity
            key={f.id}
            onPress={() => onSelectFilter(f.id)}
            activeOpacity={0.8}
            style={[
              styles.chip,
              f.isDanger && styles.chipDangerInactive,
              isActive && (f.isDanger ? styles.chipActiveDanger : styles.chipActive),
            ]}
          >
            <Text
              style={[
                styles.label,
                f.isDanger && styles.labelDangerInactive,
                isActive && styles.labelActive,
              ]}
            >
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
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: 7,
    borderRadius: Radius.lg,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
  },
  chipDangerInactive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  chipActiveDanger: {
    backgroundColor: Colors.destructive,
    borderColor: Colors.destructive,
    shadowColor: Colors.destructive,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: FontSize.sm,
    color: '#4b5563',
    fontWeight: FontWeight.semibold,
  },
  labelDangerInactive: {
    color: Colors.destructive,
    fontWeight: FontWeight.semibold,
  },
  labelActive: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
})

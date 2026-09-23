import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ChevronRight, ShieldCheck, ShieldOff } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { AdminUser } from '../types/admin.types'

interface UserListItemProps {
  user: AdminUser
  onPress: () => void
}

export function UserListItem({ user, onPress }: UserListItemProps) {
  const { t } = useTranslation()
  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {user.email}
          </Text>
          <Text style={styles.roles}>{user.roles.join(' · ')}</Text>
        </View>

        <View style={styles.right}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: user.isActive ? '#e8faf0' : '#fef2f2' },
            ]}
          >
            {user.isActive ? (
              <ShieldCheck size={10} color={Colors.primary} />
            ) : (
              <ShieldOff size={10} color={Colors.destructive} />
            )}
            <Text
              style={[
                styles.statusText,
                { color: user.isActive ? Colors.primary : Colors.destructive },
              ]}
            >
              {user.isActive
                ? t('admin.users.status_active', 'Active')
                : t('admin.users.status_suspended', 'Suspended')}
            </Text>
          </View>
          <ChevronRight size={16} color='#d1d5db' style={{ marginTop: Spacing[2] }} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  info: { flex: 1 },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  email: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  roles: { fontSize: FontSize.sm, color: '#9ca3af', marginTop: 2 },
  right: { alignItems: 'flex-end' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: 10, fontWeight: FontWeight.bold },
})

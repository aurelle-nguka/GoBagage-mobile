import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { LogOut, Shield, Languages, Bell, User } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface AdminHeaderProps {
  adminName: string
  unreadNotifications?: number
  onPressNotifications?: () => void
  onLogout: () => void
}

export function AdminHeader({
  adminName,
  unreadNotifications = 0,
  onPressNotifications,
  onLogout,
}: AdminHeaderProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('auth.logout_confirm_admin'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.logout'), style: 'destructive', onPress: onLogout },
      ],
      { cancelable: true },
    )
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.left}
        onPress={() => router.push('/(modals)/edit-profile')}
        activeOpacity={0.7}
        accessibilityLabel={t('profile.edit', 'Edit Profile')}
      >
        <View style={styles.badgeRow}>
          <Shield size={14} color={Colors.primary} />
          <Text style={styles.badge}>{t('admin.title')}</Text>
        </View>
        <Text style={styles.greeting}>
          {t('admin.greeting', { name: adminName })}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressNotifications ?? (() => router.push('/(modals)/notifications'))}
          activeOpacity={0.8}
          accessibilityLabel={t('notifications.title', 'Notifications')}
        >
          <Bell size={18} color={Colors.foreground} />
          {unreadNotifications > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/(modals)/edit-profile')}
          activeOpacity={0.8}
          accessibilityLabel={t('profile.edit', 'Edit Profile')}
        >
          <User size={18} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/(modals)/language')}
          activeOpacity={0.8}
          accessibilityLabel={t('profile.language', 'Language')}
        >
          <Languages size={18} color={Colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.logoutButton]}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityLabel={t('auth.logout')}
        >
          <LogOut size={18} color={Colors.destructive} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  left: { flex: 1 },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  greeting: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: Radius.full,
    backgroundColor: Colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  unreadBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
  },
})

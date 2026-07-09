/**
 * Go Bagage — AdminHeader
 * Header du dashboard admin avec titre, badge ADMIN et logout.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LogOut, Shield } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface AdminHeaderProps {
  adminName: string
  onLogout: () => void
}

export function AdminHeader({ adminName, onLogout }: AdminHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.badgeRow}>
          <Shield size={14} color={Colors.primary} />
          <Text style={styles.badge}>ADMIN</Text>
        </View>
        <Text style={styles.greeting}>Hello, {adminName}</Text>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        activeOpacity={0.8}
      >
        <LogOut size={18} color={Colors.destructive} />
      </TouchableOpacity>
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
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

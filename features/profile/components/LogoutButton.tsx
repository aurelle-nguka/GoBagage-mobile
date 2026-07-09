/**
 * Go Bagage — LogoutButton
 */

import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { LogOut } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface LogoutButtonProps {
  onPress: () => void
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LogOut size={18} color={Colors.destructive} />
      <Text style={styles.label}>Log Out</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: Radius['2xl'],
    paddingVertical: Spacing[4],
    marginBottom: Spacing[8],
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.destructive,
  },
})

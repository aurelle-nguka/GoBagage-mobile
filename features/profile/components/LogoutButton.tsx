import { Alert, TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { LogOut } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface LogoutButtonProps {
  onPress: () => void
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  const handlePress = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress,
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrapper}>
        <LogOut size={18} color={Colors.destructive} />
      </View>
      <Text style={styles.label}>Log Out</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#fef2f2',
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginTop: Spacing[4],
    marginBottom: Spacing[10],
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.destructive,
  },
})

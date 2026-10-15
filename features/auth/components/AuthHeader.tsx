import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ArrowLeft } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'

interface AuthHeaderProps {
  roleLabel: string
  onBack: () => void
}

export function AuthHeader({ roleLabel, onBack }: AuthHeaderProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ArrowLeft size={22} color={Colors.foreground} />
      </TouchableOpacity>
      <View>
        <Text style={styles.eyebrow}>
          {t('auth.creating_as', 'Creating account as')}
        </Text>
        <Text style={styles.roleLabel}>{roleLabel}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  eyebrow: {
    color: Colors.mutedForeground,
    fontSize: FontSize.sm,
  },
  roleLabel: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
})

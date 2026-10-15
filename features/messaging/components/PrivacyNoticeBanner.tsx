/**
 * Go Bagage — PrivacyNoticeBanner
 * Rappel que les coordonnées restent masquées (CDC section 6.5).
 */

import { View, Text, StyleSheet } from 'react-native'
import { Lock } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Spacing } from '../../../theme'

export function PrivacyNoticeBanner() {
  const { t } = useTranslation()
  return (
    <View style={styles.banner}>
      <Lock size={12} color='#E65100' />
      <Text style={styles.text}>
        {t(
          'messaging.privacy_notice',
          'Your contact details remain hidden. Keep all coordination in this chat.',
        )}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#fff8e8',
    borderTopWidth: 1,
    borderTopColor: '#ffe0b2',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  text: {
    flexShrink: 1,
    fontSize: 11,
    color: '#E65100',
    textAlign: 'center',
  },
})

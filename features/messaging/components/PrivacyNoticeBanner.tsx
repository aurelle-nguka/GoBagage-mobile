/**
 * Go Bagage — PrivacyNoticeBanner
 * Rappel que les coordonnées restent masquées (CDC section 6.5).
 */

import { View, Text, StyleSheet } from 'react-native'
import { Spacing } from '../../../theme'

export function PrivacyNoticeBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        🔒 Your contact details remain hidden. Keep all coordination in this
        chat.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff8e8',
    borderTopWidth: 1,
    borderTopColor: '#ffe0b2',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  text: {
    fontSize: 11,
    color: '#E65100',
    textAlign: 'center',
  },
})

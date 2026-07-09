/**
 * Go Bagage — FormSection
 * Section de formulaire avec titre en majuscules et carte blanche.
 */

import { View, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing[6],
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    gap: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
})

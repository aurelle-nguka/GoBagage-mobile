/**
 * Go Bagage — TripSuccessView
 * Écran de confirmation après publication réussie d'un trajet.
 */

import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface TripSuccessViewProps {
  origin: string
  destination: string
}

export function TripSuccessView({ origin, destination }: TripSuccessViewProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.emoji}>✅</Text>
      </View>
      <Text style={styles.title}>Trip Published!</Text>
      <Text style={styles.description}>
        Your trip from <Text style={styles.bold}>{origin}</Text> to{' '}
        <Text style={styles.bold}>{destination}</Text> is now live. Senders can
        find and book you.
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  description: {
    color: Colors.mutedForeground,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
  },
  bold: {
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
})

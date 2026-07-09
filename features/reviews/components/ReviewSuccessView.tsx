/**
 * Go Bagage — ReviewSuccessView
 * Écran de remerciement après soumission de l'évaluation.
 */

import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Star } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface ReviewSuccessViewProps {
  rating: number
  revieweeName: string
}

export function ReviewSuccessView({
  rating,
  revieweeName,
}: ReviewSuccessViewProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.emoji}>🎉</Text>
      </View>
      <Text style={styles.title}>Thank you!</Text>
      <Text style={styles.description}>
        Your review helps build trust in our community. {revieweeName} has been
        notified.
      </Text>

      <View style={styles.starsRow}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={28} color='#FFD600' fill='#FFD600' />
        ))}
      </View>
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
  starsRow: {
    flexDirection: 'row',
    gap: Spacing[1],
    marginTop: Spacing[6],
  },
})

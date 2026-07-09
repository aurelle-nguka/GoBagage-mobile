/**
 * Go Bagage — StarRating
 * Sélecteur de note à 5 étoiles avec libellé dynamique.
 * Pas de hover (n'existe pas sur mobile) — le tap définit directement la note,
 * contrairement à la maquette web qui utilisait onMouseEnter/onMouseLeave.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Star } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!']

interface StarRatingProps {
  rating: number
  onChange: (rating: number) => void
}

export function StarRating({ rating, onChange }: StarRatingProps) {
  const label = RATING_LABELS[rating] ?? ''
  const labelColor =
    rating >= 4
      ? Colors.primary
      : rating >= 3
        ? Colors.warning
        : Colors.destructive

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>How was your overall experience?</Text>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= rating
          return (
            <TouchableOpacity
              key={star}
              onPress={() => onChange(star)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Star
                size={40}
                color={isFilled ? '#FFD600' : '#e5e7eb'}
                fill={isFilled ? '#FFD600' : '#e5e7eb'}
              />
            </TouchableOpacity>
          )
        })}
      </View>

      {label ? (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  prompt: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[4],
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
})

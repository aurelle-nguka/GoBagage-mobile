import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Star } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'

interface StarRatingProps {
  rating: number
  onChange: (rating: number) => void
}

export function StarRating({ rating, onChange }: StarRatingProps) {
  const { t } = useTranslation()

  const RATING_LABELS = [
    '',
    t('review.rating_labels.poor', 'Poor'),
    t('review.rating_labels.fair', 'Fair'),
    t('review.rating_labels.good', 'Good'),
    t('review.rating_labels.great', 'Great'),
    t('review.rating_labels.excellent', 'Excellent!'),
  ]
  const label = RATING_LABELS[rating] ?? ''
  const labelColor =
    rating >= 4
      ? Colors.primary
      : rating >= 3
        ? Colors.warning
        : Colors.destructive

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>
        {t('review.rating_prompt', 'How was your overall experience?')}
      </Text>

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

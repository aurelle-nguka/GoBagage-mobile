import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { ArrowLeft, Star } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { ReviewSuccessView } from '../components/ReviewSuccessView'
import { Colors } from '../../../theme/colors'
import { DeliveryConfirmedBanner } from '../components/DeliveryConfirmedBanner'
import { RevieweeProfileHeader } from '../components/RevieweeProfileHeader'
import { StarRating } from '../components/StartRating'
import { ReviewBadgeSelector } from '../components/ReviewBadgeSelector'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { Radius, Spacing } from '../../../theme/spacing'
import { FontSize, FontWeight } from '../../../theme/typography'

interface ReviewScreenProps {
  routeLabel: string
  departureDate: string
  releasedAmount: number
  revieweeInitials: string
  revieweeName: string
  revieweeContext: string
  onBack: () => void
  onSubmit: (review: {
    rating: number
    badges: string[]
    comment: string
  }) => Promise<void> | void
}

export function ReviewScreen({
  routeLabel,
  departureDate,
  releasedAmount,
  revieweeInitials,
  revieweeName,
  revieweeContext,
  onBack,
  onSubmit,
}: ReviewScreenProps) {
  const { t } = useTranslation()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const toggleBadge = (id: string) => {
    setSelectedBadges((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    )
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(t('review.errors.rating_required', 'Please select a star rating.'))
      return
    }
    setError('')
    setLoading(true)

    try {
      await onSubmit({ rating, badges: selectedBadges, comment })
      setDone(true)
    } catch {
      setError(
        t(
          'review.errors.submit_failed',
          'Failed to submit review. Please try again.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return <ReviewSuccessView rating={rating} revieweeName={revieweeName} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>
            {t('review.title', 'Rate Your Experience')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {routeLabel} · {departureDate}
          </Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <DeliveryConfirmedBanner
          releasedAmount={releasedAmount}
          travelerName={revieweeName}
        />

        <RevieweeProfileHeader
          initials={revieweeInitials}
          name={revieweeName}
          context={revieweeContext}
        />

        <StarRating rating={rating} onChange={setRating} />

        <ReviewBadgeSelector selected={selectedBadges} onToggle={toggleBadge} />

        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>
            {t('review.comment_label', 'Leave a comment')}{' '}
            <Text style={styles.optional}>({t('common.optional', 'optional')})</Text>
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            placeholder={t(
              'review.comment_placeholder',
              'Share your experience to help the community...',
            )}
            placeholderTextColor='#9ca3af'
            style={styles.textarea}
          />
        </View>

        {error ? <ErrorBanner message={error} /> : null}

        <PrimaryButton
          label={t('review.submit_button', 'Submit Review')}
          loadingLabel={t('review.submitting', 'Submitting...')}
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitButton}
          icon={<Star size={16} color={Colors.white} fill={Colors.white} />}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[6],
  },
  commentSection: {
    marginBottom: Spacing[6],
  },
  commentLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  optional: {
    color: '#9ca3af',
    fontWeight: FontWeight.normal,
  },
  textarea: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    padding: Spacing[4],
    fontSize: FontSize.base,
    color: Colors.foreground,
    lineHeight: FontSize.base * 1.6,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  submitButton: {
    marginBottom: Spacing[8],
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
})

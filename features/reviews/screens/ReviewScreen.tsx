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
import { ArrowLeft } from 'lucide-react-native'
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
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface ReviewScreenProps {
  routeLabel?: string
  corridor?: { departureCity: string; arrivalCity: string } | null
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
  routeLabel = 'Your trip',
  corridor,
  departureDate,
  releasedAmount,
  revieweeInitials,
  revieweeName,
  revieweeContext,
  onBack,
  onSubmit,
}: ReviewScreenProps) {
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
      setError('Please select a star rating.')
      return
    }
    setError('')
    setLoading(true)

    try {
      await onSubmit({ rating, badges: selectedBadges, comment })
      setDone(true)
    } catch {
      setError('Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return <ReviewSuccessView rating={rating} revieweeName={revieweeName} />
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Rate Your Experience</Text>
          {corridor ? (
            <RouteLabel
              from={corridor.departureCity}
              to={corridor.arrivalCity}
              suffix={departureDate ? ` · ${departureDate}` : undefined}
              size="xs"
              color={Colors.mutedForeground}
              arrowColor={Colors.mutedForeground}
              fontWeight="normal"
            />
          ) : (
            <Text style={styles.headerSubtitle}>
              {routeLabel}{departureDate ? ` · ${departureDate}` : ''}
            </Text>
          )}
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
            Leave a comment <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            placeholder='Share your experience to help the community...'
            placeholderTextColor='#9ca3af'
            style={styles.textarea}
          />
        </View>

        {error ? <ErrorBanner message={error} /> : null}

        <PrimaryButton
          label='⭐ Submit Review'
          loadingLabel='Submitting...'
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitButton}
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

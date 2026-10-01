import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import {
  Clock,
  Smile,
  PackageCheck,
  MessageCircle,
  Briefcase,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

export interface ReviewBadgeOption {
  id: string
  Icon: typeof Clock
  label: string
}

function getReviewBadges(
  t: (key: string, fallback: string) => string,
): ReviewBadgeOption[] {
  return [
    { id: 'ontime', Icon: Clock, label: t('review.badges.on_time', 'On time') },
    {
      id: 'friendly',
      Icon: Smile,
      label: t('review.badges.friendly', 'Friendly'),
    },
    {
      id: 'careful',
      Icon: PackageCheck,
      label: t('review.badges.careful', 'Careful with package'),
    },
    {
      id: 'communicative',
      Icon: MessageCircle,
      label: t('review.badges.communicative', 'Communicative'),
    },
    {
      id: 'professional',
      Icon: Briefcase,
      label: t('review.badges.professional', 'Professional'),
    },
  ]
}

interface ReviewBadgeSelectorProps {
  selected: string[]
  onToggle: (id: string) => void
}

export function ReviewBadgeSelector({
  selected,
  onToggle,
}: ReviewBadgeSelectorProps) {
  const { t } = useTranslation()
  const reviewBadges = getReviewBadges(t)

  return (
    <View style={styles.section}>
      <Text style={styles.title}>
        {t('review.badges_prompt', 'What stood out?')}{' '}
        <Text style={styles.optional}>
          ({t('common.optional', 'optional')})
        </Text>
      </Text>
      <View style={styles.row}>
        {reviewBadges.map((badge) => {
          const isActive = selected.includes(badge.id)
          return (
            <TouchableOpacity
              key={badge.id}
              onPress={() => onToggle(badge.id)}
              activeOpacity={0.85}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
              ]}
            >
              <badge.Icon
                size={14}
                color={isActive ? Colors.white : Colors.foreground}
              />
              <Text
                style={[styles.chipLabel, isActive && styles.chipLabelActive]}
              >
                {badge.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
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
  },
  optional: {
    color: '#9ca3af',
    fontWeight: FontWeight.normal,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 2,
  },
  chipInactive: {
    backgroundColor: Colors.white,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chipLabel: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
  },
  chipLabelActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
})

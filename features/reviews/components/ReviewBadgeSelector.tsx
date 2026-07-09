/**
 * Go Bagage — ReviewBadgeSelector
 * Sélection multiple de qualificatifs mis en avant dans l'évaluation (optionnel).
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

export interface ReviewBadgeOption {
  id: string
  emoji: string
  label: string
}

const REVIEW_BADGES: ReviewBadgeOption[] = [
  { id: 'ontime', emoji: '⏱️', label: 'On time' },
  { id: 'friendly', emoji: '😊', label: 'Friendly' },
  { id: 'careful', emoji: '🧤', label: 'Careful with package' },
  { id: 'communicative', emoji: '💬', label: 'Communicative' },
  { id: 'professional', emoji: '💼', label: 'Professional' },
]

interface ReviewBadgeSelectorProps {
  selected: string[]
  onToggle: (id: string) => void
}

export function ReviewBadgeSelector({
  selected,
  onToggle,
}: ReviewBadgeSelectorProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>
        What stood out? <Text style={styles.optional}>(optional)</Text>
      </Text>
      <View style={styles.row}>
        {REVIEW_BADGES.map((badge) => {
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
              <Text style={styles.emoji}>{badge.emoji}</Text>
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
  emoji: {
    fontSize: 14,
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

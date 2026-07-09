/**
 * Go Bagage — ProfileHeader
 * Header vert avec avatar, badge vérifié, nom, ancienneté et note moyenne.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ArrowLeft, CheckCircle, Star } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface ProfileHeaderProps {
  initials: string
  name: string
  memberSince: string
  averageRating: number
  isVerified: boolean
  onBack: () => void
}

export function ProfileHeader({
  initials,
  name,
  memberSince,
  averageRating,
  isVerified,
  onBack,
}: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color='rgba(255,255,255,0.9)' />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle
                size={18}
                color={Colors.primary}
                fill={Colors.primary}
              />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.memberSince}>Member since {memberSince}</Text>
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                color='#FFD600'
                fill={i < Math.round(averageRating) ? '#FFD600' : 'none'}
              />
            ))}
            <Text style={styles.ratingValue}>
              {averageRating.toFixed(1)} avg
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[6],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  topTitle: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  spacer: {
    width: 22,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  memberSince: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  ratingValue: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSize.sm,
    marginLeft: 4,
  },
})

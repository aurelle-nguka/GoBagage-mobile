/**
 * Go Bagage — SubscriptionCard
 * Bandeau d'abonnement (CDC section 5.1 — Gratuit / Premium).
 */

import { View, Text, StyleSheet } from 'react-native'
import { Crown } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { SubscriptionType } from '../../../types/user.types'

interface SubscriptionCardProps {
  plan: SubscriptionType
}

export function SubscriptionCard({ plan }: SubscriptionCardProps) {
  const isPremium = plan === 'PREMIUM'

  return (
    <View style={styles.card}>
      <Crown size={22} color='#FFD600' />
      <View style={styles.textBlock}>
        <Text style={styles.title}>
          {isPremium ? 'Premium Member' : 'Free Plan'}
        </Text>
        <Text style={styles.subtitle}>
          {isPremium
            ? 'Priority listings · 0% extra fee · Priority support'
            : 'Upgrade to unlock unlimited transactions'}
        </Text>
      </View>
      <View
        style={[
          styles.badge,
          { backgroundColor: isPremium ? '#FFD600' : Colors.primary },
        ]}
      >
        <Text style={[styles.badgeText, isPremium && styles.badgeTextDark]}>
          {isPremium ? 'ACTIVE' : 'UPGRADE'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#2C3E50',
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  badge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
  badgeTextDark: {
    color: '#2C3E50',
  },
})

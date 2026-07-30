import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MessageCircle, Phone, Star } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface TravelerContactCardProps {
  initials: string
  name: string
  rating: number
  reviewCount: number
  verified: boolean
  onChat: () => void
  onCall: () => void
}

export function TravelerContactCard({
  initials,
  name,
  rating,
  reviewCount,
  verified,
  onChat,
  onCall,
}: TravelerContactCardProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t('tracking.your_traveler', 'Your Traveler')}
      </Text>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.metaRow}>
            <Star size={12} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.meta}>
              {rating.toFixed(1)} · {reviewCount}{' '}
              {t('tracking.reviews', 'reviews')}
              {verified ? ` · ${t('profile.kyc_verified')}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={onChat}
            activeOpacity={0.8}
          >
            <MessageCircle size={18} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callButton}
            onPress={onCall}
            activeOpacity={0.8}
          >
            <Phone size={18} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    marginBottom: Spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  info: { flex: 1 },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  actions: { flexDirection: 'row', gap: Spacing[2] },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

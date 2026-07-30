import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Star, CheckCircle, Calendar, Weight, Tag } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'
import type { PublicUser } from '../../../types/user.types'

interface TravelerCardProps {
  traveler: PublicUser
  initials: string
  from: string
  to: string
  departureDate: string
  availableKg: number
  pricePerKg: number
  totalTrips: number
  bio?: string
  onPress: () => void
}

export function TravelerCard({
  traveler,
  initials,
  from,
  to,
  departureDate,
  availableKg,
  pricePerKg,
  totalTrips,
  bio,
  onPress,
}: TravelerCardProps) {
  const { t } = useTranslation()
  const isVerified = traveler.kycStatus === 'VERIFIED'

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {traveler.firstName} {traveler.lastName}
            </Text>
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle size={10} color={Colors.primary} />
                <Text style={styles.verifiedText}>{t('admin.verified', 'Verified')}</Text>
              </View>
            )}
          </View>

          <View style={styles.ratingRow}>
            <Star size={12} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.ratingValue}>
              {traveler.averageRating.toFixed(1)}
            </Text>
            <Text style={styles.ratingMeta}>
              {t('parcel.traveler_meta', '({{count}} reviews) · {{trips}} trips', {
                count: traveler.totalDeliveries,
                trips: totalTrips,
              })}
            </Text>
          </View>

          {bio ? (
            <Text style={styles.bio} numberOfLines={2}>
              {bio}
            </Text>
          ) : null}

          <View style={styles.routeRow}>
            <RouteLabel
              from={from}
              to={to}
              size='xs'
              arrowColor={Colors.mutedForeground}
            />
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={12} color={Colors.mutedForeground} />
              <Text style={styles.metaText}>{departureDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Weight size={12} color={Colors.mutedForeground} />
              <Text style={styles.metaText}>
                {t('parcel.kg_left', '{{value}} kg left', { value: availableKg })}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Tag size={12} color={Colors.primary} />
              <Text style={styles.priceText}>${pricePerKg}/kg</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
  },
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
  info: {
    flex: 1,
    gap: Spacing[1],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e8faf0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  ratingMeta: {
    fontSize: FontSize.sm,
    color: '#9ca3af',
  },
  bio: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    fontStyle: 'italic',
    lineHeight: FontSize.sm * 1.5,
    marginTop: 2,
  },
  routeRow: {
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  priceText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
})

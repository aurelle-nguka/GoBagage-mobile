import { View, Text, StyleSheet } from 'react-native'
import { MapPin, Plane } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface TrackingMapPlaceholderProps {
  from: string
  to: string
  progressPercent: number
  statusLabel: string
}

export function TrackingMapPlaceholder({
  from,
  to,
  progressPercent,
  statusLabel,
}: TrackingMapPlaceholderProps) {
  const segments = 6
  const filledSegments = Math.round((progressPercent / 100) * segments)

  return (
    <View style={styles.container}>
      <View style={styles.routeRow}>
        <View style={styles.cityBlock}>
          <MapPin size={16} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.cityLabel}>{from}</Text>
        </View>

        <View style={styles.lineRow}>
          {Array.from({ length: segments }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  backgroundColor:
                    i < filledSegments ? Colors.primary : '#e5e7eb',
                },
              ]}
            />
          ))}
          <Plane size={18} color={Colors.primary} style={styles.planeIcon} />
        </View>

        <View style={styles.cityBlock}>
          <Text style={styles.cityLabel}>{to}</Text>
          <MapPin size={16} color='#9ca3af' />
        </View>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{statusLabel}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: Radius['2xl'],
    backgroundColor: '#e8f4fd',
    marginHorizontal: Spacing[5],
    marginTop: Spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  cityBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  segment: {
    flex: 1,
    height: 2,
  },
  planeIcon: {
    marginHorizontal: 4,
  },
  statusBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  statusText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
})

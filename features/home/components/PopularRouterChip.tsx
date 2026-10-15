import { TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface PopularRouteChipProps {
  from: string
  to: string
  onPress: () => void
}

export function PopularRouteChip({ from, to, onPress }: PopularRouteChipProps) {
  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <RouteLabel
        from={from}
        to={to}
        size='sm'
        arrowColor={Colors.mutedForeground}
        color={Colors.foreground}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
})

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { Colors, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface PopularCorridorRowProps {
  from: string
  to: string
  onPress: () => void
}

export function PopularCorridorRow({
  from,
  to,
  onPress,
}: PopularCorridorRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.left}>
        <Text style={styles.emoji}>✈️</Text>
        <RouteLabel from={from} to={to} size='md' />
      </View>
      <ChevronRight size={16} color='#9ca3af' />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing[4],
    borderRadius: Radius.xl,
    marginBottom: Spacing[2],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    flex: 1,
  },
  emoji: {
    fontSize: 20,
  },
})

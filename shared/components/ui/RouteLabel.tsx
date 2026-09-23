import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { ArrowRight } from 'lucide-react-native'
import { Colors, FontSize } from '../../../theme'

export interface RouteLabelProps {
  from: string
  to: string
  suffix?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
  arrowColor?: string
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const SIZE_MAP = {
  xs: { fontSize: FontSize.xs, arrowSize: 10, gap: 3 },
  sm: { fontSize: FontSize.sm, arrowSize: 12, gap: 4 },
  md: { fontSize: FontSize.md, arrowSize: 14, gap: 5 },
  lg: { fontSize: FontSize.xl, arrowSize: 16, gap: 6 },
}

const WEIGHT_MAP = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
}

export function RouteLabel({
  from,
  to,
  suffix,
  size = 'md',
  color = Colors.foreground,
  arrowColor = Colors.primary,
  fontWeight = 'semibold',
  style,
  textStyle,
}: RouteLabelProps) {
  const { fontSize, arrowSize, gap } = SIZE_MAP[size]
  const weight = WEIGHT_MAP[fontWeight]

  return (
    <View style={[styles.row, { gap }, style]}>
      <Text
        style={[styles.cityText, { fontSize, color, fontWeight: weight }, textStyle]}
        numberOfLines={1}
      >
        {from}
      </Text>

      <ArrowRight size={arrowSize} color={arrowColor} strokeWidth={2.5} />

      <Text
        style={[styles.cityText, { fontSize, color, fontWeight: weight }, textStyle]}
        numberOfLines={1}
      >
        {to}
      </Text>

      {suffix ? (
        <Text
          style={[styles.suffixText, { fontSize, color, fontWeight: '400' }, textStyle]}
          numberOfLines={1}
        >
          {suffix}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    flexShrink: 1,
  },
  suffixText: {
    flexShrink: 1,
  },
})

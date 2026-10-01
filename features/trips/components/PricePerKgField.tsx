import { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { COMMISSION_RATE } from '../../../shared/constants/app.constants'

interface PricePerKgFieldProps {
  pricePerKg: string
  onChangePricePerKg: (value: string) => void
  availableKg: number
}

export function PricePerKgField({
  pricePerKg,
  onChangePricePerKg,
  availableKg,
}: PricePerKgFieldProps) {
  const { t } = useTranslation()
  const [focused, setFocused] = useState(false)

  const numericPrice = Number(pricePerKg) || 0
  const estimatedEarnings = Math.round(
    numericPrice * availableKg * (1 - COMMISSION_RATE),
  )

  return (
    <View>
      <Text style={styles.label}>
        {t('trip.price_per_kg_cad', 'Price per kg (CAD)')}
      </Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.dollarSign}>$</Text>
        <TextInput
          value={pricePerKg}
          onChangeText={onChangePricePerKg}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType='numeric'
          style={[styles.input, focused && styles.inputFocused]}
        />
      </View>

      {numericPrice > 0 && availableKg > 0 && (
        <Text style={styles.earningsText}>
          {t(
            'trip.potential_earnings',
            'Potential earnings: ${{amount}} CAD (after {{percent}}% fee)',
            { amount: estimatedEarnings, percent: COMMISSION_RATE * 100 },
          )}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  dollarSign: {
    position: 'absolute',
    left: Spacing[4],
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.mutedForeground,
    zIndex: 1,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingLeft: 28,
    paddingRight: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.md,
    color: Colors.foreground,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  earningsText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginTop: 6,
  },
})

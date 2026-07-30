/**
 * Go Bagage — WeightSlider
 * Slider natif pour le poids disponible (remplace <input type="range">).
 */

import { View, Text, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { MAX_PARCEL_WEIGHT_KG } from '../../../shared/constants/app.constants'

interface WeightSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function WeightSlider({
  value,
  onChange,
  min = 1,
  max = MAX_PARCEL_WEIGHT_KG + 20, // 50 kg comme la maquette (bagage voyageur, pas colis)
}: WeightSliderProps) {
  const { t } = useTranslation()

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{t('trip.available_weight', 'Available Weight')}</Text>
        <View style={styles.valueBadge}>
          <Text style={styles.valueText}>{t('trip.weight_kg', '{{value}} kg', { value })}</Text>
        </View>
      </View>

      <Slider
        value={value}
        onValueChange={onChange}
        minimumValue={min}
        maximumValue={max}
        step={1}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor='#e5e7eb'
        thumbTintColor={Colors.primary}
      />

      <View style={styles.boundsRow}>
        <Text style={styles.boundsText}>{t('trip.weight_kg', '{{value}} kg', { value: min })}</Text>
        <Text style={styles.boundsText}>{t('trip.weight_kg', '{{value}} kg', { value: max })}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[2],
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  valueBadge: {
    backgroundColor: '#e8faf0',
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  valueText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  boundsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  boundsText: {
    fontSize: 11,
    color: '#9ca3af',
  },
})

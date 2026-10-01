import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface DepartureDateFieldProps {
  value: Date | null
  onChange: (date: Date) => void
}

export function DepartureDateField({
  value,
  onChange,
}: DepartureDateFieldProps) {
  const { t } = useTranslation()
  const [showPicker, setShowPicker] = useState(false)

  const handleChange = (_event: unknown, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios')
    if (selectedDate) onChange(selectedDate)
  }

  const formattedValue = value
    ? new Intl.DateTimeFormat('en-CA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(value)
    : ''

  return (
    <View>
      <Text
        style={styles.label}
      >{`${t('trip.departure_date', 'Departure Date')} *`}</Text>

      <TouchableOpacity
        style={styles.fieldButton}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.fieldText, !value && styles.placeholderText]}>
          {formattedValue || t('trip.select_date', 'Select a date')}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value ?? new Date()}
          mode='date'
          minimumDate={new Date()}
          onChange={handleChange}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
        />
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
  fieldButton: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  fieldText: {
    fontSize: FontSize.md,
    color: Colors.foreground,
  },
  placeholderText: {
    color: '#9ca3af',
  },
})

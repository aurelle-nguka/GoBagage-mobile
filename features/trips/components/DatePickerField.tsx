/**
 * Go Bagage — DatePickerField
 * Sélecteur de date natif (remplace <input type="date"> de la maquette web).
 */

import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface DatePickerFieldProps {
  label: string
  value: Date | null
  onChange: (date: Date) => void
  minimumDate?: Date
}

export function DatePickerField({
  label,
  value,
  onChange,
  minimumDate = new Date(),
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false)

  const displayValue = value
    ? new Intl.DateTimeFormat('en-CA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(value)
    : ''

  const handleChange = (event: { type: string }, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false)
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate)
    }
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.field}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.value, !displayValue && styles.placeholder]}>
          {displayValue || 'Select a date'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value ?? minimumDate}
          mode='date'
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={minimumDate}
          onChange={handleChange}
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
  field: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  value: {
    fontSize: FontSize.md,
    color: Colors.foreground,
  },
  placeholder: {
    color: '#9ca3af',
  },
})

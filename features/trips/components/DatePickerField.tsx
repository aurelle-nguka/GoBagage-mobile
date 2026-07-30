import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Calendar, Clock } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface DatePickerFieldProps {
  label: string
  value: Date | null
  onChange: (date: Date) => void
  minimumDate?: Date
  showTimePicker?: boolean
  timeValue?: string
  onTimeChange?: (time: string) => void
}

export function DatePickerField({
  label,
  value,
  onChange,
  minimumDate = new Date(),
  showTimePicker = false,
  timeValue,
  onTimeChange,
}: DatePickerFieldProps) {
  const { t } = useTranslation()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePickerModal, setShowTimePickerModal] = useState(false)

  const displayDate = value
    ? new Intl.DateTimeFormat('en-CA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(value)
    : ''

  const timeAsDate = (): Date => {
    const base = value ?? new Date()
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number)
      const d = new Date(base)
      d.setHours(hours, minutes, 0, 0)
      return d
    }
    return base
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.field}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Calendar size={18} color={value ? Colors.primary : '#9ca3af'} />
        <Text style={[styles.value, !displayDate && styles.placeholder]}>
          {displayDate || t('trip.select_date', 'Select a date')}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={value ?? minimumDate}
          mode='date'
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          minimumDate={minimumDate}
          onChange={(event, date) => {
            if (Platform.OS === 'android') setShowDatePicker(false)
            if (event.type === 'set' && date) onChange(date)
          }}
          onDismiss={() => setShowDatePicker(false)}
        />
      )}

      {showTimePicker && (
        <>
          <Text style={[styles.label, { marginTop: Spacing[3] }]}>
            {t('trip.departure_time_optional', 'Departure Time (optional)')}
          </Text>
          <TouchableOpacity
            style={styles.field}
            onPress={() => setShowTimePickerModal(true)}
            activeOpacity={0.7}
          >
            <Clock size={18} color={timeValue ? Colors.primary : '#9ca3af'} />
            <Text style={[styles.value, !timeValue && styles.placeholder]}>
              {timeValue || t('trip.select_time', 'Select a time')}
            </Text>
          </TouchableOpacity>
          {showTimePickerModal && (
            <DateTimePicker
              value={timeAsDate()}
              mode='time'
              display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
              is24Hour
              onChange={(event, date) => {
                if (Platform.OS === 'android') setShowTimePickerModal(false)
                if (event.type === 'set' && date) {
                  const hours = String(date.getHours()).padStart(2, '0')
                  const minutes = String(date.getMinutes()).padStart(2, '0')
                  onTimeChange?.(`${hours}:${minutes}`)
                }
              }}
              onDismiss={() => setShowTimePickerModal(false)}
            />
          )}
        </>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
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
    flex: 1,
  },
  placeholder: {
    color: '#9ca3af',
  },
})

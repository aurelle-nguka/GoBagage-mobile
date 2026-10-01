import { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'

interface RouteFieldInputProps {
  label: string
  value: string
  onChangeText: (value: string) => void
  placeholder: string
  icon: string
}

export function RouteFieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
}: RouteFieldInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.icon}>{icon}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor='#9ca3af'
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, focused && styles.inputFocused]}
        />
      </View>
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
  icon: {
    position: 'absolute',
    left: Spacing[3],
    fontSize: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingLeft: 36,
    paddingRight: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.md,
    color: Colors.foreground,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
})

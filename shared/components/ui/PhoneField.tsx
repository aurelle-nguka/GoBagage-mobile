import { useRef } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import PhoneInput from 'react-native-phone-number-input'
import { Colors, FontSize, Radius, Spacing } from '../../../theme'

interface PhoneFieldProps {
  label?: string
  value: string
  onChangeText: (phone: string) => void
  error?: string
}

export function PhoneField({ value, onChangeText, error }: PhoneFieldProps) {
  const phoneInput = useRef<PhoneInput>(null)

  return (
    <View>
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode='CM'
        layout='first'
        onChangeFormattedText={(text) => onChangeText(text)}
        withDarkTheme={false}
        withShadow={false}
        containerStyle={[
          styles.container,
          error ? styles.containerError : null,
        ]}
        textContainerStyle={styles.textContainer}
        textInputStyle={styles.textInput}
        codeTextStyle={styles.codeText}
        flagButtonStyle={styles.flagButton}
        placeholder='******************'
        countryPickerProps={{
          withFlag: true,
          withFilter: true,
          withCountryNameButton: false,
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
  },
  containerError: {
    borderColor: Colors.destructive,
    backgroundColor: '#fef2f2',
  },
  textContainer: {
    backgroundColor: 'transparent',
    borderRadius: Radius.xl,
    paddingVertical: 0,
  },
  textInput: {
    fontSize: FontSize.md,
    color: Colors.foreground,
    paddingVertical: Spacing[3],
  },
  codeText: {
    fontSize: FontSize.md,
    color: Colors.foreground,
  },
  flagButton: {
    paddingLeft: Spacing[2],
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    marginTop: Spacing[1],
  },
  flagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing[3],
    paddingRight: Spacing[2],
    gap: 4,
  },
  flagEmoji: {
    fontSize: 20,
  },
})

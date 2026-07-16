import { View } from 'react-native'
import { StyleSheet } from 'react-native'
import { TextField } from '../../../shared/components/ui/TextField'
import { Spacing } from '../../../theme'

interface RecipientFormErrors {
  name?: string
  phone?: string
  address?: string
}

interface RecipientFormProps {
  name: string
  phone: string
  address: string
  onChangeName: (value: string) => void
  onChangePhone: (value: string) => void
  onChangeAddress: (value: string) => void
  errors?: RecipientFormErrors
}

export function RecipientForm({
  name,
  phone,
  address,
  onChangeName,
  onChangePhone,
  onChangeAddress,
  errors = {},
}: RecipientFormProps) {
  return (
    <View style={styles.container}>
      <TextField
        label='Full Name *'
        value={name}
        onChangeText={onChangeName}
        placeholder='Jean-Baptiste Mbeki'
        error={errors.name}
      />
      <TextField
        label='Phone Number *'
        value={phone}
        onChangeText={onChangePhone}
        placeholder='+237 6XX XXX XXX'
        keyboardType='phone-pad'
        error={errors.phone}
      />
      <TextField
        label='Full Address *'
        value={address}
        onChangeText={onChangeAddress}
        placeholder='Street, City, Country'
        error={errors.address}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: Spacing[4] },
})

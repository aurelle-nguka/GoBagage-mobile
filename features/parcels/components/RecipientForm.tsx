import { View } from 'react-native'
import { StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { TextField } from '../../../shared/components/ui/TextField'
import { PhoneField } from '../../../shared/components/ui/PhoneField'
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
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <TextField
        label={`${t('parcel.recipient_name', 'Full Name')} *`}
        value={name}
        onChangeText={onChangeName}
        placeholder={t('parcel.recipient_name_placeholder', 'Jean-Baptiste Mbeki')}
        error={errors.name}
      />
      <PhoneField
        value={phone}
        onChangeText={onChangePhone}
        error={errors.phone}
      />
      <TextField
        label={`${t('parcel.recipient_address', 'Full Address')} *`}
        value={address}
        onChangeText={onChangeAddress}
        placeholder={t('parcel.recipient_address_placeholder', 'Street, City, Country')}
        error={errors.address}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: Spacing[4] },
})

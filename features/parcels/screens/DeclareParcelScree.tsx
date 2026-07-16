import { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SearchHeader } from '../components/SearchHeader'
import { SelectedTravelerSummary } from '../components/SelectedTravelerSummary'
import { ParcelFormSection } from '../components/ParcelFormSection'
import { ParcelCategoryPicker } from '../components/ParcelCategoryPicker'
import { RecipientForm } from '../components/RecipientForm'
import { DeclarationCheckbox } from '../components/DeclarationCheckbox'
import { ElectronicSignaturePad } from '../components/ElectronicSignaturePad'
import { PhotoUploader } from '../components/PhotoUpload'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import type { ParcelCategory } from '../../../types/common.types'
import { useCreateBooking } from '../../../features/bookings/hooks/useCreateBooking'

interface SelectedTravelerInfo {
  tripId: string
  initials: string
  name: string
  from: string
  to: string
  departureDate: string
  pricePerKg: number
  availableKg: number
}

interface DeclareParcelScreenProps {
  traveler: SelectedTravelerInfo
  currentUserFullName: string
  onBack: () => void
  onSuccess: (bookingId: string) => void
}

interface FieldErrors {
  description?: string
  weight?: string
  recipientName?: string
  recipientPhone?: string
  recipientAddress?: string
  declared?: string
  signed?: string
}

export function DeclareParcelScreen({
  traveler,
  currentUserFullName,
  onBack,
  onSuccess,
}: DeclareParcelScreenProps) {
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [category, setCategory] = useState<ParcelCategory>('CLOTHING')
  const [photos, setPhotos] = useState<string[]>([])
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [declared, setDeclared] = useState(false)
  const [signed, setSigned] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const { loading, error: bookingError, step, submit } = useCreateBooking()

  const getLoadingLabel = () => {
    switch (step) {
      case 'creating_parcel':
        return 'Creating parcel...'
      case 'signing':
        return 'Signing declaration...'
      case 'booking':
        return 'Booking trip...'
      default:
        return 'Processing...'
    }
  }

  const validate = (): boolean => {
    const errors: FieldErrors = {}

    if (!description.trim()) errors.description = 'Description is required.'
    else if (description.trim().length < 10)
      errors.description = 'Description must be at least 10 characters.'

    if (!weight) errors.weight = 'Weight is required.'
    else if (isNaN(Number(weight)) || Number(weight) < 0.1)
      errors.weight = 'Weight must be at least 0.1 kg.'
    else if (Number(weight) > traveler.availableKg)
      errors.weight = `Max available weight is ${traveler.availableKg} kg.`

    if (!recipientName.trim())
      errors.recipientName = 'Recipient name is required.'
    else if (recipientName.trim().length < 2)
      errors.recipientName = 'Name must be at least 2 characters.'

    if (!recipientPhone.trim())
      errors.recipientPhone = 'Recipient phone is required.'
    else if (!/^\+[1-9]\d{7,14}$/.test(recipientPhone.trim()))
      errors.recipientPhone = 'Use international format: +237650255873'

    if (!recipientAddress.trim())
      errors.recipientAddress = 'Recipient address is required.'
    else if (recipientAddress.trim().length < 10)
      errors.recipientAddress = 'Address must be at least 10 characters.'

    if (!declared) errors.declared = 'You must confirm the declaration.'

    if (!signed) errors.signed = 'Electronic signature is required.'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const booking = await submit({
      parcel: {
        description: description.trim(),
        estimatedWeightKg: Number(weight),
        category,
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        recipientAddress: recipientAddress.trim(),
      },
      tripId: traveler.tripId,
      requestedKg: Number(weight),
    })

    if (booking) onSuccess(booking.id)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader
        title='Declare Your Parcel'
        subtitle={`via ${traveler.name}`}
        onBack={onBack}
      />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <SelectedTravelerSummary
          initials={traveler.initials}
          name={traveler.name}
          from={traveler.from}
          to={traveler.to}
          departureDate={traveler.departureDate}
          pricePerKg={traveler.pricePerKg}
        />

        <ParcelFormSection title='📦 Parcel Details'>
          <View>
            <Text style={styles.fieldLabel}>
              Description * (min. 10 characters)
            </Text>
            <TextInput
              value={description}
              onChangeText={(v) => {
                setDescription(v)
                if (fieldErrors.description)
                  setFieldErrors((e) => ({ ...e, description: undefined }))
              }}
              placeholder='e.g. Clothing items, family gifts, documents'
              placeholderTextColor='#9ca3af'
              style={[
                styles.textInput,
                fieldErrors.description && styles.textInputError,
              ]}
              multiline
            />
            {fieldErrors.description ? (
              <Text style={styles.fieldError}>⚠ {fieldErrors.description}</Text>
            ) : null}
          </View>

          <View>
            <Text style={styles.fieldLabel}>Weight (kg) *</Text>
            <TextInput
              value={weight}
              onChangeText={(v) => {
                setWeight(v)
                if (fieldErrors.weight)
                  setFieldErrors((e) => ({ ...e, weight: undefined }))
              }}
              placeholder='e.g. 3.5'
              placeholderTextColor='#9ca3af'
              keyboardType='numeric'
              style={[
                styles.textInput,
                fieldErrors.weight && styles.textInputError,
              ]}
            />
            {fieldErrors.weight ? (
              <Text style={styles.fieldError}>⚠ {fieldErrors.weight}</Text>
            ) : (
              <Text style={styles.maxWeightHint}>
                Max {traveler.availableKg} kg available on this trip
              </Text>
            )}
          </View>

          <ParcelCategoryPicker selected={category} onSelect={setCategory} />
          <PhotoUploader photos={photos} onChange={setPhotos} />
        </ParcelFormSection>

        <ParcelFormSection title='👤 Recipient Details'>
          <RecipientForm
            name={recipientName}
            phone={recipientPhone}
            address={recipientAddress}
            onChangeName={(v) => {
              setRecipientName(v)
              if (fieldErrors.recipientName)
                setFieldErrors((e) => ({ ...e, recipientName: undefined }))
            }}
            onChangePhone={(v) => {
              setRecipientPhone(v)
              if (fieldErrors.recipientPhone)
                setFieldErrors((e) => ({ ...e, recipientPhone: undefined }))
            }}
            onChangeAddress={(v) => {
              setRecipientAddress(v)
              if (fieldErrors.recipientAddress)
                setFieldErrors((e) => ({ ...e, recipientAddress: undefined }))
            }}
            errors={{
              name: fieldErrors.recipientName,
              phone: fieldErrors.recipientPhone,
              address: fieldErrors.recipientAddress,
            }}
          />
        </ParcelFormSection>

        <ParcelFormSection title='📋 Legal Declaration'>
          <DeclarationCheckbox
            checked={declared}
            onToggle={() => {
              setDeclared((v) => !v)
              setFieldErrors((e) => ({ ...e, declared: undefined }))
            }}
            error={fieldErrors.declared}
          />
          <ElectronicSignaturePad
            signed={signed}
            signerName={currentUserFullName}
            onToggle={() => {
              setSigned((v) => !v)
              setFieldErrors((e) => ({ ...e, signed: undefined }))
            }}
            error={fieldErrors.signed}
          />
        </ParcelFormSection>

        {bookingError ? <ErrorBanner message={bookingError} /> : null}

        <PrimaryButton
          label='Continue to Payment'
          loadingLabel={getLoadingLabel()}
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[5] },
  fieldLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.base,
    color: Colors.foreground,
  },
  textInputError: {
    borderColor: Colors.destructive,
    backgroundColor: '#fef2f2',
  },
  fieldError: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    marginTop: Spacing[1],
  },
  maxWeightHint: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  submitButton: { marginBottom: Spacing[8] },
})

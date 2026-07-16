import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { ArrowLeft } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { FormSection } from '../components/FormSection'
import { DatePickerField } from '../components/DatePickerField'
import { WeightSlider } from '../components/WeightSlider'
import { PriceField } from '../components/PriceField'
import { CategorySelector } from '../components/CategorySelector'
import { TripSuccessView } from '../components/TripSuccessView'
import { CorridorPicker } from '../../../features/corridors/components/CorridorPicker'
import { useCorridors } from '../../../features/corridors/hooks/useCorridors'
import type { CorridorResponse } from '../../../features/corridors/types/corridor.types'
import type { ParcelCategory, PickupMode } from '../../../types/common.types'
import type { CreateTripDto } from '../types/trip.types'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import apiClient from '../../../shared/services/api.client'

interface PublishTripScreenProps {
  onBack: () => void
  onSuccess: () => void
}

const DEFAULT_CATEGORIES: ParcelCategory[] = ['CLOTHING', 'DOCUMENTS']

const PICKUP_MODES: { id: PickupMode; label: string; emoji: string }[] = [
  { id: 'AIRPORT', label: 'Airport', emoji: '✈️' },
  { id: 'HOME', label: 'Home', emoji: '🏠' },
  { id: 'MEETING_POINT', label: 'Meeting Point', emoji: '📍' },
]

interface FieldErrors {
  corridor?: string
  departureDate?: string
  categories?: string
  price?: string
}

export function PublishTripScreen({
  onBack,
  onSuccess,
}: PublishTripScreenProps) {
  const { corridors, loading: corridorsLoading } = useCorridors()

  const [selectedCorridor, setSelectedCorridor] =
    useState<CorridorResponse | null>(null)
  const [departureDate, setDepartureDate] = useState<Date | null>(null)
  const [departureTime, setDepartureTime] = useState('')
  const [availableKg, setAvailableKg] = useState(15)
  const [pricePerKg, setPricePerKg] = useState('12')
  const [selectedCategories, setSelectedCategories] =
    useState<ParcelCategory[]>(DEFAULT_CATEGORIES)
  const [restrictions, setRestrictions] = useState(
    'No liquids, no fragile items',
  )
  const [pickupMode, setPickupMode] = useState<PickupMode>('AIRPORT')
  const [pickupDetails, setPickupDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [success, setSuccess] = useState(false)

  const toggleCategory = (category: ParcelCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    )
    if (fieldErrors.categories)
      setFieldErrors((e) => ({ ...e, categories: undefined }))
  }

  const validate = (): boolean => {
    const errors: FieldErrors = {}

    if (!selectedCorridor) errors.corridor = 'Please select a corridor.'

    if (!departureDate) errors.departureDate = 'Please select a departure date.'
    else if (departureDate < new Date())
      errors.departureDate = 'Departure date must be in the future.'

    if (selectedCategories.length === 0)
      errors.categories = 'Please select at least one accepted category.'

    if (!pricePerKg || Number(pricePerKg) <= 0)
      errors.price = 'Please enter a valid price per kg.'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setApiError('')
    setLoading(true)

    try {
      const payload: CreateTripDto = {
        corridorId: String(selectedCorridor!.id),
        departureDate: departureDate!.toISOString().split('T')[0],
        departureTime: departureTime || undefined,
        availableKg,
        pricePerKg: Number(pricePerKg),
        acceptedCategories: selectedCategories,
        restrictions: restrictions || undefined,
        pickupMode,
        pickupDetails: pickupDetails || undefined,
      }

      await apiClient.post('/trips', payload)
      setSuccess(true)
      setTimeout(onSuccess, 1800)
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ??
          'Failed to publish trip. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <TripSuccessView
        origin={selectedCorridor?.departureCity ?? ''}
        destination={selectedCorridor?.arrivalCity ?? ''}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Publish a Trip</Text>
          <Text style={styles.headerSubtitle}>
            Earn from your empty luggage
          </Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <FormSection title='Route Details'>
          <View>
            <CorridorPicker
              label='Corridor *'
              corridors={corridors}
              loading={corridorsLoading}
              selected={selectedCorridor}
              onSelect={(c) => {
                setSelectedCorridor(c)
                setFieldErrors((e) => ({ ...e, corridor: undefined }))
              }}
              placeholder='Select a corridor'
            />
            {fieldErrors.corridor ? (
              <Text style={styles.fieldError}>⚠ {fieldErrors.corridor}</Text>
            ) : null}
          </View>

          {selectedCorridor?.regulatoryInfo && (
            <View style={styles.infoBanner}>
              <Text>ℹ️</Text>
              <Text style={styles.infoText}>
                {selectedCorridor.regulatoryInfo}
              </Text>
            </View>
          )}

          <View>
            <DatePickerField
              label='Departure Date *'
              value={departureDate}
              onChange={(d) => {
                setDepartureDate(d)
                setFieldErrors((e) => ({ ...e, departureDate: undefined }))
              }}
            />
            {fieldErrors.departureDate ? (
              <Text style={styles.fieldError}>
                ⚠ {fieldErrors.departureDate}
              </Text>
            ) : null}
          </View>

          <View>
            <Text style={styles.fieldLabel}>Departure Time (optional)</Text>
            <TextInput
              value={departureTime}
              onChangeText={setDepartureTime}
              placeholder='e.g. 14:30'
              placeholderTextColor='#9ca3af'
              style={styles.input}
              keyboardType='numbers-and-punctuation'
              maxLength={5}
            />
          </View>
        </FormSection>

        <FormSection title='Luggage Offer'>
          <WeightSlider value={availableKg} onChange={setAvailableKg} />
          <View>
            <PriceField
              pricePerKg={pricePerKg}
              onChangePricePerKg={(v) => {
                setPricePerKg(v)
                setFieldErrors((e) => ({ ...e, price: undefined }))
              }}
              availableKg={availableKg}
            />
            {fieldErrors.price ? (
              <Text style={styles.fieldError}>⚠ {fieldErrors.price}</Text>
            ) : null}
          </View>
          {selectedCorridor?.basePricePerKg && (
            <Text style={styles.hint}>
              💡 Suggested base price: ${selectedCorridor.basePricePerKg}/kg
            </Text>
          )}
        </FormSection>

        <FormSection title='Accepted Categories'>
          <CategorySelector
            selected={selectedCategories}
            onToggle={toggleCategory}
          />
          {fieldErrors.categories ? (
            <Text style={styles.fieldError}>⚠ {fieldErrors.categories}</Text>
          ) : null}
        </FormSection>

        <FormSection title='Pickup Mode *'>
          <View style={styles.pickupRow}>
            {PICKUP_MODES.map((mode) => {
              const isSelected = pickupMode === mode.id
              return (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.pickupCard,
                    isSelected && styles.pickupCardSelected,
                  ]}
                  onPress={() => setPickupMode(mode.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.pickupEmoji}>{mode.emoji}</Text>
                  <Text
                    style={[
                      styles.pickupLabel,
                      isSelected && styles.pickupLabelSelected,
                    ]}
                  >
                    {mode.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <View style={{ marginTop: Spacing[3] }}>
            <Text style={styles.fieldLabel}>Pickup Details (optional)</Text>
            <TextInput
              value={pickupDetails}
              onChangeText={setPickupDetails}
              placeholder='e.g. Terminal 1, Arrival hall'
              placeholderTextColor='#9ca3af'
              style={styles.input}
            />
          </View>
        </FormSection>

        <FormSection title='Restrictions / Notes'>
          <TextInput
            value={restrictions}
            onChangeText={setRestrictions}
            multiline
            numberOfLines={3}
            placeholder='e.g. No liquids, no fragile items, no batteries...'
            placeholderTextColor='#9ca3af'
            style={styles.textarea}
          />
        </FormSection>

        {apiError ? <ErrorBanner message={apiError} /> : null}

        <PrimaryButton
          label='Publish Trip'
          loadingLabel='Publishing...'
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[5] },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
    backgroundColor: '#e8f4fd',
    borderRadius: Radius.xl,
    padding: Spacing[3],
    marginTop: Spacing[2],
  },
  infoText: { flex: 1, fontSize: FontSize.sm, color: '#1565C0' },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  fieldError: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    marginTop: Spacing[1],
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.base,
    color: Colors.foreground,
  },
  hint: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: Spacing[2],
  },
  pickupRow: { flexDirection: 'row', gap: Spacing[3] },
  pickupCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: Radius['2xl'],
    padding: Spacing[3],
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  pickupCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#e8faf0',
  },
  pickupEmoji: { fontSize: 22, marginBottom: 4 },
  pickupLabel: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  pickupLabelSelected: { color: Colors.primary, fontWeight: FontWeight.bold },
  textarea: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    padding: Spacing[4],
    fontSize: FontSize.base,
    color: Colors.foreground,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  submitButton: {
    marginBottom: Spacing[6],
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
})

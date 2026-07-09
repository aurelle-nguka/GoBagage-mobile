/**
 * Go Bagage — PublishTripScreen
 * Formulaire de création d'une annonce de trajet (module Trips — CDC section 6.2).
 * Migré depuis PublishTrip.tsx (maquette web) → React Native.
 */

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
import { RouteFieldInput } from '../components/RouteFieldInput'
import { DatePickerField } from '../components/DatePickerField'
import { WeightSlider } from '../components/WeightSlider'
import { PriceField } from '../components/PriceField'
import { CategorySelector } from '../components/CategorySelector'
import { TripSuccessView } from '../components/TripSuccessView'

import type { ParcelCategory, PickupMode } from '../../../types/common.types'
import type { CreateTripDto } from '../types/trip.types'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'

interface PublishTripScreenProps {
  onBack: () => void
  onSuccess: () => void
}

const DEFAULT_CATEGORIES: ParcelCategory[] = ['CLOTHING', 'DOCUMENTS']

export function PublishTripScreen({
  onBack,
  onSuccess,
}: PublishTripScreenProps) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState<Date | null>(null)
  const [availableKg, setAvailableKg] = useState(15)
  const [pricePerKg, setPricePerKg] = useState('12')
  const [selectedCategories, setSelectedCategories] =
    useState<ParcelCategory[]>(DEFAULT_CATEGORIES)
  const [restrictions, setRestrictions] = useState(
    'No liquids, no fragile items',
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const toggleCategory = (category: ParcelCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    )
  }

  const handleSubmit = () => {
    if (!origin || !destination || !departureDate) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setLoading(true)

    // TODO: brancher features/trips/api/trips.api.ts → POST /trips
    const payload: CreateTripDto = {
      corridorId: '', // TODO: résoudre origin/destination → corridorId via GET /corridors
      departureDate: departureDate.toISOString(),
      availableKg,
      pricePerKg: Number(pricePerKg),
      acceptedCategories: selectedCategories,
      restrictions,
      pickupMode: 'AIRPORT' as PickupMode,
    }

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(onSuccess, 1800)
    }, 1200)
  }

  if (success) {
    return <TripSuccessView origin={origin} destination={destination} />
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
          <RouteFieldInput
            label='Origin City *'
            value={origin}
            onChangeText={setOrigin}
            placeholder='e.g. Montreal, QC'
            icon='🛫'
          />
          <RouteFieldInput
            label='Destination City *'
            value={destination}
            onChangeText={setDestination}
            placeholder='e.g. Douala, Cameroon'
            icon='🛬'
          />
          <DatePickerField
            label='Departure Date *'
            value={departureDate}
            onChange={setDepartureDate}
          />
        </FormSection>

        <FormSection title='Luggage Offer'>
          <WeightSlider value={availableKg} onChange={setAvailableKg} />
          <PriceField
            pricePerKg={pricePerKg}
            onChangePricePerKg={setPricePerKg}
            availableKg={availableKg}
          />
        </FormSection>

        <FormSection title='Accepted Categories'>
          <CategorySelector
            selected={selectedCategories}
            onToggle={toggleCategory}
          />
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

        {error ? <ErrorBanner message={error} /> : null}

        <PrimaryButton
          label='✈️ Publish Trip'
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[5],
  },
  textarea: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    padding: Spacing[4],
    fontSize: FontSize.base,
    color: Colors.foreground,
    lineHeight: FontSize.base * 1.6,
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

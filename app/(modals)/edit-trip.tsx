import { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { View, ActivityIndicator, Text, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, Spacing } from '../../theme'
import { PublishTripScreen } from '../../features/trips/screens/PublishTripScreen'
import apiClient from '../../shared/services/api.client'

export default function EditTripPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { tripId } = useLocalSearchParams<{ tripId: string }>()
  const [tripData, setTripData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiClient
      .get(`/trips/${tripId}`)
      .then((res) => {
        console.log('trip data:', JSON.stringify(res.data))
        setTripData(res.data)
      })
      .catch(() => setError(t('trip.errors.load_failed', 'Failed to load trip.')))
      .finally(() => setLoading(false))
  }, [tripId, t])

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </SafeAreaView>
    )
  }

  if (error || !tripData) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error || t('trip.errors.not_found', 'Trip not found.')}</Text>
      </SafeAreaView>
    )
  }

  return (
    <PublishTripScreen
      mode='edit'
      tripId={tripId}
      initialData={{
        corridorId: String(tripData.corridorId),
        departureDate: tripData.departureDate,
        departureTime: tripData.departureTime ?? '',
        availableKg: tripData.availableKg ?? 15,
        pricePerKg: String(tripData.pricePerKg ?? 12),
        acceptedCategories: tripData.acceptedCategories ?? [],
        restrictions: tripData.restrictions ?? '',
        pickupMode: tripData.pickupMode ?? 'AIRPORT',
        pickupDetails: tripData.pickupDetails ?? '',
      }}
      onBack={() => router.back()}
      onSuccess={() => {
        Alert.alert(
          t('trip.update_success_title', 'Success'),
          t('trip.update_success', 'Trip updated successfully!'),
        )
        router.back()
      }}
    />
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
})

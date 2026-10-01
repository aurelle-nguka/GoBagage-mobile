import { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ResultsScreen } from '../../features/parcels/screens/ResultsScreen'
import { SearchScreen } from '../../features/parcels/screens/SearchScreen'
import { useCorridors } from '../../features/corridors/hooks/useCorridors'
import type { CorridorResponse } from '../../features/corridors/types/corridor.types'

type SubScreen = 'search' | 'results'

export default function SearchPage() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    corridorId?: string
    from?: string
    to?: string
    query?: string
  }>()

  const { corridors } = useCorridors()
  const [sub, setSub] = useState<SubScreen>('search')
  const [selectedCorridorId, setSelectedCorridorId] = useState('')
  const [selectedCorridor, setSelectedCorridor] =
    useState<CorridorResponse | null>(null)

  useEffect(() => {
    if (params.corridorId || (params.from && params.to)) {
      const match = corridors.find(
        (c) =>
          (params.corridorId && String(c.id) === String(params.corridorId)) ||
          (params.from &&
            params.to &&
            c.departureCity.toLowerCase() === params.from.toLowerCase() &&
            c.arrivalCity.toLowerCase() === params.to.toLowerCase()),
      )

      if (match) {
        setSelectedCorridorId(String(match.id))
        setSelectedCorridor(match)
        setSub('results')
      } else {
        const fallbackCorridor: CorridorResponse = {
          id: Number(params.corridorId || 0),
          code: `${params.from || ''}-${params.to || ''}`,
          departureCountry: '',
          departureCity: params.from || '',
          arrivalCountry: '',
          arrivalCity: params.to || '',
          isActive: true,
          basePricePerKg: null,
          regulatoryInfo: null,
          createdAt: new Date().toISOString(),
        }
        setSelectedCorridorId(params.corridorId || String(fallbackCorridor.id))
        setSelectedCorridor(fallbackCorridor)
        setSub('results')
      }
    }
  }, [params.corridorId, params.from, params.to, corridors])

  const handleBackToSearch = () => {
    setSub('search')
    setSelectedCorridorId('')
    setSelectedCorridor(null)
  }

  if (sub === 'results' && selectedCorridor) {
    return (
      <ResultsScreen
        corridorId={selectedCorridorId}
        from={selectedCorridor.departureCity}
        to={selectedCorridor.arrivalCity}
        onBack={handleBackToSearch}
        onClearSearch={handleBackToSearch}
        onSelectTraveler={(result) => {
          router.push({
            pathname: '/(modals)/parcel-declare',
            params: {
              tripId: result.id,
              travelerId: result.id,
              initials: result.initials,
              name: `${result.user.firstName} ${result.user.lastName}`,
              from: selectedCorridor.departureCity,
              to: selectedCorridor.arrivalCity,
              departureDate: result.departureDate,
              pricePerKg: String(result.pricePerKg),
              availableKg: String(result.availableKg),
            },
          })
        }}
      />
    )
  }

  return (
    <SearchScreen
      onBack={() => router.back()}
      onSearch={(corridorId, corridor) => {
        setSelectedCorridorId(corridorId)
        setSelectedCorridor(corridor)
        setSub('results')
      }}
    />
  )
}

import { useState } from 'react'
import { useRouter } from 'expo-router'
import { ResultsScreen } from '../../features/parcels/screens/ResultsScreen'
import { SearchScreen } from '../../features/parcels/screens/SearchScreen'
import type { CorridorResponse } from '../../features/corridors/types/corridor.types'

type SubScreen = 'search' | 'results'

export default function SearchPage() {
  const router = useRouter()

  const [sub, setSub] = useState<SubScreen>('search')
  const [selectedCorridorId, setSelectedCorridorId] = useState('')
  const [selectedCorridor, setSelectedCorridor] =
    useState<CorridorResponse | null>(null)

  if (sub === 'results' && selectedCorridor) {
    return (
      <ResultsScreen
        corridorId={selectedCorridorId}
        from={selectedCorridor.departureCity}
        to={selectedCorridor.arrivalCity}
        onBack={() => setSub('search')}
        onClearSearch={() => setSub('search')}
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

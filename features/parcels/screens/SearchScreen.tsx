import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { SearchHeader } from '../components/SearchHeader'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { CorridorPicker } from '../../../features/corridors/components/CorridorPicker'
import { useCorridors } from '../../../features/corridors/hooks/useCorridors'
import type { CorridorResponse } from '../../../features/corridors/types/corridor.types'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'
import { ArrowRight } from 'lucide-react-native'

interface SearchScreenProps {
  initialQuery?: string
  onBack: () => void
  onSearch: (corridorId: string, corridor: CorridorResponse) => void
}

export function SearchScreen({
  initialQuery = '',
  onBack,
  onSearch,
}: SearchScreenProps) {
  const { corridors, loading, error } = useCorridors()
  const [selectedCorridor, setSelectedCorridor] =
    useState<CorridorResponse | null>(null)

  const handleSearch = () => {
    if (!selectedCorridor) return
    onSearch(String(selectedCorridor.id), selectedCorridor)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader
        title='Find a Traveler'
        subtitle='Select a corridor to search'
        onBack={onBack}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CorridorPicker
          label='Select a corridor *'
          corridors={corridors}
          loading={loading}
          selected={selectedCorridor}
          onSelect={setSelectedCorridor}
          placeholder='e.g. Montreal → Douala'
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton
          label='🔍 Search Travelers'
          onPress={handleSearch}
          disabled={!selectedCorridor}
          style={styles.searchButton}
        />

        {!loading && corridors.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Popular corridors</Text>
            {corridors.slice(0, 5).map((corridor) => (
              <PopularCorridorItem
                key={corridor.id}
                corridor={corridor}
                isSelected={selectedCorridor?.id === corridor.id}
                onPress={() => {
                  setSelectedCorridor(corridor)
                  onSearch(String(corridor.id), corridor)
                }}
              />
            ))}
          </>
        )}

        {loading && (
          <View style={styles.loadingState}>
            <ActivityIndicator size='small' color={Colors.primary} />
            <Text style={styles.loadingText}>Loading corridors...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function PopularCorridorItem({
  corridor,
  isSelected,
  onPress,
}: {
  corridor: CorridorResponse
  isSelected: boolean
  onPress: () => void
}) {
  return (
    <View
      style={[styles.corridorRow, isSelected && styles.corridorRowSelected]}
    >
      <View style={styles.corridorLeft}>
        <Text style={styles.corridorEmoji}>✈️</Text>
        <View style={styles.corridorInfo}>
          <RouteLabel
            from={corridor.departureCity}
            to={corridor.arrivalCity}
            size='md'
            color={isSelected ? Colors.primary : Colors.foreground}
            arrowColor={isSelected ? Colors.primary : Colors.mutedForeground}
          />
          <RouteLabel
            from={corridor.departureCountry}
            to={corridor.arrivalCountry}
            size='sm'
            color={isSelected ? Colors.primary : Colors.mutedForeground}
          />
        </View>
      </View>

      <View style={styles.corridorRight}>
        {corridor.basePricePerKg && (
          <Text style={styles.priceText}>${corridor.basePricePerKg}/kg</Text>
        )}
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {isSelected ? (
            <Text style={styles.selectTextSelected}>✓ Selected</Text>
          ) : (
            <View style={styles.selectRow}>
              <Text style={styles.selectText}>Select</Text>
              <ArrowRight
                size={12}
                color={Colors.mutedForeground}
                strokeWidth={2.5}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[5],
    gap: Spacing[4],
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  searchButton: {
    marginTop: Spacing[2],
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.mutedForeground,
    marginTop: Spacing[2],
  },
  corridorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  corridorRowSelected: {
    backgroundColor: '#e8faf0',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  corridorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    flex: 1,
  },
  corridorEmoji: { fontSize: 20 },
  corridorInfo: { flex: 1 },
  corridorSub: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  corridorRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priceText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  selectText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    fontWeight: FontWeight.medium,
  },
  selectTextSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[6],
  },
  loadingText: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})

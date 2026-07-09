import { FlatList, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchHeader } from '../components/SearchHeader';
import { SearchBar } from '../components/SearchBar';
import { TravelerCard } from '../components/TravelerCard';
import { PublicUser } from '../../../types/user.types';
import { Colors, FontSize, Spacing } from '../../../theme';

// TODO: remplacer par features/trips/hooks/useSearchTrips(query)
interface TravelerResult {
  id: string;
  user: PublicUser;
  initials: string;
  from: string;
  to: string;
  departureDate: string;
  availableKg: number;
  pricePerKg: number;
  totalTrips: number;
}

const MOCK_RESULTS: TravelerResult[] = [
  {
    id: '1',
    user: {
      id: 'u1', firstName: 'Kofi', lastName: 'Asante',
      averageRating: 4.9, totalDeliveries: 47, kycStatus: 'VERIFIED',
    },
    initials: 'KA', from: 'Montreal', to: 'Douala', departureDate: 'Jun 18, 2026',
    availableKg: 18, pricePerKg: 12, totalTrips: 23,
  },
  {
    id: '2',
    user: {
      id: 'u2', firstName: 'Marie', lastName: 'Laurent',
      averageRating: 4.7, totalDeliveries: 31, kycStatus: 'VERIFIED',
    },
    initials: 'ML', from: 'Montreal', to: 'Douala', departureDate: 'Jun 22, 2026',
    availableKg: 12, pricePerKg: 15, totalTrips: 15,
  },
  {
    id: '3',
    user: {
      id: 'u3', firstName: 'Ibrahim', lastName: 'Diallo',
      averageRating: 4.8, totalDeliveries: 19, kycStatus: 'PENDING',
    },
    initials: 'ID', from: 'Toronto', to: 'Douala', departureDate: 'Jun 28, 2026',
    availableKg: 25, pricePerKg: 10, totalTrips: 8,
  },
];

interface ResultsScreenProps {
  query: string;
  onBack: () => void;
  onClearSearch: () => void;
  onSelectTraveler: (result: TravelerResult) => void;
}

export function ResultsScreen({ query, onBack, onClearSearch, onSelectTraveler }: ResultsScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader title="Available Travelers" subtitle="Search by corridor" onBack={onBack} />

      <View style={styles.content}>
        <SearchBar
          value={query || 'Montreal → Douala'}
          onChangeText={() => {}}
          editable={false}
          onClear={onClearSearch}
        />

        <Text style={styles.resultCount}>{MOCK_RESULTS.length} travelers found</Text>

        <FlatList
          data={MOCK_RESULTS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TravelerCard
              traveler={item.user}
              initials={item.initials}
              from={item.from}
              to={item.to}
              departureDate={item.departureDate}
              availableKg={item.availableKg}
              pricePerKg={item.pricePerKg}
              totalTrips={item.totalTrips}
              onPress={() => onSelectTraveler(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
  },
  resultCount: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
  },
});

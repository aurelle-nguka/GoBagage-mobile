import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { SearchHeader } from '../components/SearchHeader';
import { SearchBar } from '../components/SearchBar';
import { PopularCorridorRow } from '../components/PopularCorridorRow';
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton';
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme';

// TODO: remplacer par features/trips/api → GET /corridors (populaires)
const POPULAR_CORRIDORS = [
  'Montreal → Douala',
  'Montreal → Paris',
  'Toronto → Abidjan',
  'Toronto → Lagos',
  'Paris → Dakar',
];

interface SearchScreenProps {
  initialQuery?: string;
  onBack: () => void;
  onSearch: (query: string) => void;
}

export function SearchScreen({ initialQuery = '', onBack, onSearch }: SearchScreenProps) {
  const [query, setQuery] = useState(initialQuery);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader title="Find a Traveler" subtitle="Search by corridor" onBack={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={() => onSearch(query)}
        />

        <PrimaryButton
          label="Search Travelers"
          onPress={() => onSearch(query)}
          style={styles.searchButton}
        />

        <Text style={styles.sectionLabel}>Popular corridors</Text>
        {POPULAR_CORRIDORS.map((route, i) => (
          <PopularCorridorRow key={i} route={route} onPress={() => onSearch(route)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[5],
  },
  searchButton: {
    marginTop: Spacing[4],
    marginBottom: Spacing[6],
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.mutedForeground,
    marginBottom: Spacing[3],
  },
});

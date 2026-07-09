import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ResultsScreen } from '../../features/parcels/screens/ResultsScreen';
import { SearchScreen } from '../../features/parcels/screens/SearchScreen';


type SubScreen = 'search' | 'results';

export default function SearchPage() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();

  const [sub, setSub] = useState<SubScreen>('search');
  const [query, setQuery] = useState(q ?? '');

  if (sub === 'results') {
    return (
      <ResultsScreen
        query={query}
        onBack={() => setSub('search')}
        onClearSearch={() => setSub('search')}
        onSelectTraveler={(result) => {
          router.push({
            pathname: '/(modals)/parcel-declare',
            params: {
              travelerId: result.id,
              initials: result.initials,
              name: `${result.user.firstName} ${result.user.lastName}`,
              from: result.from,
              to: result.to,
              departureDate: result.departureDate,
              pricePerKg: String(result.pricePerKg),
              availableKg: String(result.availableKg),
            },
          });
        }}
      />
    );
  }

  return (
    <SearchScreen
      initialQuery={query}
      onBack={() => router.back()}
      onSearch={(value) => {
        setQuery(value);
        setSub('results');
      }}
    />
  );
}

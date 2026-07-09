/**
 * Go Bagage — SenderDashboard
 * Vue expéditeur : recherche de corridor, routes populaires, colis récents.
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, Package } from 'lucide-react-native';
import { RecentParcelCard } from './RecentParcelCard';
import { PopularRouteChip } from './PopularRouterChip';
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme';


// TODO: remplacer par features/parcels/hooks/useMyParcels()
const MOCK_RECENT_PARCELS = [
  { id: '1', from: 'Montreal', to: 'Douala', traveler: 'Kofi A.', date: 'Jun 18', weight: '4 kg', status: 'In Transit' as const },
  { id: '2', from: 'Toronto', to: 'Abidjan', traveler: 'Marie L.', date: 'Jun 22', weight: '2 kg', status: 'Pending' as const },
];

// TODO: remplacer par features/trips/api → GET /corridors (populaires)
const POPULAR_ROUTES = [
  { from: 'Montreal', to: 'Douala' },
  { from: 'Toronto', to: 'Abidjan' },
  { from: 'Paris', to: 'Lagos' },
  { from: 'Montreal', to: 'Paris' },
];

interface SenderDashboardProps {
  onSearch: (query?: string) => void;
  onTracking: (parcelId: string) => void;
}

export function SenderDashboard({ onSearch, onTracking }: SenderDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Search card */}
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>Find a corridor</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={16} color="#9ca3af" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="e.g. Montreal → Douala"
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => onSearch(searchQuery)}
            activeOpacity={0.85}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.popularSection}>
          <Text style={styles.popularLabel}>Popular routes</Text>
          <View style={styles.popularChips}>
            {POPULAR_ROUTES.map((route, i) => (
              <PopularRouteChip
                key={i}
                from={route.from}
                to={route.to}
                onPress={() => onSearch(`${route.from} → ${route.to}`)}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Parcels</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {MOCK_RECENT_PARCELS.length > 0 ? (
        MOCK_RECENT_PARCELS.map((parcel) => (
          <RecentParcelCard
            key={parcel.id}
            from={parcel.from}
            to={parcel.to}
            travelerName={parcel.traveler}
            date={parcel.date}
            weight={parcel.weight}
            status={parcel.status}
            onPress={() => onTracking(parcel.id)}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Package size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No parcels yet</Text>
          <PrimaryButton
            label="Send your first parcel"
            onPress={() => onSearch()}
            style={styles.emptyButton}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    marginBottom: Spacing[5],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[3],
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.xl,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.foreground,
    paddingVertical: Spacing[3],
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.xl,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  popularSection: {
    marginTop: Spacing[3],
  },
  popularLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: Spacing[2],
  },
  popularChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  seeAll: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
    marginTop: Spacing[3],
  },
  emptyButton: {
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
});

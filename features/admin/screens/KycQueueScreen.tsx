/**
 * Go Bagage — KycQueueScreen
 * File KYC admin — liste paginée avec filtres.
 */

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { KycFilterBar } from '../components/KycFilterBar'
import { KycQueueCard } from '../components/KycQueueCard'
import { useKycQueue } from '../hooks/useKycQueue'
import type { KycQueueItem } from '../types/admin.types'
import type { KycStatus } from '../../../types/user.types'

interface KycQueueScreenProps {
  onBack: () => void
  onReviewKyc: (item: KycQueueItem) => void
}

export function KycQueueScreen({ onBack, onReviewKyc }: KycQueueScreenProps) {
  const {
    items,
    loading,
    refreshing,
    error,
    totalElements,
    activeFilter,
    setFilter,
    refresh,
  } = useKycQueue()

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header onBack={onBack} count={0} />
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
          <Text style={styles.loadingText}>Loading KYC queue...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header onBack={onBack} count={totalElements} />

      <KycFilterBar
        active={activeFilter}
        onSelect={(f) => setFilter(f as KycStatus | 'ALL')}
      />

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.kycId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <KycQueueCard item={item} onPress={() => onReviewKyc(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyEmoji}>✅</Text>
              <Text style={styles.emptyTitle}>All clear!</Text>
              <Text style={styles.emptySubtitle}>
                No KYC documents in this category.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

function Header({ onBack, count }: { onBack: () => void; count: number }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ArrowLeft size={22} color={Colors.foreground} />
      </TouchableOpacity>
      <View>
        <Text style={styles.headerTitle}>KYC Review Queue</Text>
        <Text style={styles.headerSubtitle}>
          {count} document{count !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  listContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
  },
  loadingText: {
    marginTop: Spacing[3],
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing[3] },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  emptySubtitle: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
    marginTop: Spacing[1],
  },
})

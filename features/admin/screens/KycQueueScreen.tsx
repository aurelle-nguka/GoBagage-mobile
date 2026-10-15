import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { KycFilterBar } from '../components/KycFilterBar'
import { KycQueueCard } from '../components/KycQueueCard'
import { useKycQueue } from '../hooks/useKycQueue'
import type { KycQueueItem } from '../types/admin.types'
import type { KycStatus } from '../../../types/user.types'

type Filter = KycStatus | 'ALL'

interface KycQueueScreenProps {
  onBack: () => void
  onReviewKyc: (item: KycQueueItem) => void
}

export function KycQueueScreen({ onBack, onReviewKyc }: KycQueueScreenProps) {
  const { t } = useTranslation()
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
      <View style={styles.container}>
        <Header
          onBack={onBack}
          count={0}
          activeFilter={activeFilter}
          onSelect={(f) => setFilter(f as KycStatus | 'ALL')}
          t={t}
        />
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        onBack={onBack}
        count={totalElements}
        activeFilter={activeFilter}
        onSelect={(f) => setFilter(f as KycStatus | 'ALL')}
        t={t}
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
              <CheckCircle2 size={48} color={Colors.primary} />
              <Text style={styles.emptyTitle}>{t('admin.all_clear')}</Text>
              <Text style={styles.emptySubtitle}>{t('admin.no_kyc')}</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

function Header({
  onBack,
  count,
  activeFilter,
  onSelect,
  t,
}: {
  onBack: () => void
  count: number
  activeFilter: Filter
  onSelect: (f: Filter) => void
  t: (key: string, opts?: any) => string
}) {
  return (
    <View style={styles.headerBlock}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{t('admin.kyc_queue')}</Text>
          <Text style={styles.headerSubtitle}>
            {count} {t('admin.documents', 'document')}
            {count !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      <KycFilterBar active={activeFilter} onSelect={onSelect} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBlock: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: { fontSize: FontSize.sm, color: Colors.mutedForeground },
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
    gap: Spacing[2],
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
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginTop: Spacing[2],
  },
  emptySubtitle: { fontSize: FontSize.base, color: Colors.mutedForeground },
})

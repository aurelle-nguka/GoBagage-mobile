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
import { DisputeFilterBar } from '../components/DisputeFilterBar'
import { DisputeListItem } from '../components/DisputeListItem'
import { useAdminDisputes } from '../hooks/useAdminDisputes'
import type { Dispute } from '../types/admin.types'

interface DisputeQueueScreenProps {
  onBack: () => void
  onOpenDispute: (dispute: Dispute) => void
}

export function DisputeQueueScreen({ onBack, onOpenDispute }: DisputeQueueScreenProps) {
  const { t } = useTranslation()
  const { disputes, loading, refreshing, error, statusFilter, setStatusFilter, refresh } =
    useAdminDisputes()

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={22} color={Colors.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{t('admin.disputes.title', 'Disputes')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('admin.disputes.count', '{{count}} disputes', { count: disputes.length })}
            </Text>
          </View>
        </View>
        <DisputeFilterBar active={statusFilter} onSelect={setStatusFilter} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={disputes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <DisputeListItem dispute={item} onPress={() => onOpenDispute(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <CheckCircle2 size={48} color={Colors.primary} />
              <Text style={styles.emptyTitle}>
                {t('admin.disputes.no_results', 'No disputes')}
              </Text>
            </View>
          }
        />
      )}
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
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.foreground },
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
  loadingText: { marginTop: Spacing[3], color: Colors.mutedForeground, fontSize: FontSize.base },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.foreground, marginTop: Spacing[2] },
})

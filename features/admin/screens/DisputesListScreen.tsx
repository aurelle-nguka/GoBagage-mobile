import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  ArrowLeft,
  Scale,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  User,
  Package,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import apiClient from '../../../shared/services/api.client'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

export interface AdminDisputeItem {
  id: string | number
  bookingId?: string | number
  reportedUserId?: string | number
  reportedUserName?: string
  creatorName?: string
  reason: string
  description?: string
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'CANCELLED'
  createdAt: string
  type?: 'DISPUTE' | 'REPORT'
}

const REASON_LABELS: Record<string, string> = {
  PACKAGE_DAMAGED: 'Colis endommagé',
  PACKAGE_LOST: 'Colis non reçu / perdu',
  DELIVERY_DELAY: 'Retard important de livraison',
  NON_COMPLIANT: 'Contenu non conforme à la déclaration',
  FRAUD: 'Fraude ou escroquerie',
  INAPPROPRIATE_CONTENT: 'Contenu inapproprié ou offensant',
  NO_SHOW: 'Absence au rendez-vous',
  DANGEROUS_ITEMS: 'Objets interdits ou dangereux',
  OTHER: 'Autre motif',
  package_damaged: 'Colis endommagé',
  package_lost: 'Colis non reçu / perdu',
  delivery_delay: 'Retard important de livraison',
  non_compliant: 'Contenu non conforme à la déclaration',
  fraud: 'Fraude ou escroquerie',
  inappropriate_content: 'Contenu inapproprié ou offensant',
  no_show: 'Absence au rendez-vous',
  dangerous_items: 'Objets interdits ou dangereux',
  other: 'Autre motif',
}

export function DisputesListScreen({ onBack }: { onBack: () => void }) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL')
  const [items, setItems] = useState<AdminDisputeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      let disputesList: AdminDisputeItem[] = []

      try {
        const resDisputes = await apiClient.get('/disputes')
        const raw = Array.isArray(resDisputes.data)
          ? resDisputes.data
          : (resDisputes.data?.content ?? [])
        disputesList = raw.map((d: any) => ({
          id: d.id,
          bookingId: d.bookingId,
          reason: d.reason || 'PACKAGE_DAMAGED',
          description: d.description,
          status: d.status || 'OPEN',
          createdAt: d.createdAt || new Date().toISOString(),
          type: 'DISPUTE',
        }))
      } catch {}

      try {
        const resReports = await apiClient.get('/reports')
        const rawReports = Array.isArray(resReports.data)
          ? resReports.data
          : (resReports.data?.content ?? [])
        const mappedReports: AdminDisputeItem[] = rawReports.map((r: any) => ({
          id: r.id,
          reportedUserId: r.reportedUserId,
          reportedUserName:
            r.reportedUserName ||
            (r.reportedUser
              ? `${r.reportedUser.firstName} ${r.reportedUser.lastName}`
              : `User #${r.reportedUserId}`),
          bookingId: r.bookingId,
          reason: r.reason || 'FRAUD',
          description: r.description,
          status: r.status || 'OPEN',
          createdAt: r.createdAt || new Date().toISOString(),
          type: 'REPORT',
        }))
        disputesList = [...disputesList, ...mappedReports]
      } catch {}

      setItems(disputesList)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
  }

  const handleResolve = async (item: AdminDisputeItem) => {
    Alert.alert(
      'Résoudre le dossier',
      `Voulez-vous marquer le ${item.type === 'REPORT' ? 'signalement' : 'litige'} #${item.id} comme résolu ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'default',
          onPress: async () => {
            try {
              if (item.type === 'REPORT') {
                await apiClient.patch(`/reports/${item.id}`, {
                  status: 'RESOLVED',
                })
              } else {
                await apiClient.patch(`/disputes/${item.id}`, {
                  status: 'RESOLVED',
                })
              }
            } catch {}
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id ? { ...i, status: 'RESOLVED' } : i,
              ),
            )
          },
        },
      ],
    )
  }

  const filteredItems = items.filter((item) => {
    if (filter === 'OPEN')
      return item.status === 'OPEN' || item.status === 'UNDER_REVIEW'
    if (filter === 'RESOLVED') return item.status === 'RESOLVED'
    return true
  })

  const getReasonText = (reason: string) => {
    const raw = (reason || '').trim()
    const upper = raw.toUpperCase()
    const lower = raw.toLowerCase()
    return t(`disputes.reasons.${lower}`, {
      defaultValue:
        REASON_LABELS[raw] ||
        REASON_LABELS[upper] ||
        (raw ? raw.replace(/_/g, ' ') : 'Non spécifié'),
    })
  }

  const getStatusBadge = (status: string) => {
    const s = (status || 'OPEN').toUpperCase()
    switch (s) {
      case 'RESOLVED':
        return {
          label: 'Résolu',
          bg: '#d1fae5',
          color: '#047857',
        }
      case 'REJECTED':
        return {
          label: 'Rejeté',
          bg: '#fee2e2',
          color: '#b91c1c',
        }
      case 'UNDER_REVIEW':
      case 'PENDING':
        return {
          label: "En cours d'examen",
          bg: '#fef3c7',
          color: '#b45309',
        }
      case 'OPEN':
      default:
        return {
          label: 'Ouvert',
          bg: '#fff7ed',
          color: '#c2410c',
        }
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Litiges & Signalements</Text>
          <Text style={styles.headerSubtitle}>
            {filteredItems.length} dossier{filteredItems.length > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'ALL' && styles.filterTabActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'ALL' && styles.filterTextActive,
            ]}
          >
            Tous ({items.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'OPEN' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('OPEN')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'OPEN' && styles.filterTextActive,
            ]}
          >
            En cours (
            {
              items.filter(
                (i) => i.status === 'OPEN' || i.status === 'UNDER_REVIEW',
              ).length
            }
            )
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'RESOLVED' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('RESOLVED')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'RESOLVED' && styles.filterTextActive,
            ]}
          >
            Résolus ({items.filter((i) => i.status === 'RESOLVED').length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size='large' color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement des dossiers...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Scale size={48} color='#d1d5db' />
          <Text style={styles.emptyTitle}>Aucun dossier</Text>
          <Text style={styles.emptySub}>
            {filter === 'OPEN'
              ? 'Aucun litige ou signalement en attente.'
              : 'Aucun dossier dans cette catégorie.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => {
            const statusBadge = getStatusBadge(item.status)
            const isResolved = item.status === 'RESOLVED'
            const reason = getReasonText(item.reason)
            const dateStr = item.createdAt
              ? new Intl.DateTimeFormat(i18n.language, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(item.createdAt))
              : ''

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.typeBadge}>
                    {item.type === 'REPORT' ? (
                      <ShieldAlert size={14} color={Colors.destructive} />
                    ) : (
                      <Scale size={14} color={Colors.warning} />
                    )}
                    <Text style={styles.typeText}>
                      {item.type === 'REPORT' ? 'SIGNALEMENT' : 'LITIGE'} #
                      {item.id}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusBadge.bg },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: statusBadge.color }]}
                    >
                      {statusBadge.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.reasonSection}>
                  <Text style={styles.reasonLabel}>Motif :</Text>
                  <Text style={styles.reasonValue}>{reason}</Text>
                </View>

                {item.description &&
                item.description.toUpperCase() !== item.reason.toUpperCase() ? (
                  <View style={styles.descBox}>
                    <Text style={styles.descText}>{item.description}</Text>
                  </View>
                ) : null}

                <View style={styles.metaRow}>
                  {item.bookingId ? (
                    <View style={styles.metaChip}>
                      <Package size={12} color={Colors.mutedForeground} />
                      <Text style={styles.metaChipText}>
                        Réservation #{item.bookingId}
                      </Text>
                    </View>
                  ) : null}

                  {item.reportedUserName ? (
                    <View style={styles.metaChip}>
                      <User size={12} color={Colors.mutedForeground} />
                      <Text style={styles.metaChipText}>
                        {item.reportedUserName}
                      </Text>
                    </View>
                  ) : null}

                  {dateStr ? (
                    <View style={styles.metaChip}>
                      <Calendar size={12} color={Colors.mutedForeground} />
                      <Text style={styles.metaChipText}>{dateStr}</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.actionsRow}>
                  {item.bookingId ? (
                    <TouchableOpacity
                      style={styles.actionBtnSecondary}
                      onPress={() =>
                        router.push(`/(modals)/tracking/${item.bookingId}`)
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={styles.actionBtnSecondaryText}>
                        Voir réservation
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {!isResolved ? (
                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      onPress={() => handleResolve(item)}
                      activeOpacity={0.85}
                    >
                      <CheckCircle2 size={16} color={Colors.white} />
                      <Text style={styles.actionBtnPrimaryText}>
                        Marquer résolu
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    gap: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.mutedForeground,
  },
  filterTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  typeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
  reasonSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  reasonLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
  },
  reasonValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  descBox: {
    backgroundColor: '#f9fafb',
    padding: Spacing[3],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  descText: {
    fontSize: FontSize.xs,
    color: Colors.foreground,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.md,
  },
  metaChipText: {
    fontSize: 11,
    color: Colors.mutedForeground,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing[2],
    marginTop: Spacing[1],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  actionBtnSecondary: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: Radius.lg,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSecondaryText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
  },
  actionBtnPrimaryText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: Spacing[3],
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
    gap: Spacing[2],
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginTop: Spacing[3],
  },
  emptySub: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    textAlign: 'center',
  },
})

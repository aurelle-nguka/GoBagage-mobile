import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Users,
  FileCheck,
  Scale,
  TrendingUp,
  Wallet,
  ShieldAlert,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { formatCAD } from '../../../shared/utils/currency.utils'
import { AdminHeader } from '../components/AdminHeader'
import { KpiCard } from '../components/KpiCard copy'

interface AdminDashboardScreenProps {
  adminName: string
  pendingKycCount: number
  totalUsers: number
  activeTrips: number
  commissionBalanceCad: number | null
  unreadNotifications?: number
  refreshing: boolean
  onRefresh: () => void
  onPressNotifications?: () => void
  onGoToKycQueue: () => void
  onGoToCorridors: () => void
  onGoToUsers: () => void
  onGoToDisputes: () => void
  onGoToPayouts: () => void
  onLogout: () => void
}

export function AdminDashboardScreen({
  adminName,
  pendingKycCount,
  totalUsers,
  activeTrips,
  commissionBalanceCad,
  unreadNotifications = 0,
  refreshing,
  onRefresh,
  onPressNotifications,
  onGoToKycQueue,
  onGoToCorridors,
  onGoToUsers,
  onGoToDisputes,
  onGoToPayouts,
  onLogout,
}: AdminDashboardScreenProps) {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader
        adminName={adminName}
        unreadNotifications={unreadNotifications}
        onPressNotifications={onPressNotifications}
        onLogout={onLogout}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        <Text style={styles.sectionTitle}>{t('admin.overview')}</Text>
        <View style={styles.kpiGrid}>
          <KpiCard
            icon={<Users size={20} color={Colors.secondary} />}
            label={t('admin.total_users')}
            value={totalUsers}
            subtitle={t('admin.registered_users', 'Registered users')}
            backgroundColor='#e8f4fd'
          />
          <KpiCard
            icon={<FileCheck size={20} color={Colors.primary} />}
            label={t('admin.active_trips')}
            value={activeTrips}
            subtitle={t('admin.open_trips', 'Open trips')}
            backgroundColor='#e8faf0'
          />
          <KpiCard
            icon={<TrendingUp size={20} color={Colors.warning} />}
            label={t('admin.revenue')}
            value={commissionBalanceCad != null ? formatCAD(commissionBalanceCad) : '—'}
            subtitle={t('admin.available_balance', 'Available balance')}
            backgroundColor='#fff8e8'
          />
          <KpiCard
            icon={
              <ShieldAlert
                size={20}
                color={pendingKycCount > 0 ? Colors.destructive : Colors.primary}
              />
            }
            label={t('admin.kyc_pending')}
            value={pendingKycCount}
            subtitle={
              pendingKycCount > 0
                ? t('admin.needs_review', 'Needs review')
                : t('admin.all_clear')
            }
            backgroundColor={pendingKycCount > 0 ? '#fef2f2' : '#e8faf0'}
          />
        </View>

        <Text style={styles.sectionTitle}>{t('admin.quick_actions')}</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={onGoToKycQueue}
          activeOpacity={0.9}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: pendingKycCount > 0 ? '#fef2f2' : '#fff8e8' },
            ]}
          >
            <ShieldAlert
              size={24}
              color={pendingKycCount > 0 ? Colors.destructive : Colors.warning}
            />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>{t('admin.kyc_queue')}</Text>
            <Text style={styles.actionSubtitle}>
              {pendingKycCount > 0
                ? t('admin.kyc_queue_subtitle', { count: pendingKycCount })
                : t('admin.kyc_queue_empty')}
            </Text>
          </View>
          {pendingKycCount > 0 && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>{pendingKycCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={onGoToUsers}
          activeOpacity={0.9}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#f3e8fd' }]}>
            <Users size={24} color='#9333ea' />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>
              {t('admin.user_management', 'User Management')}
            </Text>
            <Text style={styles.actionSubtitle}>
              {totalUsers > 0
                ? t('admin.users.count', '{{count}} users', { count: totalUsers })
                : t('admin.registered_users', 'Registered users')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={onGoToCorridors}
          activeOpacity={0.9}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#e8f4fd' }]}>
            <TrendingUp size={24} color={Colors.secondary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>{t('admin.corridors')}</Text>
            <Text style={styles.actionSubtitle}>
              {t('admin.corridors_subtitle')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={onGoToDisputes}
          activeOpacity={0.9}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#fef2f2' }]}>
            <Scale size={24} color={Colors.destructive} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>{t('admin.disputes.title', 'Disputes')}</Text>
            <Text style={styles.actionSubtitle}>
              {t('admin.disputes.dashboard_subtitle', 'Review and resolve reported issues')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={onGoToPayouts}
          activeOpacity={0.9}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#fff8e8' }]}>
            <Wallet size={24} color={Colors.warning} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>{t('admin.payouts.title', 'Balance & Payouts')}</Text>
            <Text style={styles.actionSubtitle}>
              {commissionBalanceCad != null
                ? t('admin.payouts.subtitle', '{{amount}} available', { amount: formatCAD(commissionBalanceCad) })
                : t('admin.coming_soon')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[5] },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: { flex: 1 },
  actionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  actionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  urgentBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  comingSoonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    opacity: 0.5,
  },
  comingSoonText: { fontSize: FontSize.base, color: '#9ca3af' },
})

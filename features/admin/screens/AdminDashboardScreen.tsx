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
  Scale,
  TrendingUp,
  ShieldAlert,
  Plane,
  DollarSign,
  type LucideIcon,
} from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { AdminHeader } from '../components/AdminHeader'

interface KpiCardProps {
  emoji?: string
  icon?: LucideIcon
  iconColor?: string
  label: string
  value: string | number
  subtitle?: string
  backgroundColor: string
}

function KpiCard({
  emoji,
  icon: Icon,
  iconColor,
  label,
  value,
  subtitle,
  backgroundColor,
}: KpiCardProps) {
  return (
    <View style={[styles.kpiCard, { backgroundColor }]}>
      {Icon ? (
        <View style={styles.kpiIconContainer}>
          <Icon size={26} color={iconColor ?? Colors.foreground} />
        </View>
      ) : (
        <Text style={styles.kpiEmoji}>{emoji ?? '📊'}</Text>
      )}
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      {subtitle ? <Text style={styles.kpiSubtitle}>{subtitle}</Text> : null}
    </View>
  )
}

interface AdminDashboardScreenProps {
  adminName: string
  pendingKycCount: number
  totalUsers: number
  unreadNotifications?: number
  refreshing: boolean
  onRefresh: () => void
  onPressNotifications?: () => void
  onGoToKycQueue: () => void
  onGoToCorridors: () => void
  onGoToDisputes: () => void
  onGoToUsers?: () => void
  onLogout: () => void
}

export function AdminDashboardScreen({
  adminName,
  pendingKycCount,
  totalUsers,
  unreadNotifications = 0,
  refreshing,
  onRefresh,
  onPressNotifications,
  onGoToKycQueue,
  onGoToCorridors,
  onGoToDisputes,
  onGoToUsers,
  onLogout,
}: AdminDashboardScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.kpiGrid}>
          <KpiCard
            icon={Users}
            iconColor={Colors.secondary}
            label='Total Users'
            value={totalUsers}
            subtitle={
              totalUsers > 0 ? `${totalUsers} registered` : '0 registered'
            }
            backgroundColor='#e8f4fd'
          />
          <KpiCard
            icon={Plane}
            iconColor='#10b981'
            label='Active Trips'
            value='—'
            subtitle='Coming soon'
            backgroundColor='#e8faf0'
          />
          <KpiCard
            icon={DollarSign}
            iconColor={Colors.warning}
            label='Revenue'
            value='—'
            subtitle='Coming soon'
            backgroundColor='#fff8e8'
          />
          <KpiCard
            icon={ShieldAlert}
            iconColor={
              pendingKycCount > 0 ? Colors.destructive : Colors.primary
            }
            label='KYC Pending'
            value={pendingKycCount}
            subtitle={pendingKycCount > 0 ? 'Needs review' : 'All clear'}
            backgroundColor={pendingKycCount > 0 ? '#fef2f2' : '#e8faf0'}
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

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
            <Text style={styles.actionTitle}>KYC Review Queue</Text>
            <Text style={styles.actionSubtitle}>
              {pendingKycCount > 0
                ? `${pendingKycCount} document${pendingKycCount > 1 ? 's' : ''} awaiting review`
                : 'No pending documents'}
            </Text>
          </View>
          {pendingKycCount > 0 && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>{pendingKycCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {onGoToUsers ? (
          <TouchableOpacity
            style={styles.actionCard}
            onPress={onGoToUsers}
            activeOpacity={0.9}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#e8f4fd' }]}>
              <Users size={24} color={Colors.secondary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>User Management</Text>
              <Text style={styles.actionSubtitle}>
                {totalUsers > 0
                  ? `${totalUsers} registered users`
                  : 'Manage user accounts'}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.comingSoonCard}>
            <Users size={20} color='#9ca3af' />
            <Text style={styles.comingSoonText}>
              User Management — Coming soon
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.actionCard}
          onPress={onGoToCorridors}
          activeOpacity={0.9}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#e8f4fd' }]}>
            <TrendingUp size={24} color={Colors.secondary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Corridors Management</Text>
            <Text style={styles.actionSubtitle}>
              Activate, deactivate and configure routes
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={onGoToDisputes}
          activeOpacity={0.9}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#fee2e2' }]}>
            <Scale size={24} color={Colors.destructive} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Litiges & Signalements</Text>
            <Text style={styles.actionSubtitle}>
              Examiner et résoudre les litiges et réclamations
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  },
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
  kpiCard: {
    flex: 1,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    alignItems: 'center',
    minWidth: '45%',
  },
  kpiEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  kpiIconContainer: {
    marginBottom: 6,
    marginTop: 2,
  },
  kpiValue: {
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    color: Colors.foreground,
  },
  kpiLabel: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
    textAlign: 'center',
  },
  kpiSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
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
  comingSoonText: {
    fontSize: FontSize.base,
    color: '#9ca3af',
  },
})

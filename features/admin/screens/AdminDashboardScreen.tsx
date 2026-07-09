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
  AlertTriangle,
  TrendingUp,
} from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { AdminHeader } from '../components/AdminHeader'
import { KpiCard } from '../components/KpiCard copy'

interface AdminDashboardScreenProps {
  adminName: string
  pendingKycCount: number
  totalUsers: number
  refreshing: boolean
  onRefresh: () => void
  onGoToKycQueue: () => void
  onLogout: () => void
}

export function AdminDashboardScreen({
  adminName,
  pendingKycCount,
  totalUsers,
  refreshing,
  onRefresh,
  onGoToKycQueue,
  onLogout,
}: AdminDashboardScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AdminHeader adminName={adminName} onLogout={onLogout} />

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
            emoji='👥'
            label='Total Users'
            value={totalUsers > 0 ? totalUsers : '—'}
            subtitle={totalUsers > 0 ? 'Registered users' : 'Loading...'}
            backgroundColor='#e8f4fd'
          />
          <KpiCard
            emoji='✈️'
            label='Active Trips'
            value='—'
            subtitle='Coming soon'
            backgroundColor='#e8faf0'
          />
          <KpiCard
            emoji='💰'
            label='Revenue'
            value='—'
            subtitle='Coming soon'
            backgroundColor='#fff8e8'
          />
          <KpiCard
            emoji='🪪'
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
          <View style={[styles.actionIcon, { backgroundColor: '#fff8e8' }]}>
            <FileCheck size={24} color={Colors.warning} />
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

        <View style={styles.comingSoonCard}>
          <Users size={20} color='#9ca3af' />
          <Text style={styles.comingSoonText}>
            User Management — Coming soon
          </Text>
        </View>

        <View style={styles.comingSoonCard}>
          <TrendingUp size={20} color='#9ca3af' />
          <Text style={styles.comingSoonText}>
            Corridors Management — Coming soon
          </Text>
        </View>

        <View style={styles.comingSoonCard}>
          <AlertTriangle size={20} color='#9ca3af' />
          <Text style={styles.comingSoonText}>Disputes — Coming soon</Text>
        </View>
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

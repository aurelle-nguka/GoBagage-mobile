import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native'
import {
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  ShieldOff,
  Star,
  Clock,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { useAdminUserDetail } from '../hooks/useAdminUserDetail'

interface UserDetailScreenProps {
  userId: string
  onBack: () => void
}

export function UserDetailScreen({ userId, onBack }: UserDetailScreenProps) {
  const { t, i18n } = useTranslation()
  const { user, loading, actionLoading, error, suspend, reactivate } =
    useAdminUserDetail(userId)
  const [showSuspendForm, setShowSuspendForm] = useState(false)
  const [reason, setReason] = useState('')

  const handleConfirmSuspend = async () => {
    const ok = await suspend(reason.trim() || undefined)
    if (ok) {
      setShowSuspendForm(false)
      setReason('')
    }
  }

  const handleReactivate = () => {
    Alert.alert(
      t('admin.users.reactivate_confirm_title', 'Reactivate account'),
      t(
        'admin.users.reactivate_confirm_msg',
        'Are you sure you want to reactivate this account?',
      ),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), onPress: () => reactivate() },
      ],
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Header onBack={onBack} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    )
  }

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
  const memberSince = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'long',
  }).format(new Date(user.createdAt))
  const lastLogin = user.lastLoginAt
    ? new Intl.DateTimeFormat(i18n.language, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(user.lastLoginAt))
    : t('admin.users.never', 'Never')

  return (
    <View style={styles.container}>
      <Header onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error ? <ErrorBanner message={error} /> : null}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: user.isActive ? '#e8faf0' : '#fef2f2' },
            ]}
          >
            {user.isActive ? (
              <ShieldCheck size={12} color={Colors.primary} />
            ) : (
              <ShieldOff size={12} color={Colors.destructive} />
            )}
            <Text
              style={[
                styles.statusText,
                { color: user.isActive ? Colors.primary : Colors.destructive },
              ]}
            >
              {user.isActive
                ? t('admin.users.status_active', 'Active')
                : t('admin.users.status_suspended', 'Suspended')}
            </Text>
          </View>
        </View>

        {!user.isActive && user.suspensionReason && (
          <View style={styles.reasonBanner}>
            <Text style={styles.reasonBannerLabel}>
              {t('admin.users.suspension_reason_label', 'Suspension reason')}
            </Text>
            <Text style={styles.reasonBannerText}>{user.suspensionReason}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Row icon={<Mail size={16} color={Colors.mutedForeground} />} label={user.email} />
          <Row icon={<Phone size={16} color={Colors.mutedForeground} />} label={user.phone} />
          {user.averageRating !== null && (
            <Row
              icon={<Star size={16} color={Colors.warning} />}
              label={t('profile.rating_avg', { value: user.averageRating.toFixed(1) })}
            />
          )}
          <Row
            icon={<Clock size={16} color={Colors.mutedForeground} />}
            label={t('admin.users.last_login', 'Last login: {{date}}', { date: lastLogin })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('nav.profile', 'Profile')}</Text>
          <View style={styles.badgeRow}>
            {user.roles.map((role) => (
              <View key={role} style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{role}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.metaText}>
            {t('profile.member_since', { date: memberSince })}
          </Text>
          <Text style={styles.metaText}>
            {t('admin.kyc_review', 'KYC Review')}: {t('admin.' + user.kycStatus.toLowerCase(), user.kycStatus)}
          </Text>
        </View>

        {user.isActive ? (
          <View style={styles.section}>
            {!showSuspendForm ? (
              <TouchableOpacity
                style={styles.suspendTrigger}
                onPress={() => setShowSuspendForm(true)}
                activeOpacity={0.85}
              >
                <View style={styles.suspendIconWrap}>
                  <ShieldOff size={18} color={Colors.destructive} />
                </View>
                <View style={styles.suspendTriggerContent}>
                  <Text style={styles.suspendTriggerTitle}>
                    {t('admin.users.suspend_button', 'Suspend Account')}
                  </Text>
                  <Text style={styles.suspendTriggerSubtitle}>
                    {t('admin.users.suspend_trigger_subtitle', 'Temporarily disable user access')}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.suspendFormContainer}>
                <View style={styles.suspendHeader}>
                  <View style={styles.suspendIconWrap}>
                    <ShieldOff size={18} color={Colors.destructive} />
                  </View>
                  <View style={styles.suspendHeaderText}>
                    <Text style={styles.suspendFormTitle}>
                      {t('admin.users.suspend_button', 'Suspend Account')}
                    </Text>
                    <Text style={styles.suspendFormSubtitle}>
                      {t('admin.users.suspend_subtitle', 'Provide a reason (optional). The user will be notified.')}
                    </Text>
                  </View>
                </View>
                <TextInput
                  value={reason}
                  onChangeText={setReason}
                  placeholder={t('admin.users.suspend_reason_placeholder', 'e.g. Suspicious activity, policy violation...')}
                  placeholderTextColor='#9ca3af'
                  style={styles.reasonInput}
                  multiline
                />
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowSuspendForm(false)
                      setReason('')
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.cancelButtonText}>{t('common.cancel', 'Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmSuspendButton}
                    onPress={handleConfirmSuspend}
                    disabled={actionLoading}
                    activeOpacity={0.85}
                  >
                    {actionLoading ? (
                      <ActivityIndicator size='small' color={Colors.white} />
                    ) : (
                      <View style={styles.confirmBtnContent}>
                        <ShieldOff size={15} color={Colors.white} />
                        <Text style={styles.confirmSuspendText}>
                          {t('admin.users.suspend_confirm', 'Confirm Suspension')}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.reactivateButton}
              onPress={handleReactivate}
              disabled={actionLoading}
              activeOpacity={0.85}
            >
              {actionLoading ? (
                <ActivityIndicator size='small' color={Colors.white} />
              ) : (
                <View style={styles.confirmBtnContent}>
                  <ShieldCheck size={18} color={Colors.white} />
                  <Text style={styles.reactivateButtonText}>
                    {t('admin.users.reactivate_button', 'Reactivate Account')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

function Header({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation()
  return (
    <View style={styles.headerBlock}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ArrowLeft size={22} color={Colors.foreground} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{t('admin.user_info', 'User Information')}</Text>
    </View>
  )
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.rowText}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: Colors.destructive, fontSize: FontSize.base, textAlign: 'center', paddingHorizontal: Spacing[8] },
  headerBlock: {
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
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.foreground },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[5] },
  profileCard: { alignItems: 'center', marginBottom: Spacing[5] },
  reasonBanner: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: Colors.destructive,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[3],
  },
  reasonBannerLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.destructive,
    marginBottom: 2,
  },
  reasonBannerText: { fontSize: FontSize.base, color: Colors.foreground },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  avatarText: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.primary },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.foreground, marginBottom: Spacing[2] },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    gap: Spacing[3],
  },
  sectionLabel: { fontSize: FontSize.sm, color: Colors.mutedForeground, marginBottom: Spacing[1] },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  rowText: { fontSize: FontSize.base, color: Colors.foreground },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], marginBottom: Spacing[2] },
  roleBadge: {
    backgroundColor: '#e8f4fd',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
  },
  roleBadgeText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.secondary },
  metaText: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  suspendTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#fff5f5',
    borderWidth: 1.5,
    borderColor: '#fed7d7',
    borderRadius: Radius.xl,
    padding: Spacing[3.5],
  },
  suspendIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suspendTriggerContent: { flex: 1 },
  suspendTriggerTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.destructive,
  },
  suspendTriggerSubtitle: {
    fontSize: FontSize.xs,
    color: '#991b1b',
    marginTop: 2,
  },
  suspendFormContainer: {
    gap: Spacing[3],
  },
  suspendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[1],
  },
  suspendHeaderText: { flex: 1 },
  suspendFormTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  suspendFormSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  reasonInput: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    borderRadius: Radius.xl,
    padding: Spacing[3],
    fontSize: FontSize.sm,
    color: Colors.foreground,
    minHeight: 84,
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginTop: Spacing[2],
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: Colors.foreground,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  confirmSuspendButton: {
    flex: 1.4,
    height: 46,
    borderRadius: Radius.full,
    backgroundColor: Colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.destructive,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confirmSuspendText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  reactivateButton: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  reactivateButtonText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
})

import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { ArrowLeft, Search, Users } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { UserFilterBar } from '../components/UserFilterBar'
import { UserListItem } from '../components/UserListItem'
import { useAdminUsers } from '../hooks/useAdminUsers'
import type { AdminUser } from '../types/admin.types'

interface UserManagementScreenProps {
  onBack: () => void
  onOpenUser: (user: AdminUser) => void
}

export function UserManagementScreen({ onBack, onOpenUser }: UserManagementScreenProps) {
  const { t } = useTranslation()
  const {
    users,
    loading,
    refreshing,
    loadingMore,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    totalElements,
    refresh,
    loadMore,
  } = useAdminUsers()

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
            <Text style={styles.headerTitle}>
              {t('admin.user_management', 'User Management')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t('admin.users.count', '{{count}} users', { count: totalElements })}
            </Text>
          </View>
        </View>

        <View style={styles.searchWrapper}>
          <Search size={16} color={Colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('admin.users.search_placeholder', 'Search by name or email...')}
            placeholderTextColor='#9ca3af'
            style={styles.searchInput}
            autoCapitalize='none'
          />
        </View>

        <UserFilterBar
          activeFilter={filter}
          onSelectFilter={setFilter}
        />
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
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={refreshing}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          renderItem={({ item }) => (
            <UserListItem user={item} onPress={() => onOpenUser(item)} />
          )}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size='small'
                color={Colors.primary}
                style={{ marginVertical: Spacing[4] }}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Users size={48} color='#d1d5db' />
              <Text style={styles.emptyTitle}>
                {t('admin.users.no_results', 'No users found')}
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
    paddingBottom: Spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[3],
    backgroundColor: '#f3f4f6',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[4],
    height: 44,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.foreground },
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
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
    marginTop: Spacing[2],
  },
})

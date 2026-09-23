import { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { getAdminUsers } from '../api/admin.api'
import type { AdminUser } from '../types/admin.types'
import type { UserRole } from '../../../types/user.types'

export type UserFilter = 'ALL' | 'SENDER' | 'TRAVELER' | 'ADMIN' | 'SUSPENDED'

interface UseAdminUsersResult {
  users: AdminUser[]
  loading: boolean
  refreshing: boolean
  loadingMore: boolean
  error: string
  search: string
  setSearch: (value: string) => void
  filter: UserFilter
  setFilter: (value: UserFilter) => void
  totalElements: number
  hasMore: boolean
  refresh: () => void
  loadMore: () => void
}

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 400

export function useAdminUsers(): UseAdminUsersResult {
  const { t } = useTranslation()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filter, setFilter] = useState<UserFilter>('ALL')

  const [page, setPage] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [search])

  const buildParams = useCallback(
    (pageNum: number) => ({
      search: debouncedSearch || undefined,
      role: filter === 'SENDER' || filter === 'TRAVELER' || filter === 'ADMIN' ? (filter as UserRole) : undefined,
      isActive: filter === 'SUSPENDED' ? false : undefined,
      page: pageNum,
      size: PAGE_SIZE,
    }),
    [debouncedSearch, filter],
  )

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError('')
      try {
        const data = await getAdminUsers(buildParams(0))
        setUsers(data.content)
        setPage(0)
        setTotalElements(data.totalElements)
        setTotalPages(data.totalPages)
      } catch {
        setError(t('admin.users.errors.load_failed', 'Failed to load users.'))
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [buildParams, t],
  )

  useEffect(() => {
    load()
  }, [debouncedSearch, filter])

  useFocusEffect(
    useCallback(() => {
      load(true)
    }, [load])
  )

  useEffect(() => {
    const interval = setInterval(() => {
      load(true)
    }, 20000)
    return () => clearInterval(interval)
  }, [load])

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || page + 1 >= totalPages) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const data = await getAdminUsers(buildParams(nextPage))
      setUsers((prev) => [...prev, ...data.content])
      setPage(nextPage)
    } catch {
      // silencieux — l'utilisateur peut réessayer en scrollant à nouveau
    } finally {
      setLoadingMore(false)
    }
  }, [buildParams, loadingMore, loading, page, totalPages])

  return {
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
    hasMore: page + 1 < totalPages,
    refresh: () => load(true),
    loadMore,
  }
}

import { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { getAdminStats, getKycQueue } from '../api/admin.api'
import { getBalance } from '../../payouts/api/payouts.api'
import { useNotificationStore } from '../../../store/notification.store'
import type { AdminStatsResponse } from '../types/admin.types'

interface UseDashboardDataResult {
  stats: AdminStatsResponse | null
  pendingKycCount: number
  commissionBalanceCad: number | null
  unreadNotifications: number
  loading: boolean
  refreshing: boolean
  error: string
  refresh: () => Promise<void>
}

export function useDashboardData(): UseDashboardDataResult {
  const { t } = useTranslation()
  const [stats, setStats] = useState<AdminStatsResponse | null>(null)
  const [pendingKycCount, setPendingKycCount] = useState(0)
  const [commissionBalanceCad, setCommissionBalanceCad] = useState<number | null>(null)
  const unreadNotifications = useNotificationStore((s) => s.unreadCount)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')

    try {
      const [statsResult, kycResult, balanceResult] = await Promise.allSettled([
        getAdminStats(),
        getKycQueue({ status: 'PENDING', size: 1 }),
        getBalance(),
        useNotificationStore.getState().fetchNotifications(true),
      ])

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value)
      }
      if (kycResult.status === 'fulfilled') {
        setPendingKycCount(kycResult.value.totalElements)
      }
      if (balanceResult.status === 'fulfilled') {
        setCommissionBalanceCad(balanceResult.value.availableCad)
      }
    } catch {
      setError(t('admin.errors.load_stats_failed', 'Failed to load dashboard data.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [t])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  useEffect(() => {
    const interval = setInterval(() => {
      useNotificationStore.getState().fetchNotifications(true)
      getAdminStats().then((s) => {
        if (s) setStats(s)
      }).catch(() => {})
      getKycQueue({ status: 'PENDING', size: 1 }).then((k) => {
        if (k) setPendingKycCount(k.totalElements)
      }).catch(() => {})
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const refresh = () => load(true)

  return { stats, pendingKycCount, commissionBalanceCad, unreadNotifications, loading, refreshing, error, refresh }
}


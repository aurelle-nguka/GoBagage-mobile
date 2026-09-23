import { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { getAdminDisputes } from '../api/admin.api'
import type { Dispute, DisputeStatus } from '../types/admin.types'

export type DisputeStatusFilter = DisputeStatus | 'ALL'

interface UseAdminDisputesResult {
  disputes: Dispute[]
  loading: boolean
  refreshing: boolean
  error: string
  statusFilter: DisputeStatusFilter
  setStatusFilter: (value: DisputeStatusFilter) => void
  refresh: () => void
}

export function useAdminDisputes(): UseAdminDisputesResult {
  const { t } = useTranslation()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<DisputeStatusFilter>('ALL')

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError('')
      try {
        const data = await getAdminDisputes(statusFilter)
        setDisputes(data)
      } catch {
        setError(t('admin.disputes.errors.load_failed', 'Failed to load disputes.'))
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [statusFilter, t],
  )

  useEffect(() => {
    load()
  }, [statusFilter])

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

  return { disputes, loading, refreshing, error, statusFilter, setStatusFilter, refresh: () => load(true) }
}

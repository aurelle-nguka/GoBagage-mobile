import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAdminUserById, reactivateUser, suspendUser } from '../api/admin.api'
import type { AdminUser } from '../types/admin.types'

interface UseAdminUserDetailResult {
  user: AdminUser | null
  loading: boolean
  actionLoading: boolean
  error: string
  refresh: () => void
  suspend: (reason?: string) => Promise<boolean>
  reactivate: () => Promise<boolean>
}

export function useAdminUserDetail(userId: string): UseAdminUserDetailResult {
  const { t } = useTranslation()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminUserById(userId)
      setUser(data)
    } catch {
      setError(t('admin.users.errors.load_detail_failed', 'Failed to load user.'))
    } finally {
      setLoading(false)
    }
  }, [userId, t])

  useEffect(() => {
    load()
  }, [load])

  const suspend = async (reason?: string): Promise<boolean> => {
    setActionLoading(true)
    setError('')
    try {
      const data = await suspendUser(userId, reason)
      setUser(data)
      return true
    } catch {
      setError(t('admin.users.errors.suspend_failed', 'Failed to suspend user.'))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const reactivate = async (): Promise<boolean> => {
    setActionLoading(true)
    setError('')
    try {
      const data = await reactivateUser(userId)
      setUser(data)
      return true
    } catch {
      setError(t('admin.users.errors.reactivate_failed', 'Failed to reactivate user.'))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  return { user, loading, actionLoading, error, refresh: load, suspend, reactivate }
}

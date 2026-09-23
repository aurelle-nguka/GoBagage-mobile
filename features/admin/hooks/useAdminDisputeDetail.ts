import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  closeDispute,
  decideDispute,
  getAdminDispute,
  startDisputeInvestigation,
} from '../api/admin.api'
import type { Dispute } from '../types/admin.types'

interface UseAdminDisputeDetailResult {
  dispute: Dispute | null
  loading: boolean
  actionLoading: boolean
  error: string
  refresh: () => void
  startInvestigation: () => Promise<boolean>
  decide: (decision: 'RELEASE_FUNDS' | 'REFUND', note?: string) => Promise<boolean>
  close: (note?: string) => Promise<boolean>
}

export function useAdminDisputeDetail(disputeId: string): UseAdminDisputeDetailResult {
  const { t } = useTranslation()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminDispute(disputeId)
      setDispute(data)
    } catch {
      setError(t('admin.disputes.errors.load_detail_failed', 'Failed to load dispute.'))
    } finally {
      setLoading(false)
    }
  }, [disputeId, t])

  useEffect(() => {
    load()
  }, [load])

  const startInvestigation = async (): Promise<boolean> => {
    setActionLoading(true)
    setError('')
    try {
      const data = await startDisputeInvestigation(disputeId)
      setDispute(data)
      return true
    } catch {
      setError(t('admin.disputes.errors.investigate_failed', 'Failed to start investigation.'))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const decide = async (decision: 'RELEASE_FUNDS' | 'REFUND', note?: string): Promise<boolean> => {
    setActionLoading(true)
    setError('')
    try {
      const data = await decideDispute(disputeId, { decision, note })
      setDispute(data)
      return true
    } catch {
      setError(t('admin.disputes.errors.decide_failed', 'Failed to record decision.'))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const close = async (note?: string): Promise<boolean> => {
    setActionLoading(true)
    setError('')
    try {
      const data = await closeDispute(disputeId, { note })
      setDispute(data)
      return true
    } catch {
      setError(t('admin.disputes.errors.close_failed', 'Failed to close dispute.'))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  return { dispute, loading, actionLoading, error, refresh: load, startInvestigation, decide, close }
}

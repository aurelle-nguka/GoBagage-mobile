import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { openDispute } from '../api/disputes.api'
import type { CreateDisputeRequest, Dispute } from '../types/dispute.types'
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils'

interface UseOpenDisputeResult {
  loading: boolean
  error: string
  submit: (data: CreateDisputeRequest) => Promise<Dispute | null>
}

export function useOpenDispute(): UseOpenDisputeResult {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (data: CreateDisputeRequest): Promise<Dispute | null> => {
    setLoading(true)
    setError('')
    try {
      return await openDispute(data)
    } catch (err) {
      setError(getApiErrorMessage(err, t))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit }
}

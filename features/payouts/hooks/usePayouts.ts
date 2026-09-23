import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getBalance, getMyPayouts, requestPayout } from '../api/payouts.api'
import type { BalanceResponse, PayoutDTO, PayoutProvider } from '../types/payout.types'
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils'

interface UsePayoutsResult {
  balance: BalanceResponse | null
  payouts: PayoutDTO[]
  loading: boolean
  submitting: boolean
  error: string
  lastResult: PayoutDTO | null
  refresh: () => void
  submit: (
    amountCad: number,
    provider: PayoutProvider,
    destinationPhone?: string,
    destinationDetails?: string,
  ) => Promise<boolean>
  clearResult: () => void
}

export function usePayouts(): UsePayoutsResult {
  const { t } = useTranslation()
  const [balance, setBalance] = useState<BalanceResponse | null>(null)
  const [payouts, setPayouts] = useState<PayoutDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState<PayoutDTO | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [balanceData, payoutsData] = await Promise.all([getBalance(), getMyPayouts()])
      setBalance(balanceData)
      setPayouts(payoutsData)
    } catch (err) {
      setError(getApiErrorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  const submit = async (
    amountCad: number,
    provider: PayoutProvider,
    destinationPhone?: string,
    destinationDetails?: string,
  ): Promise<boolean> => {
    setSubmitting(true)
    setError('')
    setLastResult(null)
    try {
      const result = await requestPayout({ amountCad, provider, destinationPhone, destinationDetails })
      setLastResult(result)
      await load()
      return result.status === 'COMPLETED'
    } catch (err) {
      setError(getApiErrorMessage(err, t))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const clearResult = () => setLastResult(null)

  return { balance, payouts, loading, submitting, error, lastResult, refresh: load, submit, clearResult }
}

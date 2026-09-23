import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfirmPayment } from '@stripe/stripe-react-native'
import {
  applyPromo,
  cancelSubscription,
  confirmSubscription,
  getLaunchOfferStatus,
  getSubscriptionStatus,
  subscribe,
} from '../api/subscription.api'
import type {
  LaunchOfferResponse,
  SubscriptionStatusResponse,
} from '../types/subscription.types'
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils'

interface UseSubscriptionResult {
  status: SubscriptionStatusResponse | null
  launchOffer: LaunchOfferResponse | null
  loading: boolean
  actionLoading: boolean
  error: string
  refresh: () => void
  doSubscribe: () => Promise<boolean>
  doCancel: () => Promise<boolean>
  doApplyPromo: (code: string) => Promise<boolean>
}

export function useSubscription(): UseSubscriptionResult {
  const { t } = useTranslation()
  const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null)
  const [launchOffer, setLaunchOffer] = useState<LaunchOfferResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const { confirmPayment } = useConfirmPayment()

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [statusData, offerData] = await Promise.all([
        getSubscriptionStatus(),
        getLaunchOfferStatus(),
      ])
      setStatus(statusData)
      setLaunchOffer(offerData)
    } catch (err) {
      setError(getApiErrorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  const doSubscribe = async (): Promise<boolean> => {
    setActionLoading(true)
    setError('')
    try {
      const initiateResponse = await subscribe({ paymentProvider: 'STRIPE' })
      if (!initiateResponse.clientSecret) {
        setError(t('payment.errors.no_client_secret', 'No client secret received from server.'))
        return false
      }

      const { error: stripeError } = await confirmPayment(initiateResponse.clientSecret, {
        paymentMethodType: 'Card',
      })

      if (stripeError) {
        setError(stripeError.message ?? t('payment.errors.payment_failed', 'Payment failed. Please try again.'))
        return false
      }

      const statusData = await confirmSubscription({
        paymentIntentId: initiateResponse.paymentIntentId,
      })
      setStatus(statusData)
      return true
    } catch (err) {
      setError(getApiErrorMessage(err, t))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const doCancel = async (): Promise<boolean> => {
    setActionLoading(true)
    setError('')
    try {
      const data = await cancelSubscription()
      setStatus(data)
      return true
    } catch (err) {
      setError(getApiErrorMessage(err, t))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const doApplyPromo = async (code: string): Promise<boolean> => {
    setActionLoading(true)
    setError('')
    try {
      const data = await applyPromo({ promoCode: code })
      setStatus(data)
      return true
    } catch (err) {
      setError(getApiErrorMessage(err, t))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  return {
    status,
    launchOffer,
    loading,
    actionLoading,
    error,
    refresh: load,
    doSubscribe,
    doCancel,
    doApplyPromo,
  }
}

import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { initiatePayment, getPayment } from '../api/payments.api';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';
import type { PaymentProvider } from '../types/payment.types';

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

export type MobileMoneyState =
  | 'idle'
  | 'awaiting_confirmation'
  | 'success'
  | 'failed'
  | 'timeout';

interface UseMobileMoneyPaymentResult {
  loading: boolean;
  state: MobileMoneyState;
  error: string;
  pay: (bookingId: string, provider: PaymentProvider, phone: string) => Promise<void>;
  checkStatus: () => Promise<void>;
  reset: () => void;
}

export function useMobileMoneyPayment(): UseMobileMoneyPaymentResult {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<MobileMoneyState>('idle');
  const [error, setError] = useState('');
  const paymentIdRef = useRef<number | null>(null);

  const pollOnce = async (): Promise<boolean> => {
    if (!paymentIdRef.current) return false;
    const payment = await getPayment(paymentIdRef.current);
    if (payment.escrowStatus === 'HELD') {
      setState('success');
      return true;
    }
    if (payment.escrowStatus === 'FAILED') {
      setError(
        t(
          'payment.errors.mobile_money_failed',
          'The payment was not approved. Please try again.',
        ),
      );
      setState('failed');
      return true;
    }
    return false;
  };

  const pay = async (
    bookingId: string,
    provider: PaymentProvider,
    phone: string,
  ) => {
    setLoading(true);
    setError('');
    setState('idle');

    try {
      const response = await initiatePayment({
        bookingId: Number(bookingId),
        provider,
        currency: 'CAD',
        mobileMoneyPhone: phone,
      });
      paymentIdRef.current = response.paymentId;
      setState('awaiting_confirmation');
      setLoading(false);

      const startedAt = Date.now();
      while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        const done = await pollOnce();
        if (done) return;
      }
      setState('timeout');
    } catch (err) {
      setError(getApiErrorMessage(err, t));
      setState('failed');
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    try {
      const done = await pollOnce();
      if (!done) setState('timeout');
    } catch (err) {
      setError(getApiErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    paymentIdRef.current = null;
    setState('idle');
    setError('');
  };

  return { loading, state, error, pay, checkStatus, reset };
}

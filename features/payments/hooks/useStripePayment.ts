import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfirmPayment } from '@stripe/stripe-react-native';
import { initiatePayment } from '../api/payments.api';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';

interface UseStripePaymentResult {
  loading: boolean;
  error: string;
  pay: (bookingId: string) => Promise<boolean>;
}

export function useStripePayment(): UseStripePaymentResult {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const { confirmPayment } = useConfirmPayment();

  const pay = async (bookingId: string): Promise<boolean> => {
    setLoading(true);
    setError('');

    try {
      console.log('=== STRIPE PAY ===');
      console.log('Step 1: POST /payments/initiate, bookingId:', bookingId);

      const response = await initiatePayment({
        bookingId: Number(bookingId),
        provider: 'STRIPE',
        currency: 'CAD',
      });

      console.log('response:', JSON.stringify(response));

      const clientSecret = response.stripeClientSecret;
      if (!clientSecret) {
        setError(t('payment.errors.no_client_secret', 'No client secret received from server.'));
        return false;
      }
      console.log('✅ stripeClientSecret received');

      console.log('Step 2: confirmPayment...');
      const { error: stripeError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (stripeError) {
        console.log('❌ Stripe error:', stripeError.message);
        setError(stripeError.message ?? t('payment.errors.payment_failed', 'Payment failed. Please try again.'));
        return false;
      }

      console.log('✅ Payment confirmed');
      return true;
    } catch (err) {
      console.log('❌ Payment error:', err);
      setError(getApiErrorMessage(err, t));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, pay };
}
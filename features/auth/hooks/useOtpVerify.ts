/**
 * Go Bagage — useOtpVerify
 * Gère la vérification OTP et le renvoi de code.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { verifyOtp, sendOtp } from '../api/auth.api';
import { OTP_LENGTH } from '../../../shared/constants/app.constants';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';

interface UseOtpVerifyResult {
  loading: boolean;
  resending: boolean;
  error: string;
  verify: (phone: string, code: string[]) => Promise<boolean>;
  resend: (phone: string) => Promise<void>;
}

export function useOtpVerify(): UseOtpVerifyResult {
  const { t } = useTranslation();
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError]         = useState('');

  const verify = async (phone: string, code: string[]): Promise<boolean> => {
    const codeStr = code.join('');

    if (codeStr.length < OTP_LENGTH) {
      setError(
        t('auth.errors.otp_incomplete', {
          defaultValue: 'Please enter the {{length}}-digit code.',
          length: OTP_LENGTH,
        }),
      );
      return false;
    }

    setError('');
    setLoading(true);

    try {
      const response = await verifyOtp({
        phone,
        code: codeStr,
        purpose: 'PHONE_VERIFICATION',
      });
      return response.success;
    } catch (err) {
      setError(getApiErrorMessage(err, t));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resend = async (phone: string): Promise<void> => {
    setResending(true);
    setError('');
    try {
      await sendOtp({ phone, purpose: 'PHONE_VERIFICATION' });
    } catch (err) {
      setError(getApiErrorMessage(err, t));
    } finally {
      setResending(false);
    }
  };

  return { loading, resending, error, verify, resend };
}

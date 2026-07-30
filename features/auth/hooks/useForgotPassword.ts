/**
 * Go Bagage — useForgotPassword
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '../api/auth.api';
import { emailSchema, getFirstZodError } from '../../../shared/utils/validation.utils';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';

interface UseForgotPasswordResult {
  loading: boolean;
  error: string;
  submit: (email: string) => Promise<boolean>;
}

export function useForgotPassword(): UseForgotPasswordResult {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const submit = async (email: string): Promise<boolean> => {
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(getFirstZodError(validation) ?? t('auth.errors.email_invalid', 'Please enter a valid email address.'));
      return false;
    }

    setError('');
    setLoading(true);

    try {
      await forgotPassword({ email: email.trim().toLowerCase() });
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, t));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}
